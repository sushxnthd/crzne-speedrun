/* All-frame audit and transparent render of the recording-conformed animation. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const pw=require('playwright'),{PNG}=require('pngjs');
(async()=>{
 const root=process.cwd(),plan=JSON.parse(fs.readFileSync('recording-timeline.json')),out=path.resolve(process.env.QA_OUT||'qa-recorded');fs.mkdirSync(path.join(out,'frames'),{recursive:true});
 const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname,f=path.resolve(root,'.'+(p==='/'?'/index.html':p));if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return}try{const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.ttf':'font/ttf'};res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f))}catch{res.writeHead(404).end()}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await pw.chromium.launch({executablePath:process.env.CHROME||undefined,headless:true,args:['--no-sandbox',...(process.env.QA_SINGLE_PROCESS?['--no-zygote','--single-process','--disable-gpu']:[])]});
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/?recorded=1&present=1&overlay=1&paper=1`);await page.waitForFunction(()=>window.CRZNERecordedReady||window.CRZNERecordedError);await page.evaluate(async()=>{await Promise.all([document.fonts.load('600 24px "CRZNE Inter"','Δ λ'),document.fonts.load('italic 520 32px "CRZNE Inter"','f c λ'),document.fonts.load('400 24px "CRZNE Operators"','→ ≠'),document.fonts.load('600 24px "CRZNE Operators"','→ ≠')]);await document.fonts.ready});
 const frames=Math.round(plan.duration*30);
 const audit=await page.evaluate(({frames,plan})=>{
   const issues=[],previous=new Map();let pairs=0,maxJump=0;
   const opacity=e=>{let v=1;for(let n=e;n&&n.nodeType===1;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')return 0;v*=+s.opacity}return v};
   const texts=[...document.querySelectorAll('#finalFilm text,#recordedNotes text,#recordedFootnote')];
   for(let frame=0;frame<frames;frame++){
    const t=frame/30;render(t);const n=CRZNERecorded.nominal(t),s=CRZNEFinal.stateAt(n),boxes=[];
    for(const e of texts){if(opacity(e)<.02||!e.textContent)continue;const r=e.getBoundingClientRect();if(r.left<60||r.top<65||r.right>1875||r.bottom>1020)issues.push({frame,type:'bounds',text:e.textContent,box:[r.left,r.top,r.right,r.bottom]});if(r.width)boxes.push({e,r})}
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){pairs++;const a=boxes[i],b=boxes[j],w=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left),h=Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);if(w>2&&h>2)issues.push({frame,type:'text-collision',a:a.e.textContent,b:b.e.textContent})}
    if(s.release>0&&s.key.some(x=>x<1))issues.push({frame,type:'interlock'});
    if(CRZNERecorded.fullAt(n)<.001)for(const {e,r}of boxes)if(r.right>1160.5&&e.id!=='recordedFootnote')issues.push({frame,type:'speaker-safe',text:e.textContent});
    for(const id of ['ahSelector','ahKey0','ahKey1','ahKey2','fdScan']){const e=document.getElementById(id);if(!e)continue;const on=opacity(e)>.08,r=e.getBoundingClientRect(),p=[r.x+r.width/2,r.y+r.height/2],old=previous.get(id);if(on&&old?.on){const j=Math.hypot(p[0]-old.p[0],p[1]-old.p[1]);maxJump=Math.max(maxJump,j);if(j>65)issues.push({frame,type:'continuity',id,j})}previous.set(id,{on,p})}
    if(issues.length>150)break;
   }
   render(plan.duration);return {status:issues.length?'fail':'pass',frames,pairs,maxJump,issues,proof:{zeroA:CRZNEFinal.A(0),zeroB:CRZNEFinal.B(0),sample1:CRZNEFinal.A(1)-CRZNEFinal.B(1),sample3:CRZNEFinal.A(3)-CRZNEFinal.B(3)}};
 },{frames,plan});
 audit.browserErrors=errors;audit.fontFaces=await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status})));fs.writeFileSync(path.join(out,'frame-audit.json'),JSON.stringify(audit,null,2));console.log(JSON.stringify(audit));if(audit.status!=='pass'||errors.length)throw Error('Recorded frame audit failed');
 const samples=[0,3,9,15,20,25,30,35,40,plan.handoff,45,50,55,60,65,70,75,80,85,88,89.5],baseline=new Map();
 for(const t of samples){await page.evaluate(t=>render(t),t);baseline.set(t,await page.screenshot({omitBackground:true}));await page.screenshot({path:path.join(out,'key-'+t.toFixed(3)+'.png'),omitBackground:true})}
 let maxSeekPixels=0;
 for(const t of samples.toReversed()){await page.evaluate(t=>{render(t);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))},t);const a=PNG.sync.read(baseline.get(t)).data,b=PNG.sync.read(await page.screenshot({omitBackground:true})).data;let changed=0,max=0;for(let i=0;i<a.length;i+=4){const d=Math.max(...[0,1,2,3].map(k=>Math.abs(a[i+k]-b[i+k])));if(d)changed++;max=Math.max(max,d)}maxSeekPixels=Math.max(maxSeekPixels,changed);if(changed>1920*1080*.0005||max>32)throw Error(`Reverse seek mismatch: ${t} / ${changed} / ${max}`)}
 audit.reverseSeekChecks=samples.length;audit.maxSeekPixels=maxSeekPixels;console.log('Recorded reverse seek passed');
 // Chrome writes opaque views as RGB and transparent views as RGBA. Pin RGBA
 // so ffmpeg cannot reinitialize filters or reset clocks at a format change.
 if(process.env.QA_ALL_FRAMES==='1')for(let f=0;f<frames;f++){const state=await page.evaluate(t=>render(t),f/30);if(process.env.QA_PATCH_TRANSITIONS==='1'&&(state.full===0||state.full===1))continue;const png=PNG.sync.read(await page.screenshot({omitBackground:true}));fs.writeFileSync(path.join(out,'frames',String(f).padStart(4,'0')+'.png'),PNG.sync.write(png,{colorType:6}));if(f%300===0)console.log(`Recorded raster ${f} / ${frames}`)}
 fs.writeFileSync(path.join(out,'frame-audit.json'),JSON.stringify(audit,null,2));await browser.close();await new Promise(r=>server.close(r));
})().catch(e=>{console.error(e);process.exit(1)});
