(()=>{
  const NS='http://www.w3.org/2000/svg';
  const $=(q)=>document.querySelector(q);
  const C=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const I=(t,a,b)=>C((t-a)/(b-a));
  const O=t=>1-Math.pow(1-C(t),4);
  const svg=(n,a={},txt='')=>{const e=document.createElementNS(NS,n);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));if(txt)e.textContent=txt;return e};
  const show=(e,v)=>{if(e)e.style.opacity=C(v)};

  function setupCaption(){
    const box=$('#captionBox'), bg=box&&box.querySelector('rect'), sp=$('#speaker'), cap=$('#caption');
    if(!box||!bg||!sp||!cap)return;
    bg.setAttribute('x','255'); bg.setAttribute('y','897'); bg.setAttribute('width','1410'); bg.setAttribute('height','154'); bg.setAttribute('rx','24');
    sp.setAttribute('x','310'); sp.setAttribute('y','935');
    cap.setAttribute('x','310'); cap.setAttribute('y','970');
    cap.style.fontSize='21.5px';
    cap.style.fontWeight='530';
  }

  function wrapCaption(){
    const cap=$('#caption'); if(!cap)return;
    const raw=cap.textContent.trim();
    if(!raw || cap.dataset.wrappedSource===raw)return;
    cap.dataset.wrappedSource=raw;
    while(cap.firstChild)cap.removeChild(cap.firstChild);
    const words=raw.split(/\s+/);
    const lines=[]; let line=[];
    const test=svg('tspan',{x:'310',y:'970'});
    cap.appendChild(test);
    for(const word of words){
      test.textContent=[...line,word].join(' ');
      const tooWide=test.getComputedTextLength()>1290;
      if(tooWide && line.length){lines.push(line.join(' '));line=[word];test.textContent=word;} else line.push(word);
    }
    if(line.length)lines.push(line.join(' '));
    while(cap.firstChild)cap.removeChild(cap.firstChild);
    const use=lines.length<=3?lines:lines.slice(0,2).concat(lines.slice(2).join(' '));
    const y0=use.length===1?997:use.length===2?982:969;
    use.forEach((s,i)=>cap.appendChild(svg('tspan',{x:'310',y:String(y0+i*28)},s)));
  }

  function setupWhy(){
    const why=$('#whyScene'); if(!why||$('#whyIsolation'))return;
    const scrim=svg('g',{id:'whyIsolation'});
    scrim.appendChild(svg('rect',{x:'0',y:'0',width:'1920',height:'910',fill:'#05080c','fill-opacity':'.94'}));
    scrim.appendChild(svg('circle',{cx:'960',cy:'458',r:'320',fill:'#90e6ff','fill-opacity':'.018'}));
    why.insertBefore(scrim,why.firstChild);
  }

  function setup(){setupCaption();setupWhy();}

  function animate(t){
    wrapCaption();

    // Cleanly hand the frame from the failure result to the explanatory question.
    if(t>=55.0&&t<57.2){
      const out=1-O(I(t,55.0,56.25));
      show($('#resultsScene'),out);
      show($('#coverageSummary'),out);
      show($('#threeSix'),out);
      const rg=$('#resultGauges'); if(rg)rg.style.opacity=String(.06*out);
    }

    // Isolate WHY on a nearly empty field; hold it long enough to register.
    if(t>=56.0&&t<60.2){
      const p=O(I(t,56.0,56.45))*(1-I(t,59.45,60.2));
      show($('#whyScene'),p);
      show($('#whyIsolation'),p);
      const label=$('#whyScene .mega'); if(label){
        const scale=.96+.04*O(I(t,56.0,56.9));
        label.setAttribute('transform',`translate(${960*(1-scale)} ${490*(1-scale)}) scale(${scale})`);
      }
    }

    // Let the closed proof apparatus emerge only after the WHY hold, avoiding overlap.
    if(t>=59.35&&t<61.5){
      const p=O(I(t,59.35,60.25));
      show($('#cutawayScene'),p);
      const panel=$('#panel'); if(panel){panel.style.opacity='1';panel.setAttribute('transform','translate(0 0) rotate(0 750 305)');}
    }
  }

  const start=()=>{
    setup(); if(typeof render!=='function')return;
    const prev=render;
    render=function(t){prev(t);animate(t)};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
