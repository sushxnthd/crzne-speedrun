(()=>{
  const $=q=>document.querySelector(q);
  const model=window.CRZNEAnatomyModel;
  if(!model)return;

  function parsePanelTransform(s){
    const m=(s||'').match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
    return m?[+m[1],+m[2]]:[0,0];
  }

  function parseFastenerTransform(s){
    const m=(s||'').match(/translate\(([-\d.]+)\s+([-\d.]+)\)\s*rotate\(([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\)/);
    return m?{x:+m[1],y:+m[2],a:+m[3],cx:+m[4],cy:+m[5]}:null;
  }

  function update(t){
    const close=model.smooth(model.inv(t,77.2,80.3));
    const panel=$('#ahPanel');
    const proof=$('#ahProof');
    const interlocks=$('#ahInterlocks');
    const legend=$('#ahLegend');

    if(t>=77.2){
      // Base layer supplies the fully-open pose every frame; fold that pose back to rest.
      if(panel){
        const [x,y]=parsePanelTransform(panel.getAttribute('transform'));
        panel.setAttribute('transform',`translate(${x*(1-close)} ${y*(1-close)})`);
        panel.querySelectorAll('.ah-fastener').forEach(el=>{
          const f=parseFastenerTransform(el.getAttribute('transform'));
          if(f){const k=1-close;el.setAttribute('transform',`translate(${f.x*k} ${f.y*k}) rotate(${f.a*k} ${f.cx} ${f.cy})`);}
        });
      }
      if(proof)proof.style.opacity=String(1-close);

      // Interlock becomes the new active mechanism only once the service panel is nearly home.
      const inter=model.smooth(model.inv(t,79.7,81.0));
      if(interlocks)interlocks.style.opacity=String(inter);
      if(legend)legend.style.opacity=String(inter);
    }

    // Give the three failed known-answer checks a restrained red mechanical signal, not a floating label.
    if(t>=49&&t<58){
      [2,3,4].forEach(i=>{
        const sh=$(`#ahShutter${i}`);
        if(sh){sh.style.filter='url(#softGlow)';sh.style.opacity='1';}
      });
    }
  }

  const start=()=>{
    if(typeof render!=='function')return;
    const prev=render;render=function(t){prev(t);update(t)};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
