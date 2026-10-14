/* Conform the preserved mechanism clock to the actual edited speech.
   Enabled with ?recorded=1. Source recordings are never shipped in this page. */
(()=>{
 if(new URLSearchParams(location.search).get('recorded')!=='1')return;
 const NS='http://www.w3.org/2000/svg',clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 const make=(tag,a={},content='')=>{const e=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));e.textContent=content;return e};
 const add=(p,tag,a,s)=>{const e=make(tag,a,s);p.appendChild(e);return e};
 const notes={
  zne:['THE IDEA',['Measure deliberately','noisier circuits, then','infer the unsampled','zero-noise coordinate.'],'Introduction / schematic'],
  factorial:['THE EXPERIMENT',['Three controls.','Two levels per control.','Eight combinations,','on three IBM circuits.'],'Sec. III / pre-specified design'],
  coverage:['THE RESULT',['For the two probe','observables and GHZ','parity, all five original','95% intervals miss 1.'],'Sec. IV C / known ideal = 1'],
  proof:['THE PROOF',['The added term is zero','at both sampled levels.','At zero it changes','the log response by 3c.'],'Sec. II C / Eq. (7)'],
  precision:['THE LIMIT',['More repeated shots','tighten sampled values.','They do not choose','between these curves.'],'Sec. II C / same settings']
 };
 const footnotes={identity:'Separability does not certify zero-noise extrapolation.',controls:'Independent amplification controls do not imply independent physical noise channels.',interaction:'Primary echoed spectator · one log-scale contrast, not a bound on total error.','positive-control':'Positive control: recovered shifts −0.0104 and −0.0213 for injections −0.010 and −0.020.','service-panel':'A response can be separable over the observed settings and still extrapolate incorrectly.',interpretation:'Zero-knob calibration is separate: unscaled noise can remain at the zero coordinate.'};
 async function start(){
  const plan=await fetch('recording-timeline.json').then(r=>{if(!r.ok)throw Error('Missing recording timeline');return r.json()});
  const stage=document.querySelector('#stage'),root=document.querySelector('#finalFilm');
  const background=make('rect',{id:'recordedBackdrop',width:1920,height:1080,fill:'#f7f5ef'});stage.insertBefore(background,root);
  const panel=add(stage,'g',{id:'recordedNotes'});add(panel,'path',{d:'M1418 322V733',fill:'none',stroke:'#d6d0c6','stroke-width':2});
  const title=add(panel,'text',{x:1455,y:365,class:'recorded-note-title'});
  const lines=Array.from({length:4},(_,i)=>add(panel,'text',{x:1455,y:426+i*42,class:'recorded-note-body'}));
  const reference=add(panel,'text',{x:1455,y:669,class:'recorded-note-ref'});
  const foot=add(stage,'text',{id:'recordedFootnote',x:96,y:965});
  function nominal(t){const a=plan.anchors;if(t<=a[0][0])return a[0][1];for(let i=1;i<a.length;i++){if(t<=a[i][0]){const p=(t-a[i-1][0])/(a[i][0]-a[i-1][0]);return a[i-1][1]+p*(a[i][1]-a[i-1][1])}}return 90}
  const ranges=[[4,16],[31.5,37],[48,56],[60,77.5]];
  function fullAt(t){return Math.max(...ranges.map(([a,b])=>smooth((t-a)/.7)*(1-smooth((t-(b-.7))/.7))))}
  const previous=render;
  render=function(t){t=Math.max(0,Math.min(plan.duration,t));const n=nominal(t);previous(n);const state=CRZNEFinal.stateAt(n),full=fullAt(n),note=notes[state.beat];
   root.setAttribute('transform',`translate(${100*full} ${-25*full}) scale(${1+.1*full})`);
   // Hold annotations until the speaker has fully faded out; no text over a face.
   background.style.opacity=String(full);panel.style.opacity=String(note?smooth((full-.99)/.01):0);
   if(note){title.textContent=note[0];lines.forEach((e,i)=>e.textContent=note[1][i]||'');reference.textContent=note[2]}
   foot.textContent=footnotes[state.beat]||'';foot.style.opacity=String((1-full)*(foot.textContent?1:0));
   document.querySelector('#timeRead').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');
   document.querySelector('#scrub').value=t;document.querySelector('#jump').value=t.toFixed(1);
   stage.dataset.recordedTime=String(t);stage.dataset.nominalTime=String(n);stage.dataset.fullscreen=String(full);
   return {time:t,nominal:n,full,beat:state.beat,speaker:t<plan.handoff?'aryan':'sushanth'};
  };
  document.querySelector('#scrub').max=plan.duration;document.querySelector('#jump').max=plan.duration;
  window.CRZNERecorded={plan,nominal,fullAt,stateAt:t=>({nominal:nominal(t),full:fullAt(nominal(t)),speaker:t<plan.handoff?'aryan':'sushanth'})};
  render(Number(new URLSearchParams(location.search).get('t')||0));window.CRZNERecordedReady=true;
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>start().catch(e=>{window.CRZNERecordedError=e.message;throw e}),{once:true});else start().catch(e=>{window.CRZNERecordedError=e.message;throw e});
})();
