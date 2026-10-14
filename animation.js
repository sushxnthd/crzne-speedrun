const $ = (q)=>document.querySelector(q);
const $$ = (q)=>[...document.querySelectorAll(q)];
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const inv=(t,a,b)=>clamp((t-a)/(b-a));
const easeOut=t=>1-Math.pow(1-clamp(t),5);
const easeIn=t=>Math.pow(clamp(t),3);
const easeInOut=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const smooth=(t)=>{t=clamp(t);return t*t*(3-2*t)};
const pulse=(t,c,w=.18)=>Math.exp(-Math.pow((t-c)/w,2));
const show=(el,o)=>{el.style.opacity=clamp(o)};
const trans=(el,x=0,y=0,s=1,r=0)=>{el.setAttribute('transform',`translate(${x} ${y}) scale(${s}) rotate(${r})`)};
const rot=(el,deg,cx=0,cy=0)=>el.setAttribute('transform',`rotate(${deg} ${cx} ${cy})`);
const set=(id,attrs)=>{const el=typeof id==='string'?$(id):id;Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));};
const fmtTime=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}.${Math.floor((t%1)*10)}`;

const lines=[
  [
    0,
    4,
    "ARYAN",
    "I’m Aryan Kumar, and with me is Sushanth Dasari of grade 12th."
  ],
  [
    4,
    14.5,
    "ARYAN",
    "Here’s a strange way quantum computers fight noise: make the machine deliberately noisier, watch how its answer changes, then extrapolate backward to what a perfect circuit should have produced."
  ],
  [
    14.5,
    16,
    "ARYAN",
    "That’s zero-noise extrapolation."
  ],
  [
    16,
    31.5,
    "ARYAN",
    "But dynamic quantum circuits combine several error sources at once. So on IBM quantum processors, we built independent controls for three of them: gate operations, feedforward latency, and mid-circuit measurements."
  ],
  [
    31.5,
    37,
    "ARYAN",
    "We tested every low–high combination in a pre-specified 2^3 factorial experiment on circuits whose correct answers we already knew."
  ],
  [
    37,
    45,
    "ARYAN",
    "And initially, it worked exactly as we hoped. Our primary latency–measurement interaction was only 0.0007, while a positive control successfully recovered interactions we deliberately injected."
  ],
  [
    45,
    46.8,
    "SUSHANTH",
    "That should have been reassuring."
  ],
  [
    46.8,
    48,
    "SUSHANTH",
    "It wasn’t."
  ],
  [
    48,
    56,
    "SUSHANTH",
    "When we actually extrapolated to zero noise, all five original strategies excluded the correct answer for three of six observables."
  ],
  [
    56,
    60,
    "SUSHANTH",
    "So we asked: how can the noise look separable, yet the correction still be wrong?"
  ],
  [
    60,
    62,
    "SUSHANTH",
    "We proved the reason mathematically."
  ],
  [
    62,
    71.5,
    "SUSHANTH",
    "With only two sampled measurement-noise levels, different response curves can pass through every measurement we made and still predict different values at zero noise."
  ],
  [
    71.5,
    77.5,
    "SUSHANTH",
    "And collecting more shots at those same points cannot tell those curves apart."
  ],
  [
    77.5,
    85,
    "SUSHANTH",
    "Separability is evidence about the measurements we observed. It is not a certificate that the unmeasured zero-noise answer is correct."
  ],
  [
    85,
    90,
    "SUSHANTH",
    "Reliable ZNE therefore needs three things kept separate: interaction diagnostics, a justified response model, and a calibrated zero-noise target."
  ]
];

const groups=['#intro','#machine','#question','#zne','#modules','#cubeScene','#interactionScene','#resultsScene','#whyScene','#cutawayScene','#shotsScene','#finalScene'];
const cubeCoords=[[-240,120],[100,120],[250,10],[-90,10],[-240,-160],[100,-160],[250,-270],[-90,-270]];

function render(t){
  const masterT=clamp(t,0,90);
  // Preserve the original visual choreography while making the narrator handoff exactly 45 s.
  // Original visual 0–50 s is compressed into master 0–45 s; original 50–90 s is stretched into 45–90 s.
  t = masterT <= 45 ? masterT / 0.9 : 50 + (masterT - 45) / 1.125;
  for(const q of groups)show($(q),0);
  $('#captionBox').style.opacity=masterT<89.4?1:0;
  const line=lines.find(([a,b])=>masterT>=a&&masterT<b) || lines[lines.length-1];
  $('#speaker').textContent=line[2]; $('#caption').textContent=line[3];
  $('#speaker').setAttribute('class',`micro cap ${line[2]==='ARYAN'?'accent':'warn'}`);

  // Intro 0-8
  if(t<8.5){
    show($('#intro'),1-inv(t,5.8,8.5));
    const introScale=1+0.035*easeInOut(inv(t,0,6));
    $('#introCards').setAttribute('transform',`translate(${960*(1-introScale)} ${540*(1-introScale)}) scale(${introScale})`);
  }

  // machine persists through setup
  if(t>=3.1 && t<62.5){
    show($('#machine'),easeOut(inv(t,3.1,5.8))* (1-inv(t,61.4,62.5)));
    const y=lerp(95,0,easeOut(inv(t,3.1,6.2)));
    $('#machine').setAttribute('transform',`translate(0 ${y})`);
    $('#statusLamp').setAttribute('opacity', t>4? .95:.25);
    $('#statusText').textContent=t<8?'QUESTIONING ASSUMPTION':t<17?'ZERO-NOISE EXTRAPOLATION':t<35?'COMPONENT CONTROLS':t<41?'FACTORIAL ACQUISITION':t<50?'SEPARABILITY TEST':'APPARENTLY SEPARABLE';
  }

  // Question 4-8.7
  if(t>=4 && t<9){show($('#question'),smooth(inv(t,4.2,5.1))*(1-inv(t,8.1,9)));}

  // ZNE 8-17.5
  if(t>=8 && t<18){
    show($('#zne'),smooth(inv(t,8,8.8))*(1-inv(t,17.1,18)));
    const p= easeInOut(inv(t,9.1,13.0)); const x=lerp(790,1430,p);
    $('#mainCarriage').setAttribute('transform',`translate(${x-790} 0)`);
    const angle=lerp(-18,34,p); rot($('#obsNeedle'),angle,0,0);
    show($('#sample1'),t>9.2?1:0); show($('#sample3'),smooth(inv(t,12.0,13.2)));
    const q=easeOut(inv(t,13.1,16.5));
    $('#extrapLine').style.strokeDashoffset=`${60*(1-q)}`;
    $('#extrapLine').style.opacity=q;
  } else { $('#mainCarriage').setAttribute('transform','translate(0 0)'); }

  // modules 17-35.5
  if(t>=17 && t<35.7){
    show($('#modules'),smooth(inv(t,17,18))*(1-inv(t,34.9,35.7)));
    const focus = t<26.7?0:t<31?1:2;
    ['#modG','#modL','#modM'].forEach((q,i)=>{const el=$(q);el.style.opacity=(i===focus?1:.32);el.style.filter=i===focus?'url(#softGlow)':'none';});
    const pg=easeOut(inv(t,21.5,26.5));
    $('#gate2').style.opacity=pg; $('#gate3').style.opacity=pg;
    $('#gate2').setAttribute('transform',`translate(${-60*pg} ${-28*pg})`); $('#gate3').setAttribute('transform',`translate(${60*pg} ${28*pg})`);
    const pl=easeInOut(inv(t,27,30.7)); $('#latencyWindow').setAttribute('width',72+148*pl);
    const pm=easeOut(inv(t,31.2,34.7)); $('#mh2').style.opacity=pm;$('#mh3').style.opacity=pm;
  }

  // cube 35-41.3
  if(t>=35 && t<41.4){
    show($('#cubeScene'),smooth(inv(t,35,35.7))*(1-inv(t,40.9,41.4)));
    const p=inv(t,35.8,40.5); const idx=Math.min(7,Math.floor(p*8)); const frac=(p*8)-idx;
    const a=cubeCoords[idx], b=cubeCoords[Math.min(7,idx+1)];
    const sx=lerp(a[0],b[0],easeInOut(frac)), sy=lerp(a[1],b[1],easeInOut(frac)); trans($('#selector'),sx,sy);
    $$('#cubeNodes circle').forEach((el,i)=>{const on=i<=idx;el.setAttribute('fill',on?'#90e6ff':'#14222d');el.style.filter=on?'url(#softGlow)':'none';});
    $('#cubeCounter').textContent=`${Math.min(8,idx+1)} / 8`;
  }

  // interaction gauge 41-53
  if(t>=41 && t<53){
    show($('#interactionScene'),smooth(inv(t,41,41.7))*(1-inv(t,52.2,53)));
    let a;
    if(t<46){const p=easeOut(inv(t,41.3,45.0));a=lerp(35,1.5,p)+6*Math.sin(inv(t,41.3,45.0)*Math.PI*5)*(1-p);}
    else if(t<48){a=lerp(1.5,-28,easeInOut(inv(t,46.2,47.5)));}
    else if(t<50){a=lerp(-28,-54,easeInOut(inv(t,48.1,49.5)));}
    else a=lerp(-54,1.5,easeOut(inv(t,50,51.2)));
    rot($('#intNeedle'),a,0,20);
    const c=inv(t,44.2,45.7); $('#ciBand').setAttribute('x',-lerp(155,60,easeOut(c))); $('#ciBand').setAttribute('width',2*lerp(155,60,easeOut(c)));
    const ctrl=t>=46; show($('#controlLever'),ctrl?smooth(inv(t,46,46.5)):0); show($('#controlCaption'),ctrl?smooth(inv(t,46.5,47)):0);
    if(ctrl) rot($('#controlLever').querySelector('path'),lerp(0,28,easeInOut(inv(t,46.3,47.1))),0,0);
  }

  // results 50-65
  if(t>=50 && t<65){
    show($('#resultsScene'),smooth(inv(t,50.1,51))*(1-inv(t,64.3,65)));
    const values=[1.00,.995,.93,.88,.76,1.003];
    $$('.resultGauge').forEach((g,i)=>{const p=easeOut(inv(t,53+i*.35,57+i*.35));const h=lerp(40,425*values[i],p);const f=g.querySelector('.fill');f.setAttribute('y',-h);f.setAttribute('height',h);});
    show($('#threeSix'),smooth(inv(t,58.4,59.2))*(1-inv(t,63.2,64.2)));
  }

  // why 62-65
  if(t>=62 && t<65.2){show($('#whyScene'),smooth(inv(t,62,62.6))*(1-inv(t,64.2,65.2)));}

  // cutaway 64-84
  if(t>=64 && t<84.2){
    show($('#cutawayScene'),smooth(inv(t,64.2,65.1))*(1-inv(t,83.5,84.2)));
    const open=easeInOut(inv(t,64.8,67.2)); $('#panel').setAttribute('transform',`translate(${lerp(0,0,open)} ${lerp(0,520,open)}) rotate(${lerp(0,2.2,open)} 750 305)`); $('#panel').style.opacity=1-.78*open;
    const travel=easeInOut(inv(t,69,75.2));
    $('#cutawayBench').setAttribute('transform',`translate(${lerp(210,470,travel)} 260) scale(${lerp(1,1.16,travel)})`);
    show($('#zeroReadouts'),smooth(inv(t,72.8,75.2))); show($('#differentLabel'),smooth(inv(t,72.3,74.2))); show($('#sampleLabel'),1-inv(t,71.4,73));
  }

  // shots 77-83.5 overlays cutaway
  if(t>=77 && t<83.8){
    show($('#shotsScene'),smooth(inv(t,77,77.5))*(1-inv(t,83.1,83.8)));
    const p=easeInOut(inv(t,77.5,81.4)); const n=Math.round(20000*Math.pow(50,p)); $('#shotCount').textContent=n.toLocaleString('en-US');
    const spread=lerp(120,16,p); ['#unc1','#unc2'].forEach((q)=>{const x=q==='#unc1'?805:1345;const y=q==='#unc1'?605:595;$(q).setAttribute('d',`M${x} ${y-spread/2}v${spread} M${x-45} ${y-spread/2}h90 M${x-45} ${y+spread/2}h90`)});
    show($('#precisionLabel'),smooth(inv(t,80.2,81.2)));
  }

  // final 83-90
  if(t>=83){
    show($('#finalScene'),smooth(inv(t,83,83.8)));
    const p1=easeOut(inv(t,83.5,84.5)), p2=easeOut(inv(t,85.4,86.6)), p3=easeOut(inv(t,86.5,87.7));
    $('#lock1 .key').setAttribute('transform',`translate(0 ${lerp(0,195,p1)})`); $('#lock2 .key').setAttribute('transform',`translate(0 ${lerp(0,195,p2)})`); $('#lock3 .key').setAttribute('transform',`translate(0 ${lerp(0,195,p3)})`);
    show($('#reliable'),smooth(inv(t,87.5,88.4))); show($('#paperTitle'),smooth(inv(t,88.1,89)));
  }

  $('#timeRead').textContent=fmtTime(masterT); $('#frameRead').textContent=`F${String(Math.round(masterT*30)).padStart(4,'0')}`; $('#scrub').value=masterT; $('#jump').value=masterT.toFixed(1);
}

let playing=false,startAt=0,startClock=0,current=0,raf=0;
function loop(now){ if(!playing)return; if(!startClock)startClock=now; current=startAt+(now-startClock)/1000; if(current>=90){current=90;playing=false;$('#play').textContent='Play';} render(current); if(playing)raf=requestAnimationFrame(loop);}
$('#play').onclick=()=>{playing=!playing;$('#play').textContent=playing?'Pause':'Play'; if(playing){startAt=current;startClock=0;raf=requestAnimationFrame(loop);}else cancelAnimationFrame(raf)};
$('#restart').onclick=()=>{playing=false;current=0;startAt=0;startClock=0;$('#play').textContent='Play';render(0)};
$('#scrub').oninput=e=>{playing=false;$('#play').textContent='Play';current=+e.target.value;render(current)};
$('#go').onclick=()=>{playing=false;current=clamp(+$(`#jump`).value,0,90);$('#play').textContent='Play';render(current)};

const params=new URLSearchParams(location.search); if(params.get('present')==='1') document.body.classList.add('present'); current=clamp(parseFloat(params.get('t')||'0'),0,90); render(current);
if(params.get('autoplay')==='1') $('#play').click();
