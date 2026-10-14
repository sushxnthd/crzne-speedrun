"""Keep both cameras full-frame and conform them to the approved speech edit."""
import json,pathlib,subprocess
root=pathlib.Path(__file__).resolve().parents[2];plan=json.loads((root/'crzne-speedrun/recording-timeline.json').read_text());out=root/'motion-v2';out.mkdir(exist_ok=True)
for who,source,speed,duration in [('aryan','WhatsApp Video 2026-10-14 at 1.01.43 PM(3).mp4',1.1,42),('sushanth','WhatsApp Video 2026-10-14 at 1.26.23 PM(3).mp4',1,47.8)]:
 segments=plan[who+'_segments'];fs=[]
 for i,(a,b) in enumerate(segments):fs.append(f'[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS[v{i}]')
 fs.append(''.join(f'[v{i}]'for i in range(len(segments)))+f'concat=n={len(segments)}:v=1:a=0[cat]')
 fs.append(f'[cat]setpts=PTS/{speed},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30,tpad=stop_mode=clone:stop_duration=1[out]')
 subprocess.run(['ffmpeg','-y','-v','error','-threads','2','-i',str(root/'source'/source),'-filter_complex_threads','1','-filter_complex',';'.join(fs),'-map','[out]','-an','-t',str(duration),'-c:v','libx264','-threads','2','-crf','18','-preset','fast','-pix_fmt','yuv420p',str(out/(who+'.mkv'))],check=True)
 print(who+' ready',flush=True)
(out/'full.txt').write_text("file 'aryan.mkv'\nfile 'sushanth.mkv'\n")
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(out/'full.txt'),'-map','0:v','-c','copy',str(out/'full-footage.mkv')],check=True)
# Retain the already verified voice mastering and exact editorial cuts.
subprocess.run(['ffmpeg','-y','-v','error','-i',str(root/'source/CRZNE_IRIS_Final.mp4'),'-vn','-ar','48000','-ac','2','-c:a','pcm_s16le',str(out/'narration.wav')],check=True)
