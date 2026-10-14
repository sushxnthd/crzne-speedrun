(()=>{
  const NS='http://www.w3.org/2000/svg';
  const $=q=>document.querySelector(q);
  const model=window.CRZNEAnatomyModel;
  if(!model)return;

  const R={};
  const oldVisuals=['#machine','#zne','#modules','#cubeScene','#interactionScene','#resultsScene','#cutawayScene','#shotsScene','#finalScene'];
  const ca=Math.cos(Math.PI/4), sa=Math.sin(Math.PI/4), se=Math.sin(Math.PI/6), ce=Math.cos(Math.PI/6);
  const SCALE=1.72, OX=960, OY=690;

  const E=(name,attrs={},text='')=>{const el=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));if(text)el.textContent=text;return el};
  const P=([x,y,z])=>[OX+(ca*x-sa*y)*SCALE, OY+(sa*se*x+ca*se*y-ce*z)*SCALE];
  const D=([x,y,z])=>sa*ce*x+ca*ce*y+se*z;
  const delta=([x,y,z])=>{const a=P([0,0,0]),b=P([x,y,z]);return[b[0]-a[0],b[1]-a[1]]};
  const pts=a=>a.map(p=>P(p).map(v=>v.toFixed(2)).join(',')).join(' ');
  const show=(el,v)=>{if(el)el.style.opacity=Math.max(0,Math.min(1,v))};
  const g=(id,cls='')=>E('g',{id,class:cls});
  const line=(parent,a,b,cls='ah-line',w)=>{const p=P(a),q=P(b),el=E('path',{d:`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`,class:cls});if(w)el.setAttribute('stroke-width',w);parent.appendChild(el);return el};
  const path3=(parent,arr,cls='ah-line')=>{const d=arr.map((p,i)=>{const q=P(p);return`${i?'L':'M'}${q[0]} ${q[1]}`}).join('');const el=E('path',{d,class:cls});parent.appendChild(el);return el};
  const poly=(parent,arr,cls)=>{const el=E('polygon',{points:pts(arr),class:cls});parent.appendChild(el);return el};

  function box(parent,name,x,y,z,w,d,h,extra=''){
    const q=g('',`ah-part ${extra}`);q.dataset.name=name;q.dataset.depth=D([x+w/2,y+d/2,z+h/2]);
    const a=[x,y,z],b=[x+w,y,z],c=[x+w,y+d,z],d0=[x,y+d,z];
    const A=[x,y,z+h],B=[x+w,y,z+h],C=[x+w,y+d,z+h],D0=[x,y+d,z+h];
    poly(q,[b,c,C,B],'ah-x'); poly(q,[d0,c,C,D0],'ah-y'); poly(q,[A,B,C,D0],'ah-top');
    parent.appendChild(q);return q;
  }

  function cyl(parent,name,cx,cy,z,r,h,extra='',steps=18){
    const q=g('',`ah-part ${extra}`);q.dataset.name=name;q.dataset.depth=D([cx,cy,z+h/2]);
    const lo=[],hi=[];for(let i=0;i<steps;i++){const a=Math.PI*2*i/steps;lo.push([cx+r*Math.cos(a),cy+r*Math.sin(a),z]);hi.push([cx+r*Math.cos(a),cy+r*Math.sin(a),z+h]);}
    const sides=[];for(let i=0;i<steps;i++){const j=(i+1)%steps;const mid=[(lo[i][0]+lo[j][0])/2,(lo[i][1]+lo[j][1])/2,z+h/2];sides.push({i,j,k:D(mid)});}sides.sort((a,b)=>a.k-b.k).forEach((s,idx)=>poly(q,[lo[s.i],lo[s.j],hi[s.j],hi[s.i]],idx%2?'ah-y':'ah-x'));
    poly(q,hi,'ah-top');parent.appendChild(q);return q;
  }

  function bolt(parent,x,y,z,r=3,cls='ah-fastener'){
    const p=P([x,y,z]);const c=E('circle',{cx:p[0],cy:p[1],r,class:cls});parent.appendChild(c);return c;
  }

  function cable(parent,points){
    const d=points.map((p,i)=>{const q=P(p);return`${i?'L':'M'}${q[0]} ${q[1]}`}).join('');
    parent.appendChild(E('path',{d,class:'ah-cable'}));parent.appendChild(E('path',{d,class:'ah-cable-core'}));
    const a=P(points[0]),b=P(points[points.length-1]);parent.appendChild(E('circle',{cx:a[0],cy:a[1],r:5,class:'ah-dark-fastener'}));parent.appendChild(E('circle',{cx:b[0],cy:b[1],r:5,class:'ah-dark-fastener'}));
  }

  function knurl(parent,cx,cy,z,r,n=18){
    for(let i=0;i<n;i++){const a=Math.PI*2*i/n;const p1=P([cx+r*Math.cos(a),cy+r*Math.sin(a),z]);const p2=P([cx+(r+2)*Math.cos(a),cy+(r+2)*Math.sin(a),z]);parent.appendChild(E('path',{d:`M${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}`,class:'ah-faint'}));}
  }

  function sortParts(parent){[...parent.children].sort((a,b)=>(+a.dataset.depth||0)-(+b.dataset.depth||0)).forEach(x=>parent.appendChild(x));}

  function arcPath(cx,cy,r,a0,a1){const p0=[cx+r*Math.cos(a0),cy+r*Math.sin(a0)],p1=[cx+r*Math.cos(a1),cy+r*Math.sin(a1)],large=Math.abs(a1-a0)>Math.PI?1:0;return`M${p0[0]} ${p0[1]}A${r} ${r} 0 ${large} 1 ${p1[0]} ${p1[1]}`;}

  function buildBase(parent){
    const s=g('ahStatic','');parent.appendChild(s);
    const shadow=poly(s,[[-278,-138,-13],[278,-138,-13],[278,138,-13],[-278,138,-13]],'ah-shadow');shadow.dataset.depth=-999;
    box(s,'base',-270,-130,0,540,260,18);
    [[-235,-98],[235,-98],[-235,98],[235,98]].forEach(([x,y],i)=>{cyl(s,`foot-flange-${i}`,x,y,-15,18,4,'ah-lo');cyl(s,`foot-${i}`,x,y,-12,13,12);});
    box(s,'front-datum',-235,91,19,470,9,7,'ah-lo');
    box(s,'rear-datum',-235,-101,19,470,8,7,'ah-lo');
    box(s,'ruler-strip',-210,77,19,420,7,2,'ah-lo');
    for(let x=-205;x<=205;x+=10){const h=x%50===0?8:4;line(s,[x,79,21],[x,79-h*.22,21],x%50===0?'ah-line':'ah-faint');}
    box(s,'cable-trough',-218,-120,18,436,14,8,'ah-lo');
    box(s,'left-stop',-251,-105,20,12,210,20);
    box(s,'right-stop',239,-105,20,12,210,20);
    [-225,-150,-75,0,75,150,225].forEach(x=>[-108,108].forEach(y=>bolt(s,x,y,19,3.2)));
    const lp=box(s,'label-plate',-245,108,26,118,9,3,'ah-lo');
    const pp=P([-187,113,30]);const txt=E('text',{x:pp[0],y:pp[1],class:'ah-engrave','text-anchor':'middle'},'CR-ZNE');s.appendChild(txt);
    sortParts(s);
  }

  function buildZNE(parent){
    const q=g('ahZNE','');parent.appendChild(q);R.zne=q;
    [-8,28].forEach(y=>{box(q,`zne-rail-${y}`,-160,y,27,330,6,6);[-145,150].forEach(x=>{box(q,`rail-support-${x}-${y}`,x-9,y-7,19,18,20,8,'ah-lo');bolt(q,x,y,28,2.4);});});
    [[-145,'zero'],[-35,'one'],[145,'three']].forEach(([x,n])=>{cyl(q,`detent-${n}`,x,47,26,6,5,'ah-lo');bolt(q,x,47,32,2.2);});
    const a=P([-152,-14,40]),b=P([-37,-14,40]),c=P([-37,35,40]),d=P([-152,35,40]);q.appendChild(E('polygon',{points:[a,b,c,d].map(v=>v.join(',')).join(' '),class:'ah-glass'}));
    const car=g('ahZNECarriage','');R.zneCar=car;q.appendChild(car);
    box(car,'zne-carriage',-28,-18,34,56,58,10,'ah-hi');
    [[-19,-9],[19,-9],[-19,31],[19,31]].forEach(([x,y])=>{box(car,'zne-bushing',x-7,y-7,44,14,14,7,'ah-lo');bolt(car,x,y,52,2.2);});
    box(car,'zne-pointer',-4,42,44,8,12,12,'ah-lo');
    line(car,[0,48,58],[0,48,68],'ah-accent-line',2.5);
    box(car,'extrap-plunger',-9,-28,47,18,14,18,'ah-hi');
    sortParts(q);
  }

  function buildG(parent){
    const q=g('ahG','');parent.appendChild(q);R.G=q;
    box(q,'G-pedestal',-232,-91,25,92,60,16);
    cyl(q,'G-spindle',-186,-61,41,8,38);
    cyl(q,'G-knob',-186,-61,79,18,8,'ah-hi');knurl(q,-186,-61,87,18,24);
    line(q,[-186,-61,87],[-174,-61,87],'ah-accent-line');
    [-208,-164].forEach(x=>line(q,[x,-90,62],[x,-28,62],'ah-line',4));
    [-92,-27].forEach(y=>box(q,`G-stop-${y}`,-222,y,52,72,6,14,'ah-lo'));
    R.gCass=[];
    [-1,0,1].forEach((k,i)=>{const c=g(`ahGCass${i}`,'');q.appendChild(c);R.gCass.push(c);box(c,`CZ-cassette-${i}`,-211,-61,60,50,24,10,'ah-hi');[-202,-170].forEach(x=>bolt(c,x,-49,71,2.3));});
    sortParts(q);
  }

  function buildL(parent){
    const q=g('ahL','');parent.appendChild(q);R.L=q;
    box(q,'L-pedestal',-92,-91,25,148,60,16);
    [-77,-42].forEach(y=>box(q,`L-rail-${y}`,-79,y,45,122,7,7));
    box(q,'L-rear-stop',-82,-84,42,8,52,18,'ah-lo');box(q,'L-front-stop',38,-84,42,8,52,18,'ah-lo');
    const car=g('ahLCarriage','');q.appendChild(car);R.lCar=car;
    box(car,'L-carriage',-18,-86,52,46,50,11,'ah-hi');
    [[-8,-76],[18,-76],[-8,-48],[18,-48]].forEach(([x,y])=>bolt(car,x,y,64,2.2));
    box(car,'L-delay-bar',22,-70,56,60,18,7,'ah-lo');
    const knob=cyl(q,'L-knob',-68,-54,59,13,7,'ah-hi');knurl(q,-68,-54,66,13,20);
    cyl(q,'L-collar',-68,-54,49,7,10,'ah-lo');
    sortParts(q);
  }

  function buildM(parent){
    const q=g('ahM','');parent.appendChild(q);R.M=q;
    box(q,'M-pedestal',100,-91,25,132,60,16);
    cyl(q,'M-shaft',166,-61,42,8,38);
    cyl(q,'M-crown',166,-61,80,24,8,'ah-hi');knurl(q,166,-61,88,24,28);
    line(q,[166,-61,88],[180,-61,88],'ah-accent-line');
    R.mHeads=[];
    [-30,0,30].forEach((dx,i)=>{const h=g(`ahMHead${i}`,'');q.appendChild(h);R.mHeads.push(h);cyl(h,`M-collar-${i}`,166+dx,-61,61,8,10,'ah-lo');box(h,`M-plunger-${i}`,162+dx,-65,44,8,8,20,'ah-hi');cyl(h,`M-tip-${i}`,166+dx,-61,39,5,5,'ah-cyan');});
    box(q,'parity-pawl',150,-35,50,32,10,7,'ah-lo');
    sortParts(q);
  }

  function buildCage(parent){
    const q=g('ahCage','');parent.appendChild(q);R.cage=q;
    const cx=4,cy=8,cz=80,wx=104,wy=72,h=74;
    const xs=[cx-wx/2,cx+wx/2],ys=[cy-wy/2,cy+wy/2],zs=[cz,cz+h];
    xs.forEach(x=>ys.forEach(y=>box(q,'cage-post',x-3,y-3,cz,6,6,h,'ah-lo')));
    zs.forEach(z=>{ys.forEach(y=>box(q,'cage-x-rail',cx-wx/2,y-3,z,wx,6,6,'ah-lo'));xs.forEach(x=>box(q,'cage-y-rail',x-3,cy-wy/2,z,6,wy,6,'ah-lo'));});
    xs.forEach(x=>ys.forEach(y=>zs.forEach(z=>{cyl(q,'factorial-detent',x,y,z+7,5,4,'ah-lo',12);})))
    const puck=g('ahSelector','');q.appendChild(puck);R.selector=puck;cyl(puck,'selector-puck',cx,cy,cz+h/2,9,7,'ah-cyan',16);
    sortParts(q);
  }

  function buildDial(parent){
    const q=g('ahDialAssembly','');parent.appendChild(q);R.dialAssembly=q;
    box(q,'dial-stand',176,58,25,44,45,18);
    cyl(q,'dial-post',198,80,43,7,55);
    box(q,'dial-clamp',185,67,92,26,26,16,'ah-hi');
    [-1,1].forEach(k=>bolt(q,198+k*9,80,109,2.4));
    const a=P([198,80,118]);
    const face=g('ahDialFace','');q.appendChild(face);R.dialFace=face;
    face.appendChild(E('circle',{cx:a[0],cy:a[1],r:101,class:'ah-dial-face'}));
    face.appendChild(E('circle',{cx:a[0],cy:a[1],r:84,class:'ah-dial-ring'}));
    for(let i=0;i<=12;i++){const ang=(-125+i*(250/12))*Math.PI/180;const r0=i%3===0?64:70,r1=80;face.appendChild(E('line',{x1:a[0]+r0*Math.cos(ang),y1:a[1]+r0*Math.sin(ang),x2:a[0]+r1*Math.cos(ang),y2:a[1]+r1*Math.sin(ang),class:'ah-dial-tick'}));}
    face.appendChild(E('path',{d:arcPath(a[0],a[1],72,-1.75,-1.39),class:'ah-equivalence'}));
    const n=E('line',{x1:a[0],y1:a[1],x2:a[0],y2:a[1]-72,class:'ah-needle'});face.appendChild(n);R.needle=n;R.dialAnchor=a;
    face.appendChild(E('circle',{cx:a[0],cy:a[1],r:12,class:'ah-fastener'}));
    const hw=P([246,86,73]);const hand=g('ahHandwheel','');q.appendChild(hand);R.handwheel=hand;R.handwheelAnchor=hw;
    hand.appendChild(E('circle',{cx:hw[0],cy:hw[1],r:42,fill:'none',stroke:'#7f919b','stroke-width':5}));
    for(let i=0;i<4;i++){const ang=i*Math.PI/2;hand.appendChild(E('line',{x1:hw[0]+8*Math.cos(ang),y1:hw[1]+8*Math.sin(ang),x2:hw[0]+36*Math.cos(ang),y2:hw[1]+36*Math.sin(ang),class:'ah-line'}));}
    hand.appendChild(E('circle',{cx:hw[0],cy:hw[1],r:9,class:'ah-fastener'}));
    sortParts(q);
  }

  function buildFailureBank(parent){
    const q=g('ahFailureBank','');parent.appendChild(q);R.failureBank=q;
    box(q,'inspection-rail',-218,92,26,436,14,9,'ah-lo');
    R.status=[];R.shutters=[];
    for(let i=0;i<6;i++){
      const x=-190+i*75;
      const c=g(`ahCart${i}`,'');q.appendChild(c);
      box(c,`inspection-cartridge-${i}`,x,97,32,58,28,54,'ah-hi');
      bolt(c,x+29,111,89,4,'ah-dark-fastener');
      const led=P([x+29,124,79]);const lamp=E('circle',{cx:led[0],cy:led[1],r:7,class:'ah-dark-fastener'});c.appendChild(lamp);R.status.push(lamp);
      const sh=g(`ahShutter${i}`,'');c.appendChild(sh);R.shutters.push(sh);const sp=P([x,118,48]);sh.appendChild(E('rect',{x:sp[0]-13,y:sp[1]-7,width:26,height:14,rx:4,class:'ah-red'}));
    }
    sortParts(q);
  }

  const CAM_A=[[-150,91],[-105,84],[-40,72],[55,70],[150,68]];
  const CAM_B=[[-150,48],[-105,60],[-40,72],[55,70],[150,68]];
  function camZ(points,x){for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1];if(x>=a[0]&&x<=b[0]){const u=(x-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*u;}}return x<points[0][0]?points[0][1]:points[points.length-1][1];}

  function buildProof(parent){
    const q=g('ahProof','');parent.appendChild(q);R.proof=q;
    box(q,'proof-backplate',-226,115,24,452,6,84,'ah-lo');
    box(q,'proof-ruler',-188,111,32,376,5,8,'ah-lo');
    [-150,-40,150].forEach(x=>{line(q,[x,110,32],[x,110,46],'ah-line',2);bolt(q,x,111,40,2,'ah-dark-fastener');});
    const pa=CAM_A.map(([x,z])=>[x,109,z+18]),pb=CAM_B.map(([x,z])=>[x,109,z+18]);R.trackA=path3(q,pa,'ah-track-a');R.trackB=path3(q,pb,'ah-track-b');
    R.followers=[];[-40,150].forEach((x,i)=>{const z=camZ(CAM_A,x)+18;const p=P([x,108,z]);const f=g(`ahFollower${i}`,'');f.appendChild(E('circle',{cx:p[0],cy:p[1],r:17,class:'ah-follower'}));f.appendChild(E('circle',{cx:p[0],cy:p[1],r:5,class:'ah-fastener'}));q.appendChild(f);R.followers.push(f);});
    const sc=g('ahScan','ah-scan');q.appendChild(sc);R.scan=sc;const p=P([150,104,100]);sc.appendChild(E('rect',{x:p[0]-19,y:p[1]-28,width:38,height:56,rx:10,class:'ah-hi'}));sc.appendChild(E('path',{d:`M${p[0]} ${p[1]+28}L${p[0]} ${p[1]+48}`,class:'ah-accent-line'}));R.scanBase=[150,104,100];
    R.jaws=[];[-40,150].forEach((x,i)=>{const z=camZ(CAM_A,x)+18,p=P([x,104,z]);const j=g(`ahJaw${i}`,'');q.appendChild(j);const l=E('path',{class:'ah-jaw'}),r=E('path',{class:'ah-jaw'});j.appendChild(l);j.appendChild(r);R.jaws.push({l,r,p});});
    sortParts(q);
  }

  function buildPanel(parent){
    const q=g('ahPanel','ah-panel');parent.appendChild(q);R.panel=q;
    box(q,'service-panel',-246,120,23,492,8,91,'ah-hi');
    const a=P([-232,125,31]),b=P([232,125,31]);q.appendChild(E('path',{d:`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`,class:'ah-faint'}));
    R.panelScrews=[];[[-225,124,99],[225,124,99],[-225,124,39],[225,124,39]].forEach((p,i)=>{const s=bolt(q,p[0],p[1],p[2],5,'ah-fastener');R.panelScrews.push(s);});
    box(parent,'panel-guide-L',-258,116,10,8,8,108,'ah-lo');box(parent,'panel-guide-R',250,116,10,8,8,108,'ah-lo');
  }

  function buildInterlocks(parent){
    const q=g('ahInterlocks','');parent.appendChild(q);R.interlocks=q;
    box(q,'interlock-frame',-118,85,38,236,30,56,'ah-lo');
    R.keys=[];
    [-72,0,72].forEach((x,i)=>{box(q,`lock-socket-${i}`,x-22,91,50,44,19,24,'ah-hi');const k=g(`ahKey${i}`,'');q.appendChild(k);R.keys.push(k);box(k,`lock-key-${i}`,x-13,94,86,26,14,42,i===0?'ah-hi':'');bolt(k,x,101,126,3);});
    const latch=g('ahLatch','');q.appendChild(latch);R.latch=latch;box(latch,'output-latch',128,90,54,58,20,24,'ah-hi');
    sortParts(q);
  }

  function buildCables(parent){
    const q=g('ahCables','');parent.appendChild(q);R.cables=q;
    cable(q,[[-186,-36,52],[-135,-12,44],[-70,-4,50],[-40,0,73]]);
    cable(q,[[-5,-35,56],[-2,-10,47],[0,0,63],[0,0,79]]);
    cable(q,[[166,-35,52],[120,-12,45],[70,-2,52],[48,0,74]]);
    [[-132,-12,45],[-66,-4,51],[0,-9,48],[72,-2,52],[121,-12,46]].forEach((p,i)=>{cyl(q,`cable-clamp-${i}`,p[0],p[1],p[2],5,4,'ah-lo',12);});
  }

  function buildFrame(parent){
    const f=g('ahFrame','');parent.appendChild(f);R.frame=f;
    f.appendChild(E('text',{x:118,y:94,class:'ah-card-kicker'},'FIG · CR-ZNE METROLOGY RIG'));
    f.appendChild(E('text',{x:118,y:124,class:'ah-card-title'},'COMPONENT-RESOLVED ZERO-NOISE EXTRAPOLATION'));
    const ph=E('text',{x:1800,y:93,class:'ah-card-kicker','text-anchor':'end'},'LIVE MODEL');f.appendChild(ph);
    const rd=E('text',{x:1800,y:126,class:'ah-readout','text-anchor':'end'},'');f.appendChild(rd);R.readout=rd;
    const lg=g('ahLegend','');f.appendChild(lg);R.legend=lg;
    const items=[['SEPARABILITY',700],['MODEL VALIDITY',960],['ZERO CALIBRATION',1235]];
    items.forEach(([t,x],i)=>{lg.appendChild(E('circle',{cx:x-92,cy:852,r:7,class:i===0?'ah-cyan':'ah-dark-fastener'}));lg.appendChild(E('text',{x,y:858,class:'ah-legend','text-anchor':'middle'},t));});
  }

  function setup(){
    const stage=$('#stage');if(!stage||$('#anatomyHero'))return;
    const root=g('anatomyHero','');
    const cap=$('#captionBox');stage.insertBefore(root,cap||null);R.root=root;
    const art=g('ahArt','');root.appendChild(art);R.art=art;
    buildBase(art);buildZNE(art);buildG(art);buildL(art);buildM(art);buildCables(art);buildCage(art);buildDial(art);buildFailureBank(art);buildProof(art);buildPanel(art);buildInterlocks(art);buildFrame(root);
    R.proof.style.opacity='0';R.failureBank.style.opacity='0';R.interlocks.style.opacity='0';R.legend.style.opacity='0';
  }

  function setFocus(t){
    const assemblies=[R.zne,R.G,R.L,R.M,R.cage,R.dialAssembly,R.failureBank,R.proof,R.interlocks];
    assemblies.forEach(x=>{if(x){x.classList.remove('ah-lit','ah-dim','ah-proof-dim');}});
    let hot=null;
    if(t>=8&&t<17)hot=R.zne;
    else if(t>=19&&t<24.2)hot=R.G;
    else if(t>=24.2&&t<28.5)hot=R.L;
    else if(t>=28.5&&t<31.5)hot=R.M;
    else if(t>=31.5&&t<37)hot=R.cage;
    else if(t>=37&&t<45)hot=R.dialAssembly;
    else if(t>=48&&t<58)hot=R.failureBank;
    else if(t>=60&&t<79)hot=R.proof;
    else if(t>=79)hot=R.interlocks;
    if(hot){hot.classList.add('ah-lit');assemblies.forEach(x=>{if(x&&x!==hot)x.classList.add('ah-dim');});}
  }

  function update(t){
    const s=model.stateAt(t);
    oldVisuals.forEach(q=>{const el=$(q);if(el)el.style.opacity='0'});
    show(R.root,s.visible);
    if(t>=56&&t<60)show(R.art,.18);else show(R.art,1);
    show(R.frame,t>=7.6?1:0);
    R.readout.textContent=model.readoutOf(s);
    setFocus(t);

    const dz=delta([s.zneX,0,0]);R.zneCar.setAttribute('transform',`translate(${dz[0]} ${dz[1]})`);
    R.gCass.forEach((el,i)=>{const off=(i-1)*23*s.g,dd=delta([0,off,0]);el.setAttribute('transform',`translate(${dd[0]} ${dd[1]})`);});
    const dl=delta([42*s.l,0,0]);R.lCar.setAttribute('transform',`translate(${dl[0]} ${dl[1]})`);
    R.mHeads.forEach((el,i)=>{const active=i===0?1:s.m;const lift=i===0?0:26*(1-active);const dm=delta([0,0,lift]);el.setAttribute('transform',`translate(${dm[0]} ${dm[1]})`);el.style.opacity=i===0?1:(.22+.78*active);});
    const fs=s.factorial;const ds=delta([fs.x*52,fs.y*36,fs.z*37]);R.selector.setAttribute('transform',`translate(${ds[0]} ${ds[1]})`);
    const max=.025;const ang=Math.max(-70,Math.min(70,s.interaction/max*70));R.needle.setAttribute('transform',`rotate(${ang} ${R.dialAnchor[0]} ${R.dialAnchor[1]})`);
    R.handwheel.setAttribute('transform',`rotate(${s.control*220} ${R.handwheelAnchor[0]} ${R.handwheelAnchor[1]})`);

    show(R.failureBank,t>=46&&t<60?model.smooth(model.inv(t,46.5,48.5))*(1-model.smooth(model.inv(t,57.2,59.5))):0);
    R.status.forEach((led,i)=>{const fail=s.coverage[i]==='excludes';led.setAttribute('class',s.failure>.65?(fail?'ah-amber':'ah-dark-fastener'):'ah-dark-fastener');});
    R.shutters.forEach((sh,i)=>{const fail=s.coverage[i]==='excludes';const d=delta([0,0,fail?22*s.failure:0]);sh.setAttribute('transform',`translate(${d[0]} ${d[1]})`);sh.style.opacity=fail?s.failure:0;});

    const screwOut=delta([0,12*s.screws,4*s.screws]);R.panelScrews.forEach((x,i)=>x.setAttribute('transform',`translate(${screwOut[0]} ${screwOut[1]}) rotate(${s.screws*180*(i%2?1:-1)} ${x.getAttribute('cx')} ${x.getAttribute('cy')})`));
    const dp=delta([0,42*s.panel,-118*s.panel]);R.panel.setAttribute('transform',`translate(${dp[0]} ${dp[1]})`);
    show(R.proof,s.camReveal);
    const scanX=150-300*s.scan;const scanZ=(camZ(CAM_A,scanX)+camZ(CAM_B,scanX))/2+18;const base=R.scanBase;const dsc=delta([scanX-base[0],0,scanZ-base[2]]);R.scan.setAttribute('transform',`translate(${dsc[0]} ${dsc[1]})`);
    R.trackA.style.opacity=.25+.75*s.camReveal;R.trackB.style.opacity=.25+.75*s.camReveal;
    R.jaws.forEach(j=>{const half=38*s.jaw+5;j.l.setAttribute('d',`M${j.p[0]-half} ${j.p[1]-18}L${j.p[0]-half} ${j.p[1]+18}`);j.r.setAttribute('d',`M${j.p[0]+half} ${j.p[1]-18}L${j.p[0]+half} ${j.p[1]+18}`);});

    show(R.interlocks,t>=78.4?model.smooth(model.inv(t,78.4,80)):0);show(R.legend,t>=79?model.smooth(model.inv(t,79,80.5)):0);
    [s.key1,s.key2,s.key3].forEach((p,i)=>{const dk=delta([0,0,-42*p]);R.keys[i].setAttribute('transform',`translate(${dk[0]} ${dk[1]})`);});
    const latchMove=delta([38*s.latch,0,0]);R.latch.setAttribute('transform',`translate(${latchMove[0]} ${latchMove[1]})`);R.interlocks.classList.toggle('ah-latch-on',s.latch>.96);
    const circles=R.legend.querySelectorAll('circle');if(circles[0])circles[0].setAttribute('class',s.key1>.9?'ah-cyan':'ah-dark-fastener');if(circles[1])circles[1].setAttribute('class',s.key2>.9?'ah-cyan':'ah-dark-fastener');if(circles[2])circles[2].setAttribute('class',s.key3>.9?'ah-cyan':'ah-dark-fastener');
  }

  const start=()=>{
    setup();if(typeof render!=='function')return;
    const prev=render;render=function(t){prev(t);update(t)};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();