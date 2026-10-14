/* Final editorial layer: locked SCRIPT.md + split-screen STORYBOARD.md.
 * Geometry, state and labels are pure functions of the master clock. */
(()=>{
  const $=q=>document.querySelector(q),NS='http://www.w3.org/2000/svg';
  const M=window.CRZNEAnatomyModel;
  const C=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)), I=(t,a,b)=>C((t-a)/(b-a));
  const S=x=>{x=C(x);return x*x*(3-2*x)}, L=(a,b,p)=>a+(b-a)*p;
  const E=(tag,a={},text='')=>{const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))e.setAttribute(k,String(v));e.textContent=text;return e};
  const add=(p,tag,a,text)=>{const e=E(tag,a,text);p.appendChild(e);return e};
  const g=(p,id)=>add(p,'g',{id});
  const text=(p,x,y,s,cls='fd-label',a={})=>add(p,'text',{x,y,class:cls,...a},s);
  const line=(p,d,cls='fd-line',a={})=>add(p,'path',{d,class:cls,...a});
  const op=(el,v)=>{el.style.opacity=String(C(v))};
  const windowAt=(t,a,b,w=.55)=>S(I(t,a-w,a+w))*(1-S(I(t,b-w,b+w)));
  const transform=(el,x,y,k,cx=0,cy=0)=>el.setAttribute('transform',`translate(${x} ${y}) scale(${k}) translate(${-cx} ${-cy})`);
  const beats=[
    ['identity',0,4],['zne',4,16],['controls',16,31.5],['factorial',31.5,37],
    ['interaction',37,41.5],['positive-control',41.5,48],['coverage',48,56],
    ['service-panel',56,60],['proof',60,71.5],['precision',71.5,77.5],
    ['interpretation',77.5,85],['requirements',85,90]
  ];
  const A=lambda=>1-.04*lambda-.008*lambda*lambda;
  const B=lambda=>A(lambda)-(.058/3)*(lambda-1)*(lambda-3);
  const xy=(lambda,f)=>[260+220*lambda,370+(1-f)*1000];
  const curve=(fn,a=0,b=3)=>Array.from({length:121},(_,i)=>{const p=xy(L(a,b,i/120),fn(L(a,b,i/120)));return`${i?'L':'M'}${p[0]} ${p[1]}`}).join(' ');
  const R={},centers={},textGates=[];
  function setup(){
    const stage=$('#stage');
    document.body.classList.add('final-film');
    const params=new URLSearchParams(location.search);
    if(params.get('overlay')==='1')document.body.classList.add('overlay');
    if(params.get('paper')==='1')document.body.classList.add('paper-backed');
    if(params.get('safe')==='1')document.body.classList.add('safe-guide');
    // Superseded views remain in source for provenance, never in final rendering.
    ['intro','question','whyScene','whyEnhancement','captionBox','grid'].forEach(id=>{const e=$('#'+id);if(e)e.style.display='none'});
    const defs=stage.querySelector('defs');
    const grad=add(defs,'linearGradient',{id:'paperFeather',x1:'0',x2:'1'});
    add(grad,'stop',{offset:'0','stop-color':'#f7f5ef'});add(grad,'stop',{offset:'.88','stop-color':'#f7f5ef'});add(grad,'stop',{offset:'1','stop-color':'#f7f5ef','stop-opacity':'0'});
    const clip=add(defs,'clipPath',{id:'leftVisualClip'});add(clip,'rect',{x:60,y:75,width:1100,height:930});
    const root=g(stage,'finalFilm');R.root=root;
    add(root,'rect',{id:'paperBacking',width:1280,height:1080,fill:'url(#paperFeather)'});
    R.title=g(root,'fdHeading');text(R.title,90,120,'CR-ZNE / DYNAMIC QUANTUM CIRCUITS','fd-kicker');R.heading=text(R.title,90,187,'','fd-title');
    const hero=$('#anatomyHero');root.appendChild(hero);$('#ahFrame').style.display='none';
    $('#ahArt').removeAttribute('transform');
    [...$('#ahArt').children].filter(e=>!e.id).forEach(e=>e.style.display='none');
    const locks=$('#ahInterlocks');
    ['[data-name="interlock-frame"]','[data-name="lock-socket-0"]','[data-name="lock-socket-1"]','[data-name="lock-socket-2"]','#ahKey0','#ahKey1','#ahKey2','#ahLatch'].forEach(q=>{const el=locks.querySelector(q);if(el)locks.appendChild(el)});
    hero.setAttribute('clip-path','url(#leftVisualClip)');
    for(const id of ['ahG','ahL','ahM','ahCage','ahDialAssembly','ahPanel','ahInterlocks']){
      const e=$('#'+id);if(!e)continue;const b=e.getBBox();centers[id]=[b.x+b.width/2,b.y+b.height/2];
    }
    R.identity=g(root,'fdIdentity');text(R.identity,100,400,'CR-ZNE','fd-number');text(R.identity,100,457,'Aryan Kumar · Sushanth Dasari','fd-label');text(R.identity,100,495,'Grade 12','fd-small');
    line(R.identity,'M100 605H1030','fd-line');[210,390,570,750,930].forEach((x,i)=>{add(R.identity,'rect',{x:x-25,y:580,width:50,height:50,rx:5,class:'fd-paper'});text(R.identity,x,613,['H','CZ','M','L','X'][i],'fd-small',{'text-anchor':'middle'})});R.introPulse=add(R.identity,'circle',{cy:605,r:7,fill:'#e8752b'});
    // ZNE diagram has a sampled and an inferred segment of one response.
    R.zne=g(root,'fdZNE');text(R.zne,100,260,'SCHEMATIC RESPONSE','fd-kicker');
    line(R.zne,'M260 680V330M260 680H1000');text(R.zne,780,756,'noise scale λ','fd-label');text(R.zne,105,355,'response','fd-small');
    const zfn=x=>1-.05*x;R.zsolid=line(R.zne,curve(zfn,1,3),'fd-track');R.zinfer=line(R.zne,curve(zfn,0,1),'fd-track',{'stroke-dasharray':'8 10'});
    [0,1,3].forEach(x=>{line(R.zne,`M${260+220*x} 680v12`);text(R.zne,260+220*x,726,'λ = '+x,'fd-label',{'text-anchor':'middle'})});
    R.zpoints=[1,3].map(x=>{const p=xy(x,zfn(x));return add(R.zne,'circle',{cx:p[0],cy:p[1],r:10,class:'fd-point'})});
    const z0=xy(0,1);R.zzero=add(R.zne,'circle',{cx:z0[0],cy:z0[1],r:11,fill:'#f7f5ef',stroke:'#e8752b','stroke-width':4});
    R.zCar=g(R.zne,'fdNoiseCarriage');add(R.zCar,'rect',{x:-23,y:-16,width:46,height:32,rx:5,class:'fd-metal'});[-14,14].forEach(x=>add(R.zCar,'circle',{cx:x,cy:19,r:5,class:'fd-point'}));
    text(R.zne,490,830,'MEASURED: λ = 1, 3','fd-small');R.zlabel=text(R.zne,260,292,'INFERRED ZERO','fd-small');
    R.controlLabels=g(root,'fdControlLabels');R.controlName=text(R.controlLabels,100,300,'','fd-number');R.controlDetail=text(R.controlLabels,100,360,'','fd-label');
    R.factorial=g(root,'fdFactorial');R.count=text(R.factorial,100,335,'1 / 8','fd-number');text(R.factorial,100,390,'LOW–HIGH SETTINGS','fd-kicker');text(R.factorial,100,858,'3 dynamic circuits · 6 observables','fd-small');text(R.factorial,100,897,'Pre-specified · known ideal outputs','fd-small');
    [[540,705,'G'],[970,625,'L'],[760,338,'M']].forEach(([x,y,label])=>text(R.factorial,x,y,label,'fd-label'));
    R.primary=g(root,'fdPrimary');text(R.primary,100,292,'LATENCY × MEASUREMENT','fd-kicker');text(R.primary,100,395,'+0.0007','fd-number');text(R.primary,100,443,'bLM · 95% CI [−0.0033, +0.0049]','fd-small');
    // Positive control: common numeric axis, measured values distinguished from injected values.
    R.control=g(root,'fdPositiveControl');text(R.control,100,290,'INJECTED / RECOVERED','fd-kicker');
    R.controlPairs=[];[[-.010,-.0104],[-.020,-.0213]].forEach(([expected,recovered],i)=>{
      const y=410+190*i;line(R.control,`M420 ${y}H990`,'fd-faint');
      const ex=960+expected*22000,rx=960+recovered*22000;
      line(R.control,`M${ex} ${y-18}v36`,'fd-line');const marker=add(R.control,'circle',{cx:rx,cy:y,r:9,fill:'#e8752b'});
      text(R.control,100,y-25,'INJECTED '+expected.toFixed(3),'fd-label');text(R.control,100,y+20,'RECOVERED '+recovered.toFixed(4),'fd-label');
      text(R.control,100,y+58,'Δ '+(recovered-expected).toFixed(4),'fd-small');R.controlPairs.push({marker,ex,rx});
    });text(R.control,100,835,'Positive control recovered injected interactions','fd-small');
    // Qualitative coverage cartridges deliberately have no invented hardware magnitudes.
    R.bank=g(root,'fdCoverage');R.cards=[];['contains','contains','excludes','excludes','excludes','contains'].forEach((status,i)=>{
      const x=100+(i%3)*325,y=385+Math.floor(i/3)*205,q=g(R.bank,'fdObservable'+i);q.dataset.coverage=status;
      add(q,'path',{d:`M${x} ${y}h282l12 12v145h-282l-12-12z`,class:'fd-metal'});add(q,'rect',{x,y,width:282,height:145,rx:8,class:'fd-paper'});
      [[x+12,y+12],[x+270,y+12],[x+12,y+133],[x+270,y+133]].forEach(([cx,cy])=>add(q,'circle',{cx,cy,r:3,fill:'#9b968c'}));
      text(q,x+20,y+35,'O'+(i+1),'fd-small');const ideal=x+135;line(q,`M${ideal} ${y+50}v58`,'fd-line',{'stroke-dasharray':'3 5'});
      const lo=status==='excludes'?x+170:x+93,hi=status==='excludes'?x+241:x+177;
      line(q,`M${lo} ${y+78}H${hi}M${lo} ${y+66}v24M${hi} ${y+66}v24`,status==='excludes'?'fd-track':'fd-line');
      text(q,x+20,y+128,status==='excludes'?'IDEAL EXCLUDED':'IDEAL CONTAINED','fd-small');
      add(q,'circle',{cx:x+248,cy:y+31,r:6,fill:status==='excludes'?'#e8752b':'#9b968c'});R.cards.push(q);
    });text(R.bank,100,313,'3 / 6','fd-number');text(R.bank,425,311,'IDEAL EXCLUDED','fd-label');text(R.bank,100,864,'All five original extrapolation strategies','fd-label');text(R.bank,100,906,'Coverage schematic · no estimate magnitudes','fd-small');
    R.why=g(root,'fdWhy');text(R.why,100,310,'WHY?','fd-number');
    // True polynomial counterexample, not piecewise cams with accidental extra constraints.
    R.proof=g(root,'fdProof');add(R.proof,'rect',{x:180,y:300,width:850,height:395,rx:12,class:'fd-paper'});
    [[196,316],[1014,316],[196,678],[1014,678]].forEach(([cx,cy])=>add(R.proof,'circle',{cx,cy,r:4,fill:'#9b968c'}));
    line(R.proof,'M260 630H960','fd-line');[0,1,3].forEach(x=>{line(R.proof,`M${260+x*220} 630v12`);text(R.proof,260+x*220,678,'λM = '+x,'fd-small',{'text-anchor':'middle'})});
    R.trackB=line(R.proof,curve(B),'fd-track-b');R.trackA=line(R.proof,curve(A),'fd-track');
    R.contacts=[1,3].map((x,i)=>{const p=xy(x,A(x)),q=g(R.proof,'fdContact'+i);line(q,`M${p[0]} ${p[1]+12}V620`,'fd-faint');add(q,'circle',{cx:p[0],cy:p[1],r:11,class:'fd-point'});return q});
    R.scan=g(R.proof,'fdScan');add(R.scan,'rect',{x:-18,y:-25,width:36,height:50,rx:7,class:'fd-metal'});line(R.scan,'M0 25v15','fd-track');
    R.zero=g(R.proof,'fdZeroLimits');line(R.zero,`M235 370v58M224 370h22M224 428h22`,'fd-track');text(R.zero,320,355,'1.000','fd-label');text(R.zero,320,458,'0.942','fd-label');
    R.proofLabel=text(R.proof,100,792,'SAME SAMPLED VALUES','fd-label');R.formula=text(R.proof,100,857,'f꜀(λ) = f(λ) + c(λM − 1)(λM − 3)','fd-label');R.proofNote=text(R.proof,100,900,'Illustrative counterexample · not hardware estimates','fd-small');
    R.precision=g(root,'fdPrecision');R.shots=text(R.precision,100,805,'20,000','fd-number');text(R.precision,100,851,'ILLUSTRATIVE SHOTS · SAME SETTINGS','fd-kicker');text(R.precision,100,902,'MORE PRECISION ≠ IDENTIFIABILITY','fd-label');
    R.jaws=[1,3].map((x,i)=>line(R.proof,'','fd-track',{id:'fdJaw'+i}));
    R.interpret=g(root,'fdInterpretation');text(R.interpret,100,300,'OBSERVED GRID','fd-kicker');text(R.interpret,730,300,'UNSAMPLED ZERO','fd-kicker');line(R.interpret,'M510 525H940','fd-faint',{'stroke-dasharray':'7 9'});add(R.interpret,'circle',{cx:940,cy:525,r:25,fill:'none',stroke:'#77746d','stroke-width':3});text(R.interpret,940,534,'0','fd-label',{'text-anchor':'middle'});text(R.interpret,100,862,'SEPARABILITY ≠ CERTIFICATION','fd-title');
    // Anatomy interlock from the canonical rig, now with legible labels and strict AND release.
    R.keys=g(root,'fdKeyLabels');['INTERACTION','MODEL','ZERO TARGET'].forEach((v,i)=>{text(R.keys,320+i*255,864,v,'fd-label',{'text-anchor':'middle'});text(R.keys,320+i*255,902,['diagnostics','validity','calibration'][i],'fd-small',{'text-anchor':'middle'})});
    R.lockState=text(R.keys,100,976,'LATCH LOCKED','fd-label');
        // Geometry may morph/dissolve; competing labels never occupy the same beat.
    const annotationBeats={identity:[-1,4],zne:[4,16],controlLabels:[16,31.5],factorial:[31.5,37],primary:[37,41.5],control:[41.5,48],bank:[48,56],why:[56,60],proof:[60,77.5],precision:[71.5,77.5],interpret:[77.5,85],keys:[85,91]};
    for(const [name,[a,b]] of Object.entries(annotationBeats))for(const el of [...R[name].querySelectorAll('text')]){
      const wrap=E('g');el.parentNode.insertBefore(wrap,el);wrap.appendChild(el);textGates.push({wrap,a,b});
    }
    const safe=g(stage,'safeZoneGuide');add(safe,'rect',{x:1220,width:700,height:1080,fill:'#9b968c','fill-opacity':'.12'});line(safe,'M1220 0V1080','fd-faint',{'stroke-dasharray':'9 9'});text(safe,1300,100,'SPEAKER SAFE ZONE','fd-kicker');
    window.CRZNEFinal={beats,A,B,xy,windowAt,stateAt,centers};
  }
  function stateAt(t){
    const canonical=M.stateAt(t),shotP=canonical.shotP;
    const key=[canonical.key1,canonical.key2,canonical.key3];
    const release=canonical.latch;
    return {t,shotP,shots:Math.round(20000*Math.pow(50,shotP)),gap:A(0)-B(0),key,release,beat:beats.find(([,a,b])=>t>=a&&t<b)?.[0]||'requirements'};
  }
  function assembly(id,x,y,k,opacity){const el=$('#'+id);if(!el)return;const [cx,cy]=centers[id];transform(el,x,y,k,cx,cy);op(el,opacity);}
  function update(t){
    const s=stateAt(t);R.root.dataset.beat=s.beat;R.root.dataset.time=String(t);
    $('#anatomyHero').style.opacity='1';$('#ahArt').style.opacity='1';$('#ahArt').removeAttribute('transform');
    // Reset every final-owned property on every seek, including reverse and shuffled seeks.
    for(const id of ['ahStatic','ahZNE','ahCables','ahFailureBank','ahProof']){op($('#'+id),0)}
    for(const id of Object.keys(centers))op($('#'+id),0);
    for(const key of ['identity','zne','controlLabels','factorial','primary','control','bank','why','proof','precision','interpret','keys'])op(R[key],0);
    const headings=['','Zero-noise extrapolation','Three independent controls','2³ full factorial','Primary interaction','Sensitivity check','Known-answer check','From data to proof','Two admissible continuations','Precision ≠ identifiability','Observed ≠ certified','Three separate requirements'];
    R.heading.textContent=headings[beats.findIndex(([id])=>id===s.beat)];
    const boundaryDistance=Math.min(...beats.slice(1).map(([,a])=>Math.abs(t-a)));op(R.heading,S(C(boundaryDistance/.3)));
    op(R.identity,1-S(I(t,3.5,4.4)));R.introPulse.setAttribute('cx',L(100,1030,S(I(t,0,3.5))));
    const z=windowAt(t,4,16);op(R.zne,z);
    const zpos=t<11.5?L(1,3,S(I(t,5,11.5))):L(3,0,S(I(t,11.5,15)));
    transform(R.zCar,260+220*zpos,680,1);op(R.zpoints[0],S(I(t,5,6)));op(R.zpoints[1],S(I(t,10.7,11.5)));
    op(R.zsolid,S(I(t,6,11.5)));op(R.zinfer,S(I(t,11.5,14.5)));op(R.zzero,S(I(t,14,15.2)));op(R.zlabel,S(I(t,13,15)));
    const ctr=windowAt(t,16,31.5);op(R.controlLabels,ctr);
    const labels=[['G','Gate operations','Gate cassette · 1× → 3×'],['L','Feedforward latency','Timing carriage · stretched window'],['M','Mid-circuit measurement','Indexed measurement exposure']];
    const ci=t<24?0:t<28?1:2;R.controlName.textContent=labels[ci][0]+' / '+labels[ci][1];R.controlName.style.fontSize='49px';R.controlDetail.textContent=labels[ci][2];
    const labelFade=ci===0?1-S(I(t,23.7,24)):ci===1?S(I(t,24,24.3))*(1-S(I(t,27.7,28))):S(I(t,28,28.3));
    op(R.controlName,labelFade);op(R.controlDetail,labelFade);
    const focus=[windowAt(t,20,24,.65),windowAt(t,24,28,.65),windowAt(t,28,31.5,.65)];
    ['ahG','ahL','ahM'].forEach((id,i)=>{const p=focus[i],wide=1-S(I(t,19.5,20.8));const alpha=ctr*(wide+(1-wide)*p);assembly(id,L(280+i*330,590,p),590,L(.9,2,p),alpha)});
    const f=windowAt(t,31.5,37);op(R.factorial,f);R.count.textContent=M.stateAt(t).factorial.index+' / 8';
    // Cube folds into dial as the result settles; avoid a stale dial behind control pairs.
    const dial=windowAt(t,37,41.5);op(R.primary,dial);assembly('ahDialAssembly',760,640,1.45,dial);
    op(R.control,windowAt(t,41.5,48));R.controlPairs.forEach(({marker,ex,rx},i)=>{marker.setAttribute('cx',L(ex+95,rx,S(I(t,41.5+i*.75,43+i*.75))));});
    // Hold all control geometry exactly still at the 45-second narrator handoff.
    const bank=windowAt(t,48,56,.65);op(R.bank,bank);R.cards.forEach((q,i)=>{const into=S(I(t,48+i*.14,49.2+i*.14)),out=S(I(t,55.5,57));q.setAttribute('transform',`translate(${out*230} ${L(45,0,into)-out*105}) scale(${1-out*.28})`)});
    const why=windowAt(t,56,60,.6);op(R.why,why);assembly('ahPanel',630,L(560,735,S(I(t,59.7,60.5))),1.15,why);
    const proof=windowAt(t,60,77.5,.7);op(R.proof,proof);
    const reveal=S(I(t,60.4,62.3));op(R.trackA,reveal);op(R.trackB,reveal);R.contacts.forEach(q=>op(q,reveal));
    const lambda=t<65.3?3:t<66.6?L(3,1,S(I(t,65.3,66.6))):t<67.7?1:L(1,0,S(I(t,67.7,70.5)));
    const point=xy(lambda,(A(lambda)+B(lambda))/2);transform(R.scan,point[0],point[1]-43,1);op(R.scan,S(I(t,63,64))*(1-S(I(t,71,71.8))));
    op(R.zero,S(I(t,68.3,70.5)));R.proofLabel.textContent=t<68?'SAME SAMPLED VALUES':'DIFFERENT ZERO LIMITS';
    op(R.proofLabel,1-S(I(t,71,71.8)));op(R.formula,1-S(I(t,71,71.8)));op(R.proofNote,1-S(I(t,71,71.8)));
    const precision=windowAt(t,71.5,77.5,.6);op(R.precision,precision);R.shots.textContent=s.shots.toLocaleString('en-US');
    R.jaws.forEach((q,i)=>{const p=xy([1,3][i],A([1,3][i])),h=38*Math.pow(50,-s.shotP/2);q.setAttribute('d',`M${p[0]-18} ${p[1]-h}h36M${p[0]-18} ${p[1]+h}h36M${p[0]} ${p[1]-h}v${2*h}`);op(q,precision)});
    // Interpretation uses the same observed-grid cage and same physical interlock.
    const interp=windowAt(t,77.5,85,.7);op(R.interpret,interp);assembly('ahCage',L(740,330,S(I(t,70,77))),L(572,510,S(I(t,70,77))),L(1.6,1,S(I(t,70,77))),f+interp);
    const locks=S(I(t,78.5,80));const settle=S(I(t,84.5,85.5));assembly('ahInterlocks',L(805,605,settle),L(570,540,settle),L(1.55,1.9,settle),locks);
    s.key.forEach((p,i)=>{
      // Canonical key travels down its socket; highlighting follows engagement.
      const el=$('#ahKey'+i);el.setAttribute('transform',`translate(0 ${42*1.72*Math.cos(Math.PI/6)*p})`);el.classList.toggle('ah-subject-lit',p>.99);
    });
    const latch=$('#ahLatch');latch.setAttribute('transform',`translate(${38*1.72*Math.cos(Math.PI/4)*s.release} ${38*1.72*Math.sin(Math.PI/4)*.5*s.release})`);
    $('#ahInterlocks').classList.toggle('ah-latch-on',s.release>.99);
    op(R.keys,S(I(t,84.7,85.4)));R.lockState.textContent=s.release===1?'RELIABLE ZNE':'LATCH LOCKED';R.lockState.classList.toggle('fd-accent',s.release===1);
    // Every final visual is either inside this audited region or intentionally transparent.
    for(const {wrap,a,b} of textGates)op(wrap,S(I(t,a,a+.35))*(1-S(I(t,b-.35,b))));
    R.root.dataset.release=String(s.release);R.root.dataset.shots=String(s.shots);
    $('#scrub').setAttribute('aria-valuetext',`${t.toFixed(2)} seconds, ${s.beat}`);
  }
  function start(){if(!M||!$('#anatomyHero'))throw Error('Final director requires canonical Anatomy model and rig');setup();const prev=render;render=function(t){t=C(t,0,90);prev(t);update(t)};render(Number(new URLSearchParams(location.search).get('t')||0));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
