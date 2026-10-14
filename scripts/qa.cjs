/* Reproducible browser audit + every-frame capture. npm install playwright. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
let PNG;try{PNG=require('pngjs').PNG}catch{PNG=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/pngjs').PNG}
let pw;try{pw=require('playwright')}catch{pw=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright')}
(async()=>{
 const out=path.resolve(process.env.QA_OUT||'qa');fs.mkdirSync(out,{recursive:true});
 const browser=await pw.chromium.launch({executablePath:process.env.CHROME||undefined,headless:true,args:['--no-sandbox',...(process.env.QA_SINGLE_PROCESS?['--no-zygote','--single-process','--disable-gpu']:[])]});
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 let server,url=process.env.QA_URL;
 if(!url){
   const root=process.cwd(),types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.ttf':'font/ttf'};
   server=http.createServer((req,res)=>{const relative=new URL(req.url,'http://localhost').pathname,file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}try{res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))}catch{res.writeHead(404);res.end()}});
   await new Promise(r=>server.listen(0,'127.0.0.1',r));url=`http://127.0.0.1:${server.address().port}/?present=1`;
 }
 await page.goto(url);await page.waitForFunction(()=>window.CRZNEFinal);
 await page.evaluate(async()=>{await Promise.all([document.fonts.load('600 24px "CRZNE Inter"','Δ λ − ≠'),document.fonts.load('italic 520 32px "CRZNE Inter"','f c λ'),document.fonts.load('400 24px "CRZNE Operators"','→ ≠'),document.fonts.load('600 24px "CRZNE Operators"','→ ≠')]);await document.fonts.ready;render(0)});
 const result=await page.evaluate(()=>runCRZNEFrameAudit());result.browserErrors=errors;result.fontFaces=await page.evaluate(()=>[...document.fonts].filter(f=>f.family.startsWith('CRZNE')).map(f=>({family:f.family,style:f.style,status:f.status})));if(result.fontFaces.length!==6||result.fontFaces.some(f=>f.status!=='loaded'))throw Error('Required local font faces did not load');
 fs.writeFileSync(path.join(out,'frame-audit.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(result.status!=='pass'||errors.length){await browser.close();process.exit(1)}
 // Verify reverse / arbitrary seeking using exact SVG state and bounded edge-AA differences at full resolution.
 const signature=()=>[...document.querySelectorAll('#finalFilm text,#finalFilm path,#finalFilm rect,#finalFilm circle,#finalFilm polygon,#finalFilm line')].filter(e=>{for(let n=e;n&&n.nodeType===1;n=n.parentElement){const c=getComputedStyle(n);if(+c.opacity===0||c.display==='none')return false}return true}).map(e=>{const c=getComputedStyle(e),m=e.getCTM();return [e.id,e.tagName,e.textContent,e.getAttribute('d'),e.getAttribute('points'),e.getAttribute('cx'),e.getAttribute('cy'),e.getAttribute('x'),e.getAttribute('y'),c.fill,c.stroke,c.opacity,m?.a,m?.b,m?.c,m?.d,m?.e,m?.f]}).map(x=>JSON.stringify(x)).join('\n');
 const states=new Map();
 const samples=[0,4,12,16,20,24,28,31.5,34,37,39,41.5,45,48,52,56,58,60,64,69,71.5,75,77.5,80,85,87,89,90],baseline=new Map();
 for(const t of samples){await page.evaluate(t=>render(t),t);baseline.set(t,await page.screenshot());states.set(t,await page.evaluate(signature));}
 let maximumSeekPixels=0;
 for(const t of samples.toReversed()){
   await page.evaluate(t=>{render(t);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))},t);
   if(states.get(t)!==await page.evaluate(signature))throw Error('Rendered SVG state depends on seek history at '+t);
   const a=PNG.sync.read(baseline.get(t)).data,b=PNG.sync.read(await page.screenshot()).data;let changed=0,max=0;
   for(let i=0;i<a.length;i+=4){const d=Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),Math.abs(a[i+2]-b[i+2]));if(d)changed++;max=Math.max(max,d)}
   maximumSeekPixels=Math.max(maximumSeekPixels,changed);
   // Permit only subpixel edge antialiasing: <=0.05% pixels, <=32/255 per channel.
   if(changed>1920*1080*.0005||max>32)throw Error(`Reverse seek mismatch at ${t}: ${changed} pixels / max channel delta ${max}`);
 }
 result.seekChecks=samples.length;result.maxSeekEdgePixels=maximumSeekPixels;console.log('Reverse seek passed: '+samples.length+' frames; max edge-AA pixels '+maximumSeekPixels);
 const boundaries=[4,16,20,24,28,31.5,37,41.5,45,48,56,60,64,65.3,66.6,67.7,70.5,71.5,77.5,79,81,85,85.3,86.7,87,88.2,89];
 const times=[...new Set([...samples,...boundaries.flatMap(t=>[t-.25,t,t+.25])])].sort((a,b)=>a-b);
 await page.evaluate(()=>document.body.classList.add('safe-guide'));
 for(const t of times){await page.evaluate(t=>render(t),t);await page.screenshot({path:path.join(out,'key-'+t.toFixed(3)+'.png')})}
 console.log('Captured '+times.length+' master / boundary frames with speaker mask');
 if(process.env.QA_ALL_FRAMES==='1'){
   const frames=path.join(out,'frames');fs.mkdirSync(frames,{recursive:true});await page.evaluate(()=>document.body.classList.remove('safe-guide'));const rasterWidth=Number(process.env.QA_FRAME_WIDTH||1920);await page.setViewportSize({width:rasterWidth,height:Math.round(rasterWidth*9/16)});result.rasterResolution=[rasterWidth,Math.round(rasterWidth*9/16)];
   for(let f=0;f<2700;f++){await page.evaluate(f=>render(f/30),f);await page.screenshot({path:path.join(frames,String(f).padStart(4,'0')+'.png')});if(f%300===0)console.log('Rasterized frame '+f+' / 2700')}
   result.rasterFrames=2700;
 }
 await page.setViewportSize({width:1920,height:1080});
 for(const t of [22,26,30,34,39,58,69,75,82,89]){await page.evaluate(t=>render(t),t);await page.screenshot({path:path.join(out,'detail-'+t+'.png'),clip:{x:80,y:280,width:1060,height:650},scale:'css'})}
 // Transparent compositing mode must have no backdrop on the speaker side.
 await page.evaluate(()=>{document.body.classList.remove('safe-guide');document.body.classList.add('overlay');render(69)});await page.screenshot({path:path.join(out,'overlay-69.png'),omitBackground:true});
 const overlay=PNG.sync.read(fs.readFileSync(path.join(out,'overlay-69.png')));
 for(let y=0;y<1080;y++)for(let x=1220;x<1920;x++)if(overlay.data[(y*1920+x)*4+3]!==0)throw Error('Speaker region is not transparent');
 result.transparentSpeakerPixels=700*1080;
 fs.writeFileSync(path.join(out,'frame-audit.json'),JSON.stringify(result,null,2));await browser.close();if(server)await new Promise(r=>server.close(r));
})().catch(e=>{console.error(e);process.exit(1)});
