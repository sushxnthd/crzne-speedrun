(()=>{
  const params=new URLSearchParams(location.search);
  if(params.get('audit')!=='1')return;
  const $=q=>document.querySelector(q);
  const critical=['#ahZNECarriage','#ahGCass0','#ahGCass1','#ahGCass2','#ahLCarriage','#ahMHead0','#ahMHead1','#ahMHead2','#ahSelector','#ahDialFace','#ahHandwheel','#ahFailureBank','#ahPanel','#ahScan','#ahKey0','#ahKey1','#ahKey2','#ahLatch'];
  const oldVisuals=['#machine','#zne','#modules','#cubeScene','#interactionScene','#resultsScene','#cutawayScene','#shotsScene','#finalScene'];
  const issues=[];const prev=new Map();let maxJump={value:0,id:'',frame:0};let checked=0;
  const num=x=>Number.isFinite(+x)?+x:0;
  function effectiveOpacity(el){let o=1,n=el;while(n&&n.nodeType===1){const c=getComputedStyle(n);o*=num(c.opacity||1);if(c.display==='none'||c.visibility==='hidden')return 0;n=n.parentElement;}return o;}
  function center(el){const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2,r.width,r.height];}
  function add(frame,type,msg){if(issues.length<120)issues.push({frame,type,msg});}
  function checkTheme(frame){
    if(frame!==0&&frame%30!==0)return;
    const bg=getComputedStyle(document.body).backgroundColor.match(/\d+/g);if(bg){const l=(+bg[0]+ +bg[1]+ +bg[2])/3;if(l<180)add(frame,'theme',`body background too dark: ${bg.slice(0,3).join(',')}`);}
    if($('#captionBox'))add(frame,'caption','reference narration caption still in DOM');
    document.querySelectorAll('svg rect').forEach(el=>{
      if(effectiveOpacity(el)<.08)return;const r=el.getBoundingClientRect();if(r.width*r.height<220000)return;
      const m=getComputedStyle(el).fill.match(/\d+/g);if(m){const l=(+m[0]+ +m[1]+ +m[2])/3;if(l<95)add(frame,'dark-scrim',`large dark rect ${el.id||el.parentElement?.id||'unnamed'} luminance ${l.toFixed(0)}`);}
    });
    document.querySelectorAll('#anatomyHero *').forEach(el=>{if(effectiveOpacity(el)>.08&&getComputedStyle(el).filter!=='none')add(frame,'effect',`unexpected filter on ${el.id||el.className?.baseVal||el.tagName}`);});
  }
  function checkFrame(frame){
    const t=frame/30;render(t);checked++;
    const hero=$('#anatomyHero');if(t>=8&&(!hero||effectiveOpacity(hero)<.05))add(frame,'visibility','Anatomy rig unexpectedly invisible');
    if(t>=8)oldVisuals.forEach(q=>{const el=$(q);if(el&&effectiveOpacity(el)>.015)add(frame,'legacy',`${q} visible behind Anatomy rig`);});
    document.querySelectorAll('#stage [transform],#stage [style]').forEach(el=>{
      const v=(el.getAttribute('transform')||'')+' '+(el.getAttribute('style')||'');if(/NaN|Infinity/.test(v))add(frame,'numeric',`${el.id||el.tagName} contains ${v.match(/NaN|Infinity/)?.[0]}`);
      const op=el.style?.opacity;if(op!==''&&op!=null){const n=+op;if(!Number.isFinite(n)||n<-.001||n>1.001)add(frame,'opacity',`${el.id||el.tagName} opacity ${op}`);}
    });
    critical.forEach(id=>{const el=$(id);if(!el)return;const c=center(el);if(!c.every(Number.isFinite)){add(frame,'geometry',`${id} invalid bounds`);return;}if(c[0]<-700||c[0]>2620||c[1]<-700||c[1]>1780)add(frame,'geometry',`${id} escaped stage (${c[0].toFixed(0)},${c[1].toFixed(0)})`);const p=prev.get(id);if(p){const jump=Math.hypot(c[0]-p[0],c[1]-p[1]);if(jump>maxJump.value)maxJump={value:jump,id,frame};if(jump>42)add(frame,'continuity',`${id} jumped ${jump.toFixed(1)} px in one frame`);}prev.set(id,c);});
    if(t>=79.7&&t<=81.05){const a=$('#ahProof'),b=$('#ahInterlocks');const sum=(a?effectiveOpacity(a):0)+(b?effectiveOpacity(b):0);if(sum>1.18)add(frame,'handoff',`proof/interlock overlap too strong (${sum.toFixed(2)})`);}
    checkTheme(frame);
  }
  function run(){
    if(typeof render!=='function')return setTimeout(run,25);
    for(let f=0;f<2700;f++)checkFrame(f);
    const out=document.createElement('pre');out.id='frameAudit';out.dataset.status=issues.length?'fail':'pass';out.dataset.frames=String(checked);out.dataset.maxJump=maxJump.value.toFixed(2);out.textContent=JSON.stringify({status:out.dataset.status,frames:checked,maxJump,issues},null,2);document.body.appendChild(out);
    document.documentElement.dataset.auditStatus=out.dataset.status;
  }
  if(document.readyState==='complete')setTimeout(run,0);else window.addEventListener('load',()=>setTimeout(run,0),{once:true});
})();
