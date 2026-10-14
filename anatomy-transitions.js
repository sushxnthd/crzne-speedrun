(()=>{
  const $=q=>document.querySelector(q);
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const inv=(t,a,b)=>clamp((t-a)/(b-a));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  const lerp=(a,b,p)=>a+(b-a)*p;

  function update(t){
    const intro=$('#intro');
    const question=$('#question');
    const hero=$('#anatomyHero');
    const art=$('#ahArt');
    const frame=$('#ahFrame');

    // Human intro hands off once, cleanly, to the scientific apparatus.
    if(intro) intro.style.opacity=String(1-smooth(inv(t,3.45,4.12)));
    if(hero && t<4.3) hero.style.opacity=String(smooth(inv(t,3.62,4.26)));

    // Research question stands alone before the framed Anatomy figure takes over.
    if(question){
      const qIn=smooth(inv(t,4.05,4.48));
      const qOut=1-smooth(inv(t,7.55,8.18));
      question.style.opacity=String(qIn*qOut);
    }

    // The Anatomy title/readout belongs to the figure, not the intro/question.
    if(frame){
      let f=smooth(inv(t,7.78,8.34));
      if(t>=55.65&&t<59.45){
        const down=smooth(inv(t,55.65,56.08));
        const up=smooth(inv(t,58.15,59.25));
        f*=t<58.15?lerp(1,.06,down):lerp(.06,1,up);
      }
      frame.style.opacity=String(f);
    }

    // WHY is a true cognitive pause: machine recedes, then returns before the proof opens.
    if(art && t>=55.55&&t<60){
      const down=smooth(inv(t,55.55,56.15));
      const up=smooth(inv(t,57.72,59.38));
      const o=t<57.72?lerp(1,.035,down):lerp(.035,1,up);
      art.style.opacity=String(o);
    }
  }

  const start=()=>{
    if(typeof render!=='function')return;
    const prev=render;render=function(t){prev(t);update(t)};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
