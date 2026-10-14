(()=>{
  const $=q=>document.querySelector(q);
  const $$=q=>[...document.querySelectorAll(q)];
  const model=window.CRZNEAnatomyModel;
  if(!model)return;

  function reorderForPainter(){
    const art=$('#ahArt');
    const bank=$('#ahFailureBank');
    if(art&&bank)art.appendChild(bank);

    const proof=$('#ahProof');
    if(proof){
      ['.ah-track-a','.ah-track-b','#ahFollower0','#ahFollower1','#ahScan','#ahJaw0','#ahJaw1'].forEach(q=>{const el=proof.querySelector(q);if(el)proof.appendChild(el);});
    }
  }

  function fitArt(){
    const art=$('#ahArt');if(!art)return;
    const detail=new URLSearchParams(location.search).get('detail')==='1';
    art.setAttribute('transform',detail
      ?'translate(960 545) scale(2.0) translate(-960 -585)'
      :'translate(960 560) scale(1.18) translate(-960 -600)');
  }

  function clearSubjects(){
    $$('.ah-subject-lit').forEach(el=>el.classList.remove('ah-subject-lit'));
  }

  function light(q){const el=$(q);if(el)el.classList.add('ah-subject-lit');}

  function updateSubjects(t){
    clearSubjects();
    if(t>=8&&t<17) light('#ahZNECarriage');
    else if(t>=19&&t<24.2){light('#ahGCass0');light('#ahGCass1');light('#ahGCass2');}
    else if(t>=24.2&&t<28.5) light('#ahLCarriage');
    else if(t>=28.5&&t<31.5){light('#ahMHead0');light('#ahMHead1');light('#ahMHead2');}
    else if(t>=31.5&&t<37) light('#ahSelector');
    else if(t>=37&&t<45){light('#ahDialFace');light('#ahHandwheel');}
    // 48–58 s deliberately leaves cartridge bodies neutral. The red shutters and status lamps encode exactly 3/6 failures.
    else if(t>=60&&t<79){light('#ahScan');}
    else if(t>=79){light('#ahKey0');if(t>=83.3)light('#ahKey1');if(t>=86)light('#ahKey2');if(t>=88)light('#ahLatch');}
  }

  function tuneFailureBank(t){
    const bank=$('#ahFailureBank');if(!bank)return;
    const p=model.smooth(model.inv(t,46.5,48.5));
    bank.setAttribute('transform',`translate(0 ${-64*p})`);
  }

  function simplifyProof(t){
    const proof=$('#ahProof');if(!proof)return;
    const back=proof.querySelector('[data-name="proof-backplate"]');
    if(back)back.classList.remove('ah-subject-lit');
    const scan=$('#ahScan');if(scan)scan.style.opacity=t>=71.5&&t<79?.42:1;
  }

  function setup(){reorderForPainter();fitArt();}

  function update(t){
    fitArt();
    updateSubjects(t);
    tuneFailureBank(t);
    simplifyProof(t);
  }

  const start=()=>{
    setup();
    if(typeof render!=='function')return;
    const prev=render;render=function(t){prev(t);update(t)};
    const j=$('#jump');const t=j?parseFloat(j.value||0):0;render(Number.isFinite(t)?t:0);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
