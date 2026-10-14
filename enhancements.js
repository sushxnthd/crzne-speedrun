(()=>{
  const NS='http://www.w3.org/2000/svg';
  const $=(q)=>document.querySelector(q);
  const $$=(q)=>[...document.querySelectorAll(q)];
  const C=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const I=(t,a,b)=>C((t-a)/(b-a));
  const E=(t)=>{t=C(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  const O=(t)=>1-Math.pow(1-C(t),4);
  const L=(a,b,t)=>a+(b-a)*t;
  const show=(el,v)=>{if(el)el.style.opacity=C(v)};
  const attr=(el,k,v)=>{if(el)el.setAttribute(k,v)};
  const svg=(name,attrs={},text='')=>{const el=document.createElementNS(NS,name);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);if(text)el.textContent=text;return el};
  const add=(p,c)=>{if(p&&c)p.appendChild(c);return c};
  const text=(p,x,y,cls,content,anchor='middle')=>add(p,svg('text',{x,y,class:cls,'text-anchor':anchor},content));
  const plate=(p,x,y,w,h,cls='proof-plate',rx=16)=>add(p,svg('rect',{x,y,width:w,height:h,rx,class:cls}));
  const line=(p,x1,y1,x2,y2,cls='hud-line')=>add(p,svg('line',{x1,y1,x2,y2,class:cls}));

  function buildResults(){
    const root=$('#resultsScene'); if(!root||$('#resultEnhancement'))return;
    const g=add(root,svg('g',{id:'resultEnhancement'}));
    // ideal-value tolerance halo
    add(g,svg('rect',{id:'idealHalo',x:285,y:337,width:1350,height:36,rx:18,class:'ideal-halo'}));
    text(g,300,315,'enhancement-label','GROUND TRUTH', 'start');
    // three miss callouts, aligned to gauges 3–5
    const xs=[840,1080,1320]; const ys=[385,405,455];
    xs.forEach((x,i)=>{
      const gg=add(g,svg('g',{class:'missCallout',opacity:'0'}));
      add(gg,svg('circle',{cx:x,cy:ys[i],r:54,class:'failure-ring'}));
      add(gg,svg('path',{d:`M${x} ${355} V${ys[i]-24}`,class:'mechanical-line',stroke:'#ff7d75','stroke-width':'3'}));
      add(gg,svg('path',{d:`M${x-9} ${ys[i]-34} L${x} ${ys[i]-22} L${x+9} ${ys[i]-34}`,fill:'none',stroke:'#ff7d75','stroke-width':'3'}));
      plate(gg,x-42,ys[i]+62,84,29,'failure-chip',8);
      text(gg,x,ys[i]+82,'enhancement-micro proof-red','MISS');
    });
    // successful readout legend / failed focus legend
    const lg=add(g,svg('g',{id:'resultLegend',opacity:'0'}));
    plate(lg,650,190,620,92,'proof-plate',18);
    add(lg,svg('circle',{cx:705,cy:236,r:8,fill:'#90e6ff'}));
    text(lg,730,242,'enhancement-label','CONTAINS IDEAL','start');
    add(lg,svg('circle',{cx:1010,cy:236,r:8,fill:'#ff7d75'}));
    text(lg,1035,242,'enhancement-label','EXCLUDES IDEAL','start');
  }

  function buildWhy(){
    const root=$('#whyScene'); if(!root||$('#whyEnhancement'))return;
    const g=add(root,svg('g',{id:'whyEnhancement'}));
    [125,185,255].forEach((r,i)=>add(g,svg('circle',{cx:960,cy:458,r,fill:'none',stroke:'#90e6ff','stroke-width':i===0?2:1,'stroke-opacity':.24-i*.05,'stroke-dasharray':i===2?'7 13':'none'})));
    line(g,720,585,1200,585,'hud-line');
    text(g,960,625,'enhancement-label','THE EXPERIMENT IS PRECISE — THE EXTRAPOLATED ORIGIN IS NOT IDENTIFIED');
  }

  function buildProof(){
    const internals=$('#internals'); if(!internals||$('#proofEnhancement'))return;
    const g=add(internals,svg('g',{id:'proofEnhancement'}));
    // Unmeasured extrapolation region
    add(g,svg('rect',{id:'unmeasuredRegion',x:165,y:135,width:360,height:330,rx:22,class:'proof-region'}));
    text(g,345,176,'enhancement-label proof-amber','UNMEASURED EXTRAPOLATION REGION');
    text(g,345,203,'enhancement-micro','NO ADDITIONAL OBSERVATIONS BETWEEN λM = 1 AND ZERO');
    // Sample lock pillars at the actually observed measurement levels
    [620,1160].forEach((x,i)=>{
      const lock=add(g,svg('g',{class:'sampleLock',opacity:'0'}));
      add(lock,svg('line',{x1:x,y1:200,x2:x,y2:455,class:'scan-line'}));
      add(lock,svg('rect',{x:x-56,y:186,width:112,height:36,rx:10,class:'sample-lock'}));
      text(lock,x,210,'enhancement-micro',i===0?'SAMPLE 1':'SAMPLE 3');
      add(lock,svg('circle',{cx:x,cy:i===0?330:320,r:40,fill:'none',stroke:'#dce9ef','stroke-opacity':.22,'stroke-width':2}));
    });
    // moving scan head which travels from the sampled region toward zero
    const scan=add(g,svg('g',{id:'proofScan',opacity:'0'}));
    add(scan,svg('line',{x1:0,y1:145,x2:0,y2:460,class:'scan-line'}));
    add(scan,svg('path',{d:'M-16 145 L16 145 L0 170 Z',class:'scan-head'}));
    plate(scan,-72,108,144,32,'proof-plate',8);
    text(scan,0,130,'enhancement-micro','READ POSITION');
    // divergence bracket at zero
    const br=add(g,svg('g',{id:'zeroGap',opacity:'0'}));
    add(br,svg('path',{d:'M210 240 H185 V390 H210',class:'ambiguity-bracket'}));
    plate(br,2,276,166,78,'proof-plate',12);
    text(br,85,303,'enhancement-micro proof-amber','SAME DATA');
    text(br,85,329,'enhancement-micro proof-amber','≠ SAME ZERO');
    // constructive counterexample formula plate
    const f=add(g,svg('g',{id:'formulaPlate',opacity:'0'}));
    plate(f,415,530,770,62,'proof-plate',14);
    text(f,440,554,'enhancement-label','CONSTRUCTIVE COUNTEREXAMPLE','start');
    text(f,800,578,'enhancement-formula','f_c(λ)=f(λ)+c(λ_M−1)(λ_M−3)');
    // key reason annotation
    const why=add(g,svg('g',{id:'vanishReason',opacity:'0'}));
    plate(why,755,235,525,62,'proof-plate',14);
    text(why,1018,260,'enhancement-micro','ADDED TERM VANISHES AT λM = 1 AND 3');
    text(why,1018,283,'enhancement-micro proof-amber','…BUT CHANGES THE VALUE AT λM = 0');
  }

  function buildShots(){
    const root=$('#shotsScene'); if(!root||$('#shotsEnhancement'))return;
    const g=add(root,svg('g',{id:'shotsEnhancement'}));
    // statistical precision meter
    const m=add(g,svg('g',{id:'precisionMeter',opacity:'0'}));
    plate(m,250,175,530,116,'proof-plate',24);
    text(m,515,214,'enhancement-label','STATISTICAL UNCERTAINTY');
    add(m,svg('line',{x1:320,y1:252,x2:710,y2:252,stroke:'#415866','stroke-width':10,'stroke-linecap':'round'}));
    add(m,svg('line',{id:'precisionFill',x1:320,y1:252,x2:710,y2:252,stroke:'#90e6ff','stroke-width':10,'stroke-linecap':'round'}));
    text(m,515,279,'enhancement-micro','SHRINKS WITH MORE SHOTS');
    // ambiguity stays fixed
    const a=add(g,svg('g',{id:'ambiguityMeter',opacity:'0'}));
    plate(a,250,315,530,116,'proof-plate',24);
    text(a,515,354,'enhancement-label','ZERO-LIMIT AMBIGUITY');
    add(a,svg('line',{x1:320,y1:392,x2:710,y2:392,stroke:'#ffbd6c','stroke-width':10,'stroke-linecap':'round'}));
    text(a,515,419,'enhancement-micro proof-amber','UNCHANGED');
  }

  function setup(){
    buildResults(); buildWhy(); buildProof(); buildShots();
    const a=$('#trackA'),b=$('#trackB');
    if(a&&b){
      const la=a.getTotalLength(), lb=b.getTotalLength();
      a.dataset.len=la; b.dataset.len=lb;
      a.style.strokeDasharray=la; b.style.strokeDasharray=lb;
    }
  }

  function animate(masterT){
    // RESULTS / contradiction: 47.5–56 s
    const rp=I(masterT,48.2,53.4);
    const focus=I(masterT,51.0,54.2);
    const ideal=$('#idealHalo'); if(ideal)ideal.style.opacity=.35+.35*Math.sin(masterT*5)*focus;
    $$('.missCallout').forEach((el,i)=>{
      const p=O(I(masterT,50.1+i*.28,51.1+i*.28));
      show(el,p*I(masterT,49.8,50.5));
      attr(el,'transform',`translate(0 ${L(22,0,p)})`);
    });
    show($('#resultLegend'),O(I(masterT,48.2,49.2))*(1-I(masterT,55.0,56.1)));
    $$('.resultGauge').forEach((el,i)=>{
      if(masterT>51.2){
        const failed=[2,3,4].includes(i);
        el.style.opacity=failed?1:L(1,.32,focus);
        el.style.filter=failed?'url(#softGlow)':'none';
      }else{el.style.opacity=1;el.style.filter='none';}
    });
    const ts=$('#threeSix');
    if(ts&&masterT>=51){
      const p=O(I(masterT,51.2,52.1));
      attr(ts,'transform',`translate(${960*(1-p*.998)} ${865*(1-p*.998)}) scale(${L(.92,1,p)})`);
    }

    // WHY: 56–58 s, deliberately quiet
    const whyP=O(I(masterT,56.0,56.6))*(1-I(masterT,57.6,58.3));
    show($('#whyEnhancement'),whyP);
    if($('#whyScene')){
      const s=L(.97,1,whyP);
      attr($('#whyScene'),'transform',`translate(${960*(1-s)} ${500*(1-s)}) scale(${s})`);
    }

    // PROOF / identifiability: 58–72 s
    const proofP=O(I(masterT,58.2,59.0));
    show($('#proofEnhancement'),proofP*(1-I(masterT,79,81)));
    show($('#unmeasuredRegion'),O(I(masterT,59.0,60.2)));
    $$('.sampleLock').forEach((el,i)=>show(el,O(I(masterT,59.5+i*.22,60.3+i*.22))));
    // draw both tracks in from measured side, then travel left toward zero
    const ta=$('#trackA'),tb=$('#trackB');
    if(ta&&tb&&masterT>=58){
      const pa=O(I(masterT,59.2,62.3));
      const la=+ta.dataset.len||1, lb=+tb.dataset.len||1;
      ta.style.strokeDashoffset=String(L(la,0,pa));
      tb.style.strokeDashoffset=String(L(lb,0,pa));
      ta.style.opacity=.95; tb.style.opacity=.95;
    }
    const scanP=E(I(masterT,61.0,68.8));
    const scan=$('#proofScan'); show(scan,O(I(masterT,60.8,61.5))*(1-I(masterT,69.5,70.4)));
    if(scan)attr(scan,'transform',`translate(${L(1160,250,scanP)} 0)`);
    show($('#vanishReason'),O(I(masterT,62.0,63.2))*(1-I(masterT,67.0,68.0)));
    show($('#zeroGap'),O(I(masterT,67.8,69.2)));
    show($('#formulaPlate'),O(I(masterT,64.2,65.4))*(1-I(masterT,71.0,72.0)));
    // existing labels/readouts get stronger hierarchy at the reveal
    if($('#zeroReadouts'))show($('#zeroReadouts'),O(I(masterT,67.6,69.0)));
    if($('#differentLabel'))show($('#differentLabel'),O(I(masterT,67.1,68.2)));
    if($('#sampleLabel'))show($('#sampleLabel'),1-I(masterT,66.2,67.4));

    // MORE SHOTS: 71.5–79 s
    const sp=O(I(masterT,71.5,72.4))*(1-I(masterT,79.0,80.2));
    show($('#shotsEnhancement'),sp);
    show($('#precisionMeter'),sp);
    show($('#ambiguityMeter'),O(I(masterT,73.5,74.3))*(1-I(masterT,79.0,80.2)));
    const shrink=E(I(masterT,72.1,77.2));
    const pf=$('#precisionFill'); if(pf)attr(pf,'x2',L(710,365,shrink));
    // Keep ambiguity line exactly fixed: visual proof that more samples do not remove model ambiguity.

    // restore defaults before/after relevant windows
    if(masterT<48||masterT>56.5){$$('.resultGauge').forEach(el=>{el.style.filter='none'; if(masterT>62)el.style.opacity='';});}
  }

  const start=()=>{
    setup();
    if(typeof render!=='function')return;
    const baseRender=render;
    render=function(t){baseRender(t);animate(t)};
    // force one enhanced frame immediately
    const jump=$('#jump'); const t=jump?parseFloat(jump.value||'0'):0; render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
