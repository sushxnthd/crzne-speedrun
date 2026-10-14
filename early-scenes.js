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
  const rect=(p,x,y,w,h,cls='proof-plate',rx=12)=>add(p,svg('rect',{x,y,width:w,height:h,rx,class:cls}));

  const chosenLines=[
    [0,4,'ARYAN','I’m Aryan Kumar, and this is Sushanth Dasari. We’re student researchers from Gurugram, Haryana.'],
    [4,13,'ARYAN','Here’s a strange way quantum computers fight noise: make the machine deliberately noisier, watch how its answer changes, then extrapolate backward to what a perfect circuit should have produced.'],
    [13,15,'ARYAN','That’s zero-noise extrapolation.'],
    [15,20,'ARYAN','But dynamic quantum circuits combine several error sources at once.'],
    [20,32,'ARYAN','So on IBM quantum processors, we independently amplified three of them: gate operations, feedforward latency, and mid-circuit measurements.'],
    [32,38,'ARYAN','We tested every low–high combination in a pre-specified two-to-the-three factorial experiment on circuits whose correct answers we already knew.'],
    [38,45,'ARYAN','And initially, it worked exactly as we hoped. Our primary latency–measurement interaction was only 0.0007, while a positive control successfully recovered interactions we deliberately injected.'],
    [45,47,'SUSHANTH','That should have been reassuring.'],
    [47,48.5,'SUSHANTH','It wasn’t.'],
    [48.5,56,'SUSHANTH','When we actually extrapolated to zero noise, all five original strategies excluded the correct answer for three of six observables.'],
    [56,60,'SUSHANTH','So we asked: how can the noise look separable, yet the correction still be wrong?'],
    [60,62,'SUSHANTH','We proved the reason mathematically.'],
    [62,71,'SUSHANTH','With only two sampled measurement-noise levels, different response curves can pass through every measurement we made and still predict different values at zero noise.'],
    [71,76,'SUSHANTH','And collecting more shots at those same points cannot tell those curves apart.'],
    [76,80,'SUSHANTH','That changes what a small interaction actually means.'],
    [80,86,'SUSHANTH','Separability is evidence about the measurements we observed. It is not a certificate that the unmeasured zero-noise answer is correct.'],
    [86,90.1,'SUSHANTH','Reliable ZNE therefore needs three things kept separate: interaction diagnostics, a justified response model, and a calibrated zero-noise target.']
  ];

  function buildZNE(){
    const root=$('#zne'); if(!root||$('#zneRigLayer'))return;
    const g=add(root,svg('g',{id:'zneRigLayer'}));
    // physical regions below the rail
    add(g,svg('rect',{id:'extrapRegion',x:455,y:640,width:350,height:70,rx:16,fill:'#ffbd6c','fill-opacity':'.035',stroke:'#ffbd6c','stroke-opacity':'.35','stroke-dasharray':'7 9'}));
    add(g,svg('rect',{id:'measureRegion',x:805,y:640,width:640,height:70,rx:16,fill:'#90e6ff','fill-opacity':'.035',stroke:'#90e6ff','stroke-opacity':'.3'}));
    text(g,630,670,'enhancement-label proof-amber','UNMEASURED');
    text(g,630,695,'enhancement-micro','EXTRAPOLATION TO λ = 0');
    text(g,1125,670,'enhancement-label proof-cyan','MEASURED RESPONSE');
    text(g,1125,695,'enhancement-micro','INTENTIONALLY AMPLIFIED NOISE');
    // directional drives
    add(g,svg('path',{id:'noiseDrive',d:'M820 748 H1410',fill:'none',stroke:'#90e6ff','stroke-width':'4','stroke-linecap':'round','marker-end':'url(#arrow)'}));
    text(g,1115,785,'enhancement-label','DELIBERATELY INCREASE NOISE');
    add(g,svg('path',{id:'inferDrive',d:'M785 830 H485',fill:'none',stroke:'#ffbd6c','stroke-width':'4','stroke-linecap':'round'}));
    add(g,svg('path',{d:'M485 830 L505 818 M485 830 L505 842',fill:'none',stroke:'#ffbd6c','stroke-width':'4','stroke-linecap':'round'}));
    text(g,635,870,'enhancement-label proof-amber','INFER BACK TOWARD ZERO');
    // zero target gate
    const z=add(g,svg('g',{id:'zeroGate'}));
    add(z,svg('rect',{x:430,y:420,width:80,height:170,rx:18,fill:'#091117',stroke:'#ffbd6c','stroke-opacity':'.55','stroke-width':'2'}));
    add(z,svg('line',{x1:470,y1:435,x2:470,y2:575,stroke:'#ffbd6c','stroke-width':'3','stroke-dasharray':'6 8'}));
    text(z,470,405,'enhancement-micro proof-amber','TARGET');
  }

  function buildModules(){
    const root=$('#modules'); if(!root||$('#moduleHarness'))return;
    const g=add(root,svg('g',{id:'moduleHarness'}));
    // instrument bus connects all three controls physically
    add(g,svg('path',{id:'busG',d:'M475 475 C475 520 665 520 760 560',fill:'none',stroke:'#536b7a','stroke-width':'5','stroke-linecap':'round'}));
    add(g,svg('path',{id:'busL',d:'M960 475 V560',fill:'none',stroke:'#536b7a','stroke-width':'5','stroke-linecap':'round'}));
    add(g,svg('path',{id:'busM',d:'M1445 475 C1445 520 1255 520 1160 560',fill:'none',stroke:'#536b7a','stroke-width':'5','stroke-linecap':'round'}));
    add(g,svg('rect',{x:760,y:540,width:400,height:72,rx:22,fill:'#0a1218',stroke:'#506574','stroke-width':'2'}));
    text(g,960,570,'enhancement-label','INDEPENDENT PHYSICAL NOISE CONTROLS');
    text(g,960,595,'enhancement-micro','G · L · M → COMMON FACTORIAL RESPONSE');
    // three tiny selector dials embedded at the cable exits
    [475,960,1445].forEach((x,i)=>{
      const d=add(g,svg('g',{class:'noiseDial',transform:`translate(${x} 495)`}));
      add(d,svg('circle',{r:27,fill:'#0b1319',stroke:'#708593','stroke-width':'2'}));
      add(d,svg('path',{class:'dialNeedle',d:'M0 4 L0 -19',stroke:'#90e6ff','stroke-width':'4','stroke-linecap':'round'}));
      text(d,-18,45,'enhancement-micro','1','middle'); text(d,18,45,'enhancement-micro','3','middle');
    });
  }

  function buildCube(){
    const root=$('#cubeScene'); const cube=$('#cube'); if(!root||!cube||$('#cubeEnhancement'))return;
    const g=add(cube,svg('g',{id:'cubeEnhancement'}));
    const pts=[[-240,120],[100,120],[250,10],[-90,10],[-240,-160],[100,-160],[250,-270],[-90,-270]];
    const d=pts.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' ');
    const path=add(g,svg('path',{id:'acquisitionTrace',d,fill:'none',stroke:'#ffbd6c','stroke-width':'5','stroke-linecap':'round','stroke-linejoin':'round','stroke-opacity':'.82'}));
    path.dataset.len='0';
    // level labels on the three experimental axes
    text(g,-280,112,'enhancement-micro','1'); text(g,130,112,'enhancement-micro','3');
    text(g,150,80,'enhancement-micro','1'); text(g,280,-5,'enhancement-micro','3');
    text(g,-272,95,'enhancement-micro','1'); text(g,-272,-245,'enhancement-micro','3');
    const badge=add(root,svg('g',{id:'prespecifiedBadge'}));
    rect(badge,285,115,300,72,'proof-plate',16);
    text(badge,435,143,'enhancement-label proof-cyan','PRE-SPECIFIED DESIGN');
    text(badge,435,169,'enhancement-micro','ALL 8 CORNERS ACQUIRED');
  }

  function buildInteraction(){
    const root=$('#interactionScene'); if(!root||$('#interactionEnhancement'))return;
    const g=add(root,svg('g',{id:'interactionEnhancement'}));
    // equivalence strip turns an abstract dial into a quantitative acceptance test
    const eq=add(g,svg('g',{id:'equivalenceStrip'}));
    rect(eq,500,825,920,92,'proof-plate',18);
    text(eq,960,850,'enhancement-label','PLANNED EQUIVALENCE WINDOW');
    add(eq,svg('line',{x1:620,y1:884,x2:1300,y2:884,stroke:'#506574','stroke-width':'8','stroke-linecap':'round'}));
    add(eq,svg('line',{x1:720,y1:884,x2:1200,y2:884,stroke:'#90e6ff','stroke-width':'12','stroke-linecap':'round','stroke-opacity':'.22'}));
    [720,960,1200].forEach(x=>add(eq,svg('line',{x1:x,y1:870,x2:x,y2:898,stroke:'#dce9ef','stroke-width':'2'})));
    text(eq,720,912,'enhancement-micro','−0.005'); text(eq,960,912,'enhancement-micro','0'); text(eq,1200,912,'enhancement-micro','+0.005');
    add(eq,svg('path',{id:'observedMarker',d:'M0 0 L-9 -16 H9 Z',fill:'#ffbd6c',transform:'translate(994 866)'}));
    text(eq,994,945,'enhancement-micro proof-amber','+0.0007');
    // positive-control mini table, only shown when the injection lever operates
    const pc=add(g,svg('g',{id:'positiveControlPlate',opacity:'0'}));
    rect(pc,1370,285,400,220,'proof-plate',22);
    text(pc,1570,320,'enhancement-label proof-amber','POSITIVE CONTROL');
    text(pc,1570,348,'enhancement-micro','KNOWN INTERACTIONS INJECTED');
    lineRow(pc,1410,390,'EXPECTED −0.010','RECOVERED −0.0104');
    lineRow(pc,1410,447,'EXPECTED −0.020','RECOVERED −0.0213');
  }
  function lineRow(p,x,y,a,b){
    add(p,svg('circle',{cx:x,cy:y-6,r:6,fill:'#ffbd6c'}));
    text(p,x+22,y,'enhancement-micro',a,'start');
    add(p,svg('path',{d:`M${x+160} ${y-7} H${x+205}`,stroke:'#6c808d','stroke-width':'2'}));
    text(p,x+220,y,'enhancement-micro proof-cyan',b,'start');
  }

  function buildFinal(){
    const root=$('#finalScene'); if(!root||$('#finalEnhancement'))return;
    const g=add(root,svg('g',{id:'finalEnhancement'}));
    const xs=[600,960,1320];
    ['WHAT THE GRID SHOWS','HOW RESPONSE CONTINUES','WHERE “ZERO” REALLY IS'].forEach((s,i)=>{
      text(g,xs[i],720,'enhancement-micro',s);
      add(g,svg('line',{x1:xs[i],y1:730,x2:xs[i],y2:758,stroke:'#506574','stroke-width':'2'}));
    });
  }

  function setup(){
    buildZNE(); buildModules(); buildCube(); buildInteraction(); buildFinal();
    const tr=$('#acquisitionTrace'); if(tr){const len=tr.getTotalLength();tr.dataset.len=len;tr.style.strokeDasharray=len;tr.style.strokeDashoffset=len;}
  }

  function captions(t){
    const l=chosenLines.find(([a,b])=>t>=a&&t<b)||chosenLines[chosenLines.length-1];
    if($('#speaker')){$('#speaker').textContent=l[2];$('#speaker').setAttribute('class',`micro cap ${l[2]==='ARYAN'?'accent':'warn'}`)}
    if($('#caption'))$('#caption').textContent=l[3];
  }

  function animate(t){
    captions(t);
    // ZNE: clearly separate observed data from extrapolated territory.
    const zp=O(I(t,6.5,8)); show($('#zneRigLayer'),zp*(1-I(t,15.0,16.0)));
    show($('#measureRegion'),O(I(t,7.6,9.0))); show($('#extrapRegion'),O(I(t,10.4,12.0)));
    show($('#noiseDrive'),O(I(t,7.8,10.0))); show($('#inferDrive'),O(I(t,10.5,12.7))); show($('#zeroGate'),O(I(t,11.2,12.3)));

    // G/L/M harness: each active dial rotates from 1 to 3 as its physical knob is discussed.
    const mp=O(I(t,16.5,18.0))*(1-I(t,32.0,33.0)); show($('#moduleHarness'),mp);
    const dialTimes=[[20,24],[24,28],[28,32]];
    $$('.noiseDial').forEach((d,i)=>{
      const p=E(I(t,dialTimes[i][0],dialTimes[i][1]));
      const n=d.querySelector('.dialNeedle'); if(n)n.setAttribute('transform',`rotate(${L(-42,42,p)} 0 0)`);
      d.style.opacity=(t>=dialTimes[i][0]-1&&t<=dialTimes[i][1]+.6)?1:.38;
    });
    ['#busG','#busL','#busM'].forEach((q,i)=>{
      const p=O(I(t,19+i*3.2,21+i*3.2)); const el=$(q); if(el){el.style.stroke=i===Math.min(2,Math.max(0,Math.floor((t-20)/4)))?'#90e6ff':'#536b7a';el.style.opacity=.45+.55*p;}
    });

    // Factorial cube: trace the actual acquisition walk through all eight conditions.
    const tr=$('#acquisitionTrace');
    if(tr){const len=+tr.dataset.len||1;const p=E(I(t,32.0,37.2));tr.style.strokeDashoffset=String(L(len,0,p));}
    show($('#prespecifiedBadge'),O(I(t,31.6,32.5))*(1-I(t,38.0,38.7)));

    // Interaction result / positive control quantitative overlays.
    show($('#interactionEnhancement'),O(I(t,37.2,38.0))*(1-I(t,46.2,47.2)));
    show($('#equivalenceStrip'),O(I(t,38.0,39.0))*(1-I(t,45.2,46.2)));
    show($('#positiveControlPlate'),O(I(t,42.0,42.7))*(1-I(t,45.0,45.7)));

    // End: give each interlock a conceptual meaning without turning it into a slide.
    show($('#finalEnhancement'),O(I(t,82.5,83.5)));
  }

  const start=()=>{
    setup();
    if(typeof render!=='function')return;
    const prev=render;
    render=function(t){prev(t);animate(t)};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
