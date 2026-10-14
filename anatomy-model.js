(()=>{
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const inv=(t,a,b)=>clamp((t-a)/(b-a));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  const ease=x=>1-Math.pow(1-clamp(x),4);
  const lerp=(a,b,t)=>a+(b-a)*t;

  const factorialCorners=[
    [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
    [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
  ];

  function selectorAt(t){
    const p=inv(t,31.5,37.0)*8;
    const i=Math.min(7,Math.floor(p));
    const f=smooth(p-i);
    const a=factorialCorners[i], b=factorialCorners[Math.min(7,i+1)];
    return {
      index:Math.min(8,i+1),
      x:lerp(a[0],b[0],f),
      y:lerp(a[1],b[1],f),
      z:lerp(a[2],b[2],f)
    };
  }

  function interactionAt(t){
    if(t<41.4) return {value:0.0007,control:0};
    if(t<43.1){
      const p=smooth(inv(t,41.4,43.1));
      return {value:lerp(0.0007,-0.0104,p),control:p};
    }
    if(t<44.6){
      const p=smooth(inv(t,43.1,44.6));
      return {value:lerp(-0.0104,-0.0213,p),control:1};
    }
    const p=smooth(inv(t,44.6,45));
    return {value:lerp(-0.0213,0.0007,p),control:1-p};
  }

  function stateAt(t){
    const s={t};
    s.visible=smooth(inv(t,3.6,5.0))*(1-smooth(inv(t,89.7,90))*.12);

    // ZNE rail: nominal λ=1 -> amplified λ=3 -> inferred zero coordinate -> calm return to nominal.
    if(t<9) s.zneX=-35;
    else if(t<13.2) s.zneX=lerp(-35,145,smooth(inv(t,9,13.2)));
    else if(t<16.2) s.zneX=lerp(145,-145,smooth(inv(t,13.2,16.2)));
    else if(t<18.8) s.zneX=lerp(-145,-35,smooth(inv(t,16.2,18.8)));
    else s.zneX=-35;
    s.znePhase=t<13.2?'sampling':t<16.2?'extrapolating':t<18.8?'returning':'rest';

    // Independent physical controls.
    s.g=smooth(inv(t,19.2,24.4));
    s.l=smooth(inv(t,24.1,28.6));
    s.m=smooth(inv(t,28.2,31.5));

    s.factorial=selectorAt(t);

    const inter=interactionAt(t);
    s.interaction=inter.value;
    s.control=inter.control;
    s.primary=smooth(inv(t,36.9,39.0));

    // Six known-answer checks. We encode only the established count, not invented magnitudes.
    s.failure=smooth(inv(t,48.4,54.5));
    s.failureHold=smooth(inv(t,52.0,55.0))*(1-smooth(inv(t,56.0,58.0)));
    s.coverage=['excludes','excludes','mixed','mixed','excludes','mixed'];

    // Service panel and proof mechanism.
    s.screws=smooth(inv(t,59.0,59.7));
    s.panel=smooth(inv(t,60.8,63.0));
    s.scan=smooth(inv(t,64.0,70.8));
    s.camReveal=smooth(inv(t,62.5,65.0));
    s.zeroReveal=smooth(inv(t,67.4,70.5));

    // More shots shrink uncertainty at sampled positions, not zero-limit ambiguity.
    s.shotP=smooth(inv(t,71.5,76.8));
    s.shots=Math.round(20000*Math.pow(50,s.shotP));
    s.jaw=lerp(1,.14,s.shotP);

    // Final three-key interlock.
    s.key1=smooth(inv(t,79.0,81.0));
    s.key2=smooth(inv(t,85.3,86.7));
    s.key3=smooth(inv(t,87.0,88.2));
    s.latch=smooth(inv(t,88.2,89.0)); // All three keys have fully seated before release begins.

    return s;
  }

  function phaseOf(t){
    if(t<8) return 'research question';
    if(t<19) return 'zero-noise extrapolation';
    if(t<31.5) return 'independent noise controls';
    if(t<37) return '2³ factorial acquisition';
    if(t<45) return 'interaction diagnostic';
    if(t<58) return 'known-answer check';
    if(t<71.5) return 'constructive non-identifiability';
    if(t<79) return 'precision vs identifiability';
    return 'three-part reliability interlock';
  }

  function readoutOf(s){
    const t=s.t;
    if(t<8) return 'G · L · M independently controllable';
    if(t<19){
      if(s.znePhase==='extrapolating') return 'sampled λ=1,3 · inferring λ=0';
      if(s.znePhase==='returning') return 'zero coordinate inferred · resetting rig';
      return 'deliberately scaling noise';
    }
    if(t<31.5) return `G ${1+2*s.g>2.5?'3×':'1×'} · L ${1+2*s.l>2.5?'3×':'1×'} · M ${1+2*s.m>2.5?'3':'1'}`;
    if(t<37) return `factorial condition ${s.factorial.index} / 8`;
    if(t<41.4) return 'bLM +0.0007 · 95% [−0.0033,+0.0049]';
    if(t<45) return `positive control · recovered ${s.interaction.toFixed(4)}`;
    if(t<58) return 'known ideal coverage · 3 / 6 excluded';
    if(t<71.5) return 'same λM={1,3} · zero limits 1.000 / 0.942';
    if(t<79) return `${s.shots.toLocaleString('en-US')} shots · zero ambiguity unchanged`;
    if(t<83.3) return 'separability engaged · latch still locked';
    if(t<86) return 'model validity engaged · latch still locked';
    return s.latch>.96?'all three engaged · reliable target':'zero calibration engaging';
  }

  window.CRZNEAnatomyModel={stateAt,phaseOf,readoutOf,clamp,inv,smooth,ease,lerp};
})();
