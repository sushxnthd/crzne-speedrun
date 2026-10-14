import json,pathlib,subprocess,argparse
p=argparse.ArgumentParser();p.add_argument('--aryan',required=True);p.add_argument('--sushanth',required=True);p.add_argument('--output-dir',required=True);args=p.parse_args()
root=pathlib.Path(args.output_dir).resolve();root.mkdir(parents=True,exist_ok=True)
plan=json.loads(pathlib.Path('recording-timeline.json').read_text())
inputs=[pathlib.Path(args.aryan),pathlib.Path(args.sushanth)]
for i,(who,segments,speed) in enumerate([('aryan',plan['aryan_segments'],1.1),('sushanth',plan['sushanth_segments'],1)]):
    filters=[]
    for n,(a,b) in enumerate(segments):
        filters.append(f'[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS[v{n}]')
        filters.append(f'[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.005,afade=t=out:st={max(0,b-a-.005)}:d=0.005[a{n}]')
    filters.append(''.join(f'[v{n}][a{n}]' for n in range(len(segments)))+f'concat=n={len(segments)}:v=1:a=1[vcat][acat]')
    crop='crop=466:720:525:0,scale=700:1080' if who=='aryan' else 'crop=398:478:285:0,scale=700:840,pad=700:1080:0:120:color=0xf7f5ef'
    filters.append(f'[vcat]setpts=PTS/{speed},{crop},fps=30,setsar=1[vout]')
    filters.append(f'[acat]atempo={speed},highpass=f=70,lowpass=f=13000,alimiter=limit=0.95:level=false[aout]')
    filterpath=root/(who+'-edit.ffscript');filterpath.write_text(';\n'.join(filters))
    raw=root/(who+'-raw-edit.mp4')
    subprocess.run(['ffmpeg','-y','-v','error','-threads','2','-i',str(inputs[i]),'-filter_complex_script',str(filterpath),'-map','[vout]','-map','[aout]','-c:v','libx264','-threads','2','-crf','18','-preset','fast','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000',str(raw)],check=True)
    length=plan['handoff'] if who=='aryan' else segments[0][1]-segments[0][0]
    subprocess.run(['ffmpeg','-y','-v','error','-threads','2','-i',str(raw),'-vf','fps=30,tpad=stop_mode=clone:stop_duration=1','-af','apad=pad_dur=1','-t',str(length),'-c:v','libx264','-threads','2','-crf','18','-preset','fast','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000',str(root/(who+'-edited.mp4'))],check=True)
    print(who+' edited',flush=True)
concat=root/'speakers.txt';concat.write_text("file 'aryan-edited.mp4'\nfile 'sushanth-edited.mp4'\n")
# Camera track and narration are composed separately; keep original source footage external.
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(concat),'-map','0:v','-an','-c:v','copy',str(root/'speakers-camera.mkv')],check=True)
for who in ['aryan','sushanth']:
    result=subprocess.run(['ffmpeg','-v','info','-i',str(root/(who+'-edited.mp4')),'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    stats=json.loads(result.stderr[result.stderr.rfind('{'):]);(root/(who+'-loudness.json')).write_text(json.dumps(stats,indent=2))
    norm='loudnorm=I=-16:TP=-1.5:LRA=9:'+':'.join(['measured_I='+stats['input_i'],'measured_TP='+stats['input_tp'],'measured_LRA='+stats['input_lra'],'measured_thresh='+stats['input_thresh'],'offset='+stats['target_offset'],'linear=true'])
    subprocess.run(['ffmpeg','-y','-v','error','-threads','2','-i',str(root/(who+'-edited.mp4')),'-vn','-af',norm,'-ar','48000','-ac','2','-c:a','pcm_s16le',str(root/(who+'-normalized.wav'))],check=True)
(root/'audio.txt').write_text("file 'aryan-normalized.wav'\nfile 'sushanth-normalized.wav'\n")
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(root/'audio.txt'),'-af','apad=pad_dur=1,afade=t=out:st=89.5:d=0.3','-t',str(plan['duration']),'-ar','48000','-c:a','pcm_s16le',str(root/'narration.wav')],check=True)
print('Camera and balanced narration tracks ready',flush=True)
