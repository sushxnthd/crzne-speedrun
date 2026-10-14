(()=>{
  const $=q=>document.querySelector(q);
  function recolorDefs(){
    const bg=$('#bg');
    if(bg){const s=bg.querySelectorAll('stop');if(s[0])s[0].setAttribute('stop-color','#f7f5ef');if(s[1])s[1].setAttribute('stop-color','#fbfaf6');}
    const mt=$('#metalTop');if(mt){const s=mt.querySelectorAll('stop');if(s[0])s[0].setAttribute('stop-color','#f5f2ec');if(s[1])s[1].setAttribute('stop-color','#e4dfd6');}
    const ms=$('#metalSide');if(ms){const s=ms.querySelectorAll('stop');if(s[0])s[0].setAttribute('stop-color','#ded9d0');if(s[1])s[1].setAttribute('stop-color','#cbc5bb');}
    const gl=$('#glass');if(gl){const s=gl.querySelectorAll('stop');if(s[0]){s[0].setAttribute('stop-color','#e8752b');s[0].setAttribute('stop-opacity','.09');}if(s[1]){s[1].setAttribute('stop-color','#e8752b');s[1].setAttribute('stop-opacity','.025');}}
    const arrow=$('#arrow path');if(arrow)arrow.setAttribute('fill','#e8752b');
  }
  function hideReferenceCaptions(){
    const cap=$('#captionBox');if(!cap)return;
    cap.style.display='none';cap.style.opacity='0';cap.setAttribute('aria-hidden','true');
  }
  function cleanInlineEffects(){
    document.querySelectorAll('#anatomyHero [style*="filter"]').forEach(el=>{if(el.style.filter.includes('softGlow'))el.style.filter='none';});
    document.querySelectorAll('#whyEnhancement circle').forEach(el=>el.setAttribute('stroke','#e8752b'));
  }
  function setup(){
    document.body.classList.add('anatomy-paper-theme');
    recolorDefs();hideReferenceCaptions();cleanInlineEffects();
  }
  const start=()=>{
    setup();
    if(typeof render!=='function')return;
    const prev=render;
    render=function(t){prev(t);hideReferenceCaptions();cleanInlineEffects();};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
