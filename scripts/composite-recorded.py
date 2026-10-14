"""Composite a conformed camera track, mastered narration, and RGBA animation.

Camera track is 700x1080, aligned to recording-timeline.json. Source recordings
remain external to the repository. Requires ffmpeg / ffprobe.
"""
import argparse,json,pathlib,subprocess
p=argparse.ArgumentParser();p.add_argument('--camera',required=True);p.add_argument('--audio',required=True);p.add_argument('--frames',default='qa-recorded/frames');p.add_argument('--output',required=True);args=p.parse_args()
duration=json.loads(pathlib.Path('recording-timeline.json').read_text())['duration']
for frame in range(round(duration*30)):
    png=pathlib.Path(args.frames)/(str(frame).zfill(4)+'.png')
    with png.open('rb') as file:header=file.read(26)
    if header[:8]!=b'\x89PNG\r\n\x1a\n' or header[25]!=6:
        raise ValueError('Render every PNG as RGBA to preserve filter timing: '+str(png))
output=pathlib.Path(args.output).resolve();output.parent.mkdir(parents=True,exist_ok=True);intermediate=output.with_suffix('.mkv')
subprocess.run(['ffmpeg','-y','-v','warning','-threads','2','-f','lavfi','-i','color=c=0xf7f5ef:s=1920x1080:r=30','-threads','2','-i',args.camera,'-thread_queue_size','64','-framerate','30','-i',str(pathlib.Path(args.frames)/'%04d.png'),'-i',args.audio,'-filter_complex_threads','1','-filter_complex','[0:v][1:v]overlay=x=1220:y=0:eof_action=repeat[cam];[cam][2:v]overlay=0:0:format=auto[raw];[raw]fps=30,setpts=N/(30*TB)[out]','-map','[out]','-map','3:a','-t',str(duration),'-frames:v',str(round(duration*30)),'-r','30','-fps_mode','cfr','-c:v','libx264','-threads','2','-preset','medium','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000',str(intermediate)],check=True)
subprocess.run(['ffmpeg','-y','-v','warning','-i',str(intermediate),'-map','0','-c','copy','-movflags','+faststart',str(output)],check=True)
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(output)]))
video=next(s for s in info['streams']if s['codec_type']=='video');audio=next(s for s in info['streams']if s['codec_type']=='audio')
assert [video['width'],video['height']]==[1920,1080] and video['avg_frame_rate']=='30/1' and int(video['nb_frames'])==round(duration*30) and float(info['format']['duration'])<=90
output.with_suffix('.json').write_text(json.dumps(info,indent=2));print(json.dumps({'output':str(output),'duration':info['format']['duration'],'frames':video['nb_frames'],'audio':audio['codec_name'],'bytes':output.stat().st_size}),flush=True)
