/* Deterministic editorial motion authored to recording-timeline.json.
 * Transparent RGBA output. Paper images preserve the user's original typesetting.
 * All animation is a pure function of absolute time, including backwards seeks. */
(()=>{
const C={white:'#fffaf1',muted:'#c9d7df',blue:'#78d9ff',violet:'#c8a7ff',amber:'#ffd18a',red:'#ff9a90',teal:'#88ead1',line:'#b5c7d1'};
const clamp=x=>Math.min(1,Math.max(0,x)),ease=x=>1-Math.pow(1-clamp(x),3),smooth=x=>{x=clamp(x);return x*x*(3-2*x)},r=(t,a,d=.65)=>ease((t-a)/d),fmt=x=>Number(x.toFixed(4));
const group=(s,a='')=>`<g ${a}>${s}</g>`,rect=(x,y,w,h,fill,rx=0,a='')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${h}" fill="${fill}" rx="${rx}" ${a}/>`;
const text=(s,x,y,size=48,fill=C.white,a='')=>`<text x="${x}" y="${y}" font-size="${size}" style="fill:${fill}" ${a}>${s}</text>`;
const line=(x,y,xx,yy,color=C.line,width=2,a='')=>`<path d="M${x} ${y}L${xx} ${yy}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${a}/>`;
const circle=(x,y,rad,color,a='')=>`<circle cx="${x}" cy="${y}" r="${rad}" fill="${color}" ${a}/>`;
const path=(d,col,width=4,a='')=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${a}/>`;
let clips='',cid=0;const clip=(x,y,w,h,s)=>{const id='clip'+cid++;clips+=`<clipPath id="${id}">${rect(x,y,w,h,'white')}</clipPath>`;return group(s,`clip-path="url(#${id})"`)};
function reveal(s,x,y,size,t,a,color=C.white,weight=650){const q=r(t,a,.72);return clip(x-3,y-size-8,850-x,size+30,text(s,x,y+fmt((1-q)*size*1.1),size,color,`font-weight="${weight}" opacity="${fmt(q)}" data-reveal="${q}"`))}
const small=(s,x,y,color=C.muted)=>text(s,x,y,19,color,'letter-spacing="1.5"');
function heading(label,lines,t,color=C.blue){let s=small(label,80,181,color);lines.forEach((v,i)=>s+=reveal(v,78,281+i*78,64,t,.08+i*.13));return s}
function source(s,t,a=0){return group(text(s,80,957,21,C.muted,'letter-spacing="0"'),`opacity="${fmt(r(t,a))}"`)}
function paper(name,x,y,w,h,t,a=0,angle=-1){const q=r(t,a,.8),rot=angle*(1-q)*4;return group(rect(x-10,y-10,w+20,h+20,'#fff',4)+`<image href="paper-assets/${name}.png" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`,`opacity="${fmt(q)}" transform="translate(${fmt((1-q)*40)} ${fmt((1-q)*65)}) rotate(${fmt(rot)} ${x+w/2} ${y+h/2})"`)}
function graph(t,proof=false,precision=0){
 const x0=125,y0=770,w=660,h=345,Y=v=>y0-(v-.78)/.24*h,X=v=>x0+v/3.4*w,A=v=>Math.exp(-.05*v),B=v=>Math.exp(-.05*v-.02*(v-1)*(v-3));
 let s=line(x0,410,x0,y0,C.muted,1.5)+line(x0,y0,x0+w,y0,C.muted,1.5);
 for(const v of [0,1,3])s+=line(X(v),y0,X(v),y0+8)+text(v,X(v),y0+38,23,C.muted,'text-anchor="middle"');
 s+=small('NOISE AMPLIFICATION',310,842)+text('E(λ)',95,398,26,C.muted,'class="math"');
 const prog=proof?r(t,1.55,1.7):r(t,.1,1.6),lo=1;
 for(let k=0;k<(proof?2:1);k++){
 const fn=k?B:A,col=k?C.violet:C.blue;let d='';const max=lo+(3.35-lo)*prog;
 for(let v=lo;v<=max+.001;v+=.025)d+=(d?'L':'M')+fmt(X(v))+' '+fmt(Y(fn(v)))+' ';
 if(d)s+=path(d,col,4);
 if(proof){let back='';const e=r(t,5.3,1.1);for(let v=1;v>=1-e;v-=.015)back+=(back?'L':'M')+fmt(X(v))+' '+fmt(Y(fn(v)))+' ';if(back)s+=path(back,col,4)}
 }
 for(const v of [1,3]){const q=r(t,proof?.6:.5+(v-1)*.25);s+=group(line(X(v),y0,X(v),Y(A(v)),C.muted,1,'stroke-dasharray="4 7"')+circle(X(v),Y(A(v)),8,C.white)+circle(X(v),Y(A(v)),15,'none',`stroke="${C.blue}" stroke-width="1.5" opacity=".65"`),`opacity="${q}"`)}
 if(!proof){const q=r(t,1.55,1.45);let d='';for(let v=1;v>=1-q;v-=.02)d+=(d?'L':'M')+fmt(X(v))+' '+fmt(Y(A(v)))+' ';if(d)s+=path(d,C.teal,4,'stroke-dasharray="8 6"');s+=group(circle(X(0),Y(1),9,C.teal)+text('INFERRED',155,436,22,C.teal),`opacity="${r(t,2.5)}"`)}
 if(proof){const q=r(t,5.85,.7);s+=group(line(X(0)-20,Y(1),X(0)-20,Y(B(0)),C.teal,4)+circle(X(0),Y(1),7,C.blue)+circle(X(0),Y(B(0)),7,C.violet)+text('1.000',154,Y(1)-8,27,C.blue)+text('0.942',154,Y(B(0))+33,27,C.violet),`opacity="${q}"`);s+=small('MODEL A',550,386,C.blue)+small('MODEL B',690,386,C.violet)}
 if(precision>0){for(const v of [1,3]){const q=r(precision,.1,2.1),sh=28*(1-q)+4;for(let i=0;i<12;i++){const a=i*Math.PI*2/12;s+=circle(X(v)+Math.cos(a)*sh,Y(A(v))+Math.sin(a)*sh,2,C.white,`opacity="${.25+.5*q}"`)}}}
 return s;
}
const scenes=[
 {a:0,b:4.28,id:'authors',draw:t=>{
 let s=small('IRIS 2026 · QUANTUM COMPUTING',80,184,C.blue);
 s+=reveal('A question of',78,283,68,t,.08)+reveal('certainty.',78,363,76,t,.24);
 s+=paper('title',86,423,716,207,t,.42);
 s+=reveal('Aryan Kumar',80,743,36,t,.65)+reveal('Sushanth Dasari',80,790,36,t,.85);
 return s+small('STUDENT RESEARCHERS',80,841);}},
 {a:4.28,b:7.96,id:'zne-title',draw:t=>{
 let s=small('THE METHOD',80,181,C.blue);
 ['ZERO','NOISE','EXTRAPOLATION'].forEach((v,i)=>s+=reveal(v,76,335+i*110,i===2?66:112,t,.06+i*.18,i===1?C.blue:C.white,700));
 s+=group(line(80,638,80+730*r(t,.5),638,C.blue,3)+text('Infer the answer at zero noise.',80,707,32),`opacity="${r(t,.55)}"`);return s;}},
 {a:7.96,b:14.67,id:'zne-graph',draw:t=>heading('01 / AMPLIFY → EXTRAPOLATE',['More noise.','Then look backward.'],t)+graph(t)+source('Illustrative response · unmeasured zero coordinate',t,.6)},
 {a:14.67,b:19.78,id:'dynamic',draw:t=>{
 let s=heading('DYNAMIC QUANTUM CIRCUITS',['Measure. Decide.','Keep computing.'],t);
 [475,680].forEach(y=>s+=line(96,y,800,y,C.muted,2));
 const q=r(t,.3,1.8);s+=path('M102 475H340V560H590V680H800',C.blue,4,`pathLength="1" stroke-dasharray="${q} 1"`);
 s+=rect(172,440,70,70,'#173140',8)+text('H',207,487,36,C.white,'text-anchor="middle"');
 s+=rect(302,438,78,75,'#24303e',8)+path('M315 488A26 26 0 0 1 367 488',C.white,2)+line(340,482,355,458,C.white,2);
 s+=group(rect(435,532,174,57,'#293a46',5)+text('IF  m = 1',522,570,25,C.amber,'text-anchor="middle"')+rect(652,643,76,76,'#2b2342',8)+text('X',690,695,36,C.violet,'text-anchor="middle"'),`opacity="${r(t,1.2)}"`);
 s+=small('MID-CIRCUIT',270,413,C.violet)+small('CLASSICAL FEEDFORWARD',420,793,C.amber);return s+source('Later operations depend on a measurement result.',t,.7);}},
 {a:19.78,b:25.93,id:'controls',draw:t=>{
 let s=heading('THREE INDEPENDENT CONTROLS',['Turn each knob.','Test their interaction.'],t);
 const rows=[['G','Gate operations',C.blue,0],['L','Feedforward latency',C.amber,.85],['M','Mid-circuit measurement',C.violet,1.95]];
 rows.forEach(([v,l,c,delay],i)=>{const q=r(t,delay,.65),y=465+i*142;s+=group(text(v,80,y+45,69,c,'font-weight="650"')+text(l,172,y+13,31)+line(173,y+48,800,y+48,C.muted,1)+line(173,y+48,173+530*q,y+48,c,4)+circle(173+530*q,y+48,8,c),`opacity="${q}" transform="translate(${fmt(35*(1-q))} 0)"`)});
 return s+source('Amplification controls ≠ independent physical channels',t,2.3);}},
 {a:25.93,b:32.88,id:'factorial',draw:t=>{
 let s=heading('PRE-SPECIFIED EXPERIMENT',['Every combination.'],t);
 s+=reveal('2<tspan dy="-43" font-size="59">3</tspan><tspan dy="43"> = 8</tspan>',78,480,130,t,.1,C.blue);
 s+=text('LOW / HIGH',80,551,25,C.muted)+text('G · L · M',80,597,29);
 const P=[[470,535],[680,535],[470,745],[680,745],[555,455],[765,455],[555,665],[765,665]];
 for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([1,2,4].includes(i^j)){const q=r(t,.25,1.1),a=P[i],b=P[j];s+=line(a[0],a[1],a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q,C.line,2)}
 P.forEach(([x,y],i)=>{const q=r(t,.55+i*.15,.45);s+=circle(x,y,8*q,i&4?C.violet:C.blue)+circle(x,y,16*q,'none',`stroke="${i&4?C.violet:C.blue}" opacity=".35"`)});
 s+=group(line(80,825,810,825,C.muted,1)+text('3 IBM circuits · known ideal answers',80,883,30),`opacity="${r(t,3.6)}"`);return s;}},
 {a:32.88,b:42,id:'interaction',draw:t=>{
 let s=small('THE PRIMARY RESULT',80,181,C.blue);
 s+=reveal('The primary interaction.',78,279,54,t,.1);
 s+=reveal('b<tspan baseline-shift="sub" font-size="36">LM</tspan> = +0.0007',80,387,76,t,3.65,C.blue);
 s+=paper('interaction',94,454,595,414,t,.28);
 s+=line(94,882,94+595*r(t,3.65,.9),882,C.blue,3);
 s+=group(rect(717,466,3,340,C.blue)+text('95% CI',745,510,24,C.blue)+text('−0.0033',745,554,22)+text('+0.0049',745,591,22),`opacity="${r(t,4.6)}"`);
 return s+source('Paper Fig. 3 · primary echoed spectator',t,.7);}},
 {a:42,b:44.72,id:'turn',draw:t=>{
 let s=small('THE TURNING POINT',80,181,C.red);
 s+=reveal('Reassuring.',77,388,91,t,.02);
 s+=line(79,360,79+715*r(t,1.2,.3),360,C.red,5);
 s+=reveal('Not enough.',77,529,91,t,1.45,C.red);return s;}},
 {a:44.72,b:51.48,id:'coverage',draw:t=>{
 let s=heading('EXTRAPOLATION / THE CHECK',['All five strategies','miss the ideal.'],t,C.red);
 const labels=['PROBE · SPECTATOR','PROBE · FEEDFORWARD','GHZ · PARITY'],imgs=['coverage-probe','coverage-feedforward','coverage-ghz'];
 const focus=Math.min(2,Math.max(0,Math.floor((t-1.4)/1.5)));
 s+=paper(imgs[focus],94,410,504,443,t,.28);
 s+=small(labels[focus],94,888,C.white);
 s+=reveal('3',660,543,126,t,2.1,C.red);
 s+=text('OF 6',670,602,28,C.red)+text('observables',640,652,25);
 s+=group(line(651,702,818,702,C.red,3)+text('Known ideal',645,752,23)+text('E = 1',663,802,34,C.teal,'class="math"'),`opacity="${r(t,2.3)}"`);
 return s+source('Paper Fig. 5 · original 95% intervals',t,.7);}},
 {a:51.48,b:57.04,id:'question',draw:t=>{
 let s=small('THE QUESTION',80,181,C.violet);s+=reveal('Separable.',77,325,99,t,.2,C.blue);
 s+=reveal('Still wrong?',77,452,99,t,2.8,C.red);
 s+=paper('title',87,575,712,202,t,1);
 return s+source('A diagnostic and a prediction ask different questions.',t,3.4);}},
 {a:57.04,b:59.02,id:'paper-proof',draw:t=>{
 let s=heading('THE PAPER / SECTION II C',['Here is the proof.'],t,C.violet);
 s+=paper('equation',92,396,704,74,t,.15);
 s+=line(426,451,426+270*r(t,.8,.55),451,C.amber,4,`opacity="${r(t,.8)}"`);
 s+=reveal('One added term.',80,616,62,t,.4,C.violet);
 s+=reveal('An unmeasured difference.',80,692,44,t,.6);
 return s+source('Original Eq. (7) · f = ln E',t,.35);}},
 {a:59.02,b:67.84,id:'proof',draw:t=>{
 let s=heading('IDENTIFIABILITY',['Same measurements.','Different zero.'],t,C.violet)+graph(t,true);
 s+=paper('equation',282,869,520,55,t,.35);
 s+=text('f = ln E',80,907,27,C.white,'class="math"');
 return s+source('Sec. II C · illustrative pair, not a hardware fit',t,.5);}},
 {a:67.84,b:71.82,id:'precision',draw:t=>{
 let s=heading('MORE SHOTS, SAME SETTINGS',['Precision improves.','Ambiguity remains.'],t,C.violet)+graph(7,true,t);
 return s+source('Repeated measurements cannot identify the continuation.',t,.5);}},
 {a:71.82,b:81.05,id:'distinction',draw:t=>{
 let s=small('THE DISTINCTION',80,181,C.blue);
 s+=reveal('What we measured',80,305,61,t,.12,C.blue);
 s+=reveal('≠',80,443,105,t,2.9,C.red);
 s+=reveal('what we infer.',80,568,73,t,3.2);
 s+=group(line(82,651,809,651,C.muted,1)+text('Separability describes the sampled response.',80,720,30)+text('It does not certify the zero-noise answer.',80,768,30),`opacity="${r(t,4)}"`);return s;}},
 {a:81.05,b:89.8,id:'requirements',draw:t=>{
 let s=heading('THREE DISTINCT REQUIREMENTS',['Keep them separate.'],t,C.teal);
 const rows=[['01','Interaction diagnostics',2.6],['02','Justified response model',4.95],['03','Calibrated zero-noise target',6.6]];
 rows.forEach(([n,l,a],i)=>{const q=r(t,a,.62),y=429+i*136;s+=group(text(n,80,y+32,28,C.teal)+text(l,150,y+32,36)+line(150,y+69,818,y+69,C.muted,1)+line(150,y+69,150+668*q,y+69,C.teal,2),`opacity="${q}" transform="translate(0 ${fmt((1-q)*25)})"`)});
 return s+group(small('CR-ZNE  /  ARYAN KUMAR + SUSHANTH DASARI',80,932,C.muted),`opacity="${r(t,7.2)}"`);}}
];
const film=document.querySelector('#film');
function render(t){t=Math.max(0,Math.min(89.8,t));clips='';cid=0;let active=scenes.findIndex(s=>t>=s.a&&t<s.b);if(active<0)active=scenes.length-1;const sc=scenes[active];let body='';
 const q=smooth((t-sc.a-.12)/.20),old=1-smooth((t-sc.a)/.14);
 if(active>0&&old>0){const prev=scenes[active-1];body+=group(prev.draw(prev.b-prev.a),`data-scene="${prev.id}" opacity="${fmt(old)}" transform="translate(0 ${fmt(-20*(1-old))})"`)}
 body+=group(sc.draw(t-sc.a),`data-scene="${sc.id}" opacity="${active===0?1:fmt(q)}"`);
 film.innerHTML=`<defs><linearGradient id="shade" x1="0" x2="1"><stop offset="0" stop-color="#07131d" stop-opacity=".90"/><stop offset=".68" stop-color="#07131d" stop-opacity=".83"/><stop offset=".84" stop-color="#07131d" stop-opacity=".60"/><stop offset="1" stop-color="#07131d" stop-opacity="0"/></linearGradient>${clips}</defs>${rect(0,0,1100,1080,'url(#shade)')}${small('CR-ZNE',80,93,C.white)}${small('RESEARCH FILM',255,93,C.muted)}${line(80,119,817,119,C.muted,1,'opacity=".35"')}${body}${line(80,990,817,990,C.muted,1,'opacity=".25"')}${line(80,990,80+737*t/89.8,990,C.blue,2)}`;
 document.querySelector('#seek').value=t;document.querySelector('#clock').textContent=t.toFixed(2);return{time:t,scene:sc.id,transition:q<1,faceSafeX:1100};}
window.render=render;window.MotionFilm={scenes:scenes.map(({a,b,id})=>({a,b,id})),duration:89.8};
const query=new URLSearchParams(location.search);if(query.has('export'))document.body.classList.add('export');
let now=0,playing=false,last=0;document.querySelector('#seek').oninput=e=>{now=+e.target.value;render(now)};document.querySelector('#play').onclick=()=>playing=!playing;function tick(ts){if(playing){now=Math.min(89.8,now+(ts-last)/1000);render(now);if(now>=89.8)playing=false}last=ts;requestAnimationFrame(tick)}requestAnimationFrame(tick);
const assets=['title','interaction','equation','coverage-probe','coverage-feedforward','coverage-ghz'];Promise.all([...assets.map(s=>new Promise((res,rej)=>{const im=new Image;im.onload=res;im.onerror=rej;im.src='paper-assets/'+s+'.png'})),document.fonts.load('600 70px Inter'),document.fonts.load('500 30px Operators')]).then(()=>{render(+query.get('t')||0);window.MotionReady=true});
})();
