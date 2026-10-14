(()=>{
  const NS='http://www.w3.org/2000/svg';
  const $=(q)=>document.querySelector(q);
  const $$=(q)=>[...document.querySelectorAll(q)];
  const C=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const I=(t,a,b)=>C((t-a)/(b-a));
  const O=t=>1-Math.pow(1-C(t),4);
  const E=t=>{t=C(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  const L=(a,b,t)=>a+(b-a)*t;
  const svg=(n,a={},txt='')=>{const e=document.createElementNS(NS,n);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));if(txt)e.textContent=txt;return e};
  const add=(p,c)=>{if(p)p.appendChild(c);return c};
  const show=(e,v)=>{if(e)e.style.opacity=C(v)};
  const text=(p,x,y,cls,s,anchor='middle')=>add(p,svg('text',{x,y,class:cls,'text-anchor':anchor},s));

  function buildZNEScreen(){
    const root=$('#zne'); if(!root||$('#zneResponseScreen'))return;
    const g=add(root,svg('g',{id:'zneResponseScreen',opacity:'0',transform:'translate(615 215)'}));
    add(g,svg('rect',{width:610,height:250,rx:24,fill:'#081117',stroke:'#405765','stroke-width':'2'}));
    add(g,svg('rect',{x:22,y:22,width:566,height:206,rx:17,fill:'#0b151c',stroke:'#213640'}));
    text(g,48,52,'enhancement-label','SCHEMATIC RESPONSE','start');
    text(g,48,76,'enhancement-micro','MEASURE AT HIGHER NOISE → INFER UNSAMPLED ZERO','start');
    // graph axes
    add(g,svg('path',{d:'M90 190 V92 M90 190 H540',fill:'none',stroke:'#708592','stroke-width':'2'}));
    text(g,548,197,'enhancement-micro','λ','start');
    text(g,72,90,'enhancement-micro','O(λ)','end');
    [90,245,470].forEach((x,i)=>{add(g,svg('line',{x1:x,y1:185,x2:x,y2:195,stroke:'#708592','stroke-width':'2'}));text(g,x,216,'enhancement-micro',i===0?'0':i===1?'1':'3');});
    // measured points and extrapolated continuation
    add(g,svg('circle',{id:'znePt1',cx:245,cy:128,r:9,fill:'#90e6ff'}));
    add(g,svg('circle',{id:'znePt3',cx:470,cy:164,r:9,fill:'#90e6ff'}));
    add(g,svg('path',{id:'zneMeasuredFit',d:'M245 128 C325 137 395 151 470 164',fill:'none',stroke:'#90e6ff','stroke-width':'5','stroke-linecap':'round'}));
    add(g,svg('path',{id:'zneExtrapFit',d:'M245 128 C190 118 135 105 90 99',fill:'none',stroke:'#ffbd6c','stroke-width':'4','stroke-dasharray':'8 9','stroke-linecap':'round'}));
    add(g,svg('circle',{id:'zneZeroPoint',cx:90,cy:99,r:10,fill:'#ffbd6c'}));
    text(g,125,104,'enhancement-micro proof-amber','INFERRED','start');
    text(g,358,115,'enhancement-micro proof-cyan','MEASURED','middle');
  }

  function buildCoverage(){
    const root=$('#resultsScene'); if(!root||$('#coverageSummary'))return;
    const g=add(root,svg('g',{id:'coverageSummary',opacity:'0'}));
    add(g,svg('rect',{x:275,y:250,width:1370,height:490,rx:30,fill:'#091117','fill-opacity':'.97',stroke:'#415866','stroke-width':'2'}));
    text(g,960,292,'enhancement-label','KNOWN-IDEAL COVERAGE ACROSS 6 OBSERVABLES');
    text(g,960,319,'enhancement-micro','QUALITATIVE SUMMARY — NOT A NUMERIC PLOT OF THE ESTIMATES');
    // ideal reference
    add(g,svg('line',{x1:345,y1:438,x2:1575,y2:438,stroke:'#90e6ff','stroke-width':'3','stroke-dasharray':'9 10'}));
    text(g,1565,420,'enhancement-micro proof-cyan','KNOWN IDEAL','end');
    const xs=[430,645,860,1075,1290,1505];
    const contain=[true,true,false,false,false,true];
    xs.forEach((x,i)=>{
      const cg=add(g,svg('g',{class:'coverageItem',opacity:'0'}));
      const ok=contain[i];
      const y1=ok?392:490+(i-2)*11;
      const y2=ok?484:558+(i-2)*8;
      const mid=(y1+y2)/2;
      const col=ok?'#90e6ff':'#ff7d75';
      add(cg,svg('line',{x1:x,y1,x2:x,y2,stroke:col,'stroke-width':'8','stroke-linecap':'round'}));
      add(cg,svg('line',{x1:x-24,y1,x2:x+24,y2:y1,stroke:col,'stroke-width':'4','stroke-linecap':'round'}));
      add(cg,svg('line',{x1:x-24,y1:y2,x2:x+24,y2,stroke:col,'stroke-width':'4','stroke-linecap':'round'}));
      add(cg,svg('circle',{cx:x,cy:mid,r:9,fill:col}));
      text(cg,x,625,'enhancement-micro',`OBS ${i+1}`);
      const chip=add(cg,svg('g',{}));
      add(chip,svg('rect',{x:x-68,y:648,width:136,height:38,rx:10,fill:ok?'#08151a':'#180f12',stroke:ok?'#396f7c':'#8f4648'}));
      text(chip,x,674,'enhancement-micro',ok?'CONTAINS IDEAL':'EXCLUDES IDEAL');
    });
    const note=add(g,svg('g',{id:'coverageNote'}));
    add(note,svg('rect',{x:680,y:350,width:560,height:58,rx:14,fill:'#0a141a',stroke:'#4a6070'}));
    text(note,960,386,'enhancement-micro','3 CONTAIN · 3 EXCLUDE  →  FAILURE ON HALF THE OBSERVABLES');
  }

  function setup(){
    buildZNEScreen(); buildCoverage();
    ['#zneMeasuredFit','#zneExtrapFit'].forEach(sel=>{const p=$(sel);if(p){const len=p.getTotalLength();p.dataset.len=len;p.style.strokeDasharray=len;p.style.strokeDashoffset=len;}});
  }

  function animate(t){
    // ZNE screen is explicitly schematic; no fake hardware values are shown.
    const zg=$('#zneResponseScreen'); show(zg,O(I(t,7.5,8.4))*(1-I(t,15.0,16.0)));
    show($('#znePt1'),O(I(t,8.6,9.3))); show($('#znePt3'),O(I(t,10.2,11.0))); show($('#zneZeroPoint'),O(I(t,12.0,12.8)));
    const m=$('#zneMeasuredFit'); if(m){const len=+m.dataset.len||1;m.style.strokeDashoffset=String(L(len,0,E(I(t,9.0,11.4))));}
    const ex=$('#zneExtrapFit'); if(ex){const len=+ex.dataset.len||1;ex.style.strokeDashoffset=String(L(len,0,E(I(t,11.2,13.6))));}

    // Replace arbitrary bar heights with a truthful coverage-status graphic.
    if(t>=48.2&&t<57.2){
      show($('#coverageSummary'),O(I(t,48.2,49.0))*(1-I(t,56.2,57.2)));
      if($('#resultGauges'))$('#resultGauges').style.opacity=.06;
      $$('.missCallout').forEach(e=>e.style.opacity=0);
      if($('#resultLegend'))$('#resultLegend').style.opacity=0;
      $$('.coverageItem').forEach((e,i)=>{
        const p=O(I(t,49.0+i*.28,49.8+i*.28));show(e,p);e.setAttribute('transform',`translate(0 ${L(24,0,p)})`);
      });
      show($('#coverageNote'),O(I(t,51.0,52.0)));
    }else if($('#resultGauges')){
      $('#resultGauges').style.opacity='';
    }
  }

  const start=()=>{
    setup(); if(typeof render!=='function')return;
    const prev=render; render=function(t){prev(t);animate(t)};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
