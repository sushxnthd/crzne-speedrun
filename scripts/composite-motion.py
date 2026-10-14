"""Composite validated transparent motion over the full-frame camera track."""
import pathlib,subprocess,json
root=pathlib.Path(__file__).resolve().parents[2];out=root/'motion-v2'
for n in range(2694):
 with (out/'frames'/f'{n:04}.png').open('rb') as f:h=f.read(26)
 assert h[:8]==b'\x89PNG\r\n\x1a\n' and h[25]==6,(n,'Every frame must be RGBA')
final=out/'CRZNE_IRIS_Final.mp4';tmp=out/'CRZNE_IRIS_Motion.mkv'
subprocess.run(['ffmpeg','-y','-v','warning','-threads','2','-i',str(out/'full-footage.mkv'),'-thread_queue_size','64','-framerate','30','-i',str(out/'frames/%04d.png'),'-i',str(out/'narration.wav'),'-filter_complex_threads','1','-filter_complex','[0:v]setpts=PTS-STARTPTS,fps=30[base];[base][1:v]overlay=0:0:format=auto[raw];[raw]fps=30,setpts=N/(30*TB)[out]','-map','[out]','-map','2:a','-frames:v','2694','-t','89.8','-r','30','-fps_mode','cfr','-c:v','libx264','-threads','2','-crf','19','-preset','medium','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000',str(tmp)],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(tmp),'-map','0','-c','copy','-movflags','+faststart',str(final)],check=True)
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(final)]));v=next(s for s in info['streams']if s['codec_type']=='video');assert v['nb_frames']=='2694'and v['avg_frame_rate']=='30/1'and [v['width'],v['height']]==[1920,1080]and float(info['format']['duration'])<90
(out/'final-probe.json').write_text(json.dumps(info,indent=2));print(str(final),final.stat().st_size,flush=True)
