"""Verify every delivered frame against the camera and its RGBA overlay."""
import pathlib,subprocess,json,numpy as np
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[2];out=root/'motion-v2';n=2694;w,h=640,360
cmd=lambda f:['ffmpeg','-v','error','-threads','2','-i',str(f),'-an','-vf',f'scale={w}:{h}:flags=area','-vsync','0','-f','rawvideo','-pix_fmt','rgb24','-']
a=subprocess.Popen(cmd(out/'full-footage.mkv'),stdout=subprocess.PIPE,stderr=subprocess.PIPE)
b=subprocess.Popen(cmd(out/'CRZNE_IRIS_Final.mp4'),stdout=subprocess.PIPE,stderr=subprocess.PIPE)
maximum=0;means=[];issues=[];alpha=[]
for f in range(n):
 ca=a.stdout.read(w*h*3);vi=b.stdout.read(w*h*3)
 if len(ca)!=w*h*3 or len(vi)!=w*h*3:raise ValueError(('Decode ended early',f,len(ca),len(vi)))
 bg=Image.frombytes('RGB',(w,h),ca).convert('RGBA');img=Image.open(out/'frames'/f'{f:04}.png').convert('RGBA')
 al=np.asarray(img)[:,:,3];safe=int(al[:,1100:].max());alpha.append(safe)
 if safe:issues.append({'frame':f,'type':'face-zone-alpha','alpha':safe})
 bg.alpha_composite(img.resize((w,h),Image.Resampling.BOX));expected=np.asarray(bg)[:,:,:3].astype(np.int16);actual=np.frombuffer(vi,np.uint8).reshape(h,w,3).astype(np.int16)
 error=np.abs(expected-actual).mean();means.append(float(error));maximum=max(maximum,error)
 if error>8:issues.append({'frame':f,'type':'pixel-difference','mean':float(error)})
 if f%450==0:print(f,'frames checked; max mean difference',round(maximum,3),flush=True)
for proc in [a,b]:proc.stdout.close();proc.wait();assert proc.returncode==0,proc.stderr.read().decode()
# Actual audio and video must decode without warnings, truncation or missing packets.
dec=subprocess.run(['ffmpeg','-v','error','-i',str(out/'CRZNE_IRIS_Final.mp4'),'-f','null','-'],capture_output=True,text=True);assert dec.returncode==0 and not dec.stderr,dec.stderr
proof={'sample1_difference':float(np.exp(-.05)-np.exp(-.05-.02*(1-1)*(1-3))),'sample3_difference':float(np.exp(-.15)-np.exp(-.15-.02*(3-1)*(3-3))),'zero_A':1,'zero_B':float(np.exp(-.06))}
report={'status':'pass'if not issues else'fail','frames':n,'right_zone_alpha_max':max(alpha),'mean_pixel_difference':float(np.mean(means)),'max_frame_mean_pixel_difference':float(maximum),'issues':issues,'proof':proof,'audio_decode':'pass'}
(out/'delivery-qa.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True);assert not issues
