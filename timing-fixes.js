(()=>{
  const $=(q)=>document.querySelector(q);
  const C=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const I=(t,a,b)=>C((t-a)/(b-a));
  const E=t=>{t=C(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  const O=t=>1-Math.pow(1-C(t),4);
  const L=(a,b,t)=>a+(b-a)*t;
  const show=(e,v)=>{if(e)e.style.opacity=C(v)};

  function animate(t){
    // Make the question land on the spoken "how can..." rather than arriving late.
    if(t>=55.8&&t<60.5){
      const p=O(I(t,55.8,56.4))*(1-I(t,59.4,60.5));
      show($('#whyScene'),p);
    }

    // Pull the precision-vs-identifiability demonstration forward to the actual narration.
    if(t>=71&&t<80){
      const p=O(I(t,71.0,71.7))*(1-I(t,79.0,80.0));
      show($('#shotsScene'),p);
      const q=E(I(t,71.4,76.1));
      const n=Math.round(20000*Math.pow(50,q));
      if($('#shotCount'))$('#shotCount').textContent=n.toLocaleString('en-US');
      const spread=L(120,16,q);
      [['#unc1',805,605],['#unc2',1345,595]].forEach(([sel,x,y])=>{
        const e=$(sel); if(e)e.setAttribute('d',`M${x} ${y-spread/2}v${spread} M${x-45} ${y-spread/2}h90 M${x-45} ${y+spread/2}h90`);
      });
      show($('#precisionLabel'),O(I(t,74.0,75.0))*(1-I(t,79.0,80.0)));
    }

    // Final conceptual lock now begins as soon as the conclusion begins.
    if(t>=79.5){
      show($('#finalScene'),O(I(t,79.5,80.3)));
      const p1=O(I(t,80.2,81.2));
      const p2=O(I(t,85.8,86.8));
      const p3=O(I(t,86.8,87.8));
      const key=(id,p)=>{const e=$(`${id} .key`);if(e)e.setAttribute('transform',`translate(0 ${L(0,195,p)})`)};
      key('#lock1',p1);key('#lock2',p2);key('#lock3',p3);
      show($('#reliable'),O(I(t,87.8,88.7)));
      show($('#paperTitle'),O(I(t,88.5,89.3)));
    }

    // Keep the selected script readable through the last sentence.
    if($('#captionBox'))$('#captionBox').style.opacity=t<89.8?1:C((90-t)/.2);
  }

  const start=()=>{
    if(typeof render!=='function')return;
    const prev=render;
    render=function(t){prev(t);animate(t)};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
