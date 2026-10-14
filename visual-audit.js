/* Frame-complete final master QA. Run in Chrome with ?audit=1&present=1. */
(()=>{
  const $=q=>document.querySelector(q);
  let styles=new Map(),opacities=new Map();
  const style=e=>{if(!styles.has(e))styles.set(e,getComputedStyle(e));return styles.get(e)};
  function opacity(el){
    if(!el||el.nodeType!==1)return 1;if(opacities.has(el))return opacities.get(el);
    const parent=opacity(el.parentElement);if(parent===0){opacities.set(el,0);return 0}
    const c=style(el),v=c.display==='none'||c.visibility==='hidden'?0:parent*(+c.opacity);opacities.set(el,v);return v;
  }
  function run(){
    const F=window.CRZNEFinal;if(!F)throw Error('Final director not loaded');
    const issues=[],previous=new Map();let maxJump={value:0,id:'',frame:0},maxRight=0;
    const add=(frame,type,msg)=>{if(issues.length<150)issues.push({frame,type,msg})};
    const leaf=[...document.querySelectorAll('#finalFilm text,#finalFilm path,#finalFilm rect,#finalFilm circle,#finalFilm polygon,#finalFilm line')].filter(e=>e.id!=='paperBacking'&&!e.closest('#ahFrame'));
    const tracked=['ahGCass0','ahGCass1','ahGCass2','ahLCarriage','ahMHead0','ahMHead1','ahMHead2','ahSelector','ahDialFace','ahPanel','fdScan','ahKey0','ahKey1','ahKey2','ahLatch'].map(id=>$('#'+id));
    for(let frame=0;frame<2700;frame++){
      const t=frame/30;render(t);styles=new Map();opacities=new Map();const s=F.stateAt(t);
      for(const el of leaf){
        const raw=(el.getAttribute('transform')||'')+' '+(el.getAttribute('d')||'')+' '+(el.getAttribute('style')||'');
        if(/NaN|Infinity/.test(raw))add(frame,'numeric',el.id||el.tagName);
        if(opacity(el)<.02)continue;
        const r=el.getBoundingClientRect();if(r.width===0&&r.height===0)continue;const mat=$('#stage').getScreenCTM();const x=(r.right-mat.e)/mat.a,y=(r.bottom-mat.f)/mat.d,left=(r.left-mat.e)/mat.a,top=(r.top-mat.f)/mat.d;
        maxRight=Math.max(maxRight,x);
        if(x>1160.5||left<59.5||y>1005.5||top<74.5)add(frame,'bounds',`${el.id||el.parentElement.id||el.tagName}: [${left.toFixed(1)},${top.toFixed(1)},${x.toFixed(1)},${y.toFixed(1)}]`);
        const c=style(el);if(c.filter!=='none')add(frame,'effect',el.id||el.tagName);
        for(const color of [c.fill,c.stroke])if(/rgb\((144, 230, 255|255, 125, 117)\)/.test(color))add(frame,'palette',el.id||el.tagName);
      }
      for(const el of tracked){if(!el)continue;const on=opacity(el)>.08,r=el.getBoundingClientRect(),p=[r.x+r.width/2,r.y+r.height/2],old=previous.get(el.id);if(on&&old?.on){const jump=Math.hypot(p[0]-old.p[0],p[1]-old.p[1]);if(jump>maxJump.value)maxJump={value:jump,id:el.id,frame};if(jump>42)add(frame,'continuity',`${el.id}: ${jump.toFixed(2)} px`)}previous.set(el.id,{on,p})}
      if(opacity($('#captionBox'))!==0||$('#captionBox').getAttribute('aria-hidden')!=='true')add(frame,'caption','caption visible or not aria-hidden');
      if(Math.abs(F.A(1)-F.B(1))>1e-12||Math.abs(F.A(3)-F.B(3))>1e-12||Math.abs(s.gap-.058)>1e-12)add(frame,'proof','sample equality / zero gap');
      if(s.release>0&&s.key.some(p=>p<1))add(frame,'interlock','latch opened before all keys seated');
      if(t>=71.5&&t<77.5&&$('#fdPrecision text').textContent!==s.shots.toLocaleString('en-US'))add(frame,'shots','readout disagrees with state');
      if(t>=49.5&&t<=55&&document.querySelectorAll('#fdCoverage [data-coverage="excludes"]').length!==3)add(frame,'coverage','not exactly 3 exclusions');
      if(t>=44.5&&t<=45.5){for(const e of document.querySelectorAll('#fdPositiveControl circle'))if(+e.getAttribute('cx')!==+e.dataset.holdX&&e.dataset.holdX)add(frame,'handoff','control geometry moved');else e.dataset.holdX=e.getAttribute('cx')}
    }
    render(90);if(F.stateAt(90).release!==1)add(2700,'endpoint','final release incomplete');
    const result={status:issues.length?'fail':'pass',frames:2700,fps:30,duration:90,maxRight,maxJump,proof:{sample1:F.A(1)-F.B(1),sample3:F.A(3)-F.B(3),zeroGap:F.A(0)-F.B(0)},issues};
    window.CRZNEAuditResult=result;
    return result;
  }
  window.runCRZNEFrameAudit=run;
  if(new URLSearchParams(location.search).get('audit')==='1')window.addEventListener('load',()=>{const r=run(),out=document.createElement('pre');out.id='frameAudit';out.dataset.status=r.status;out.dataset.frames='2700';out.textContent=JSON.stringify(r,null,2);document.body.appendChild(out);document.documentElement.dataset.auditStatus=r.status},{once:true});
})();
