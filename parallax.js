/* Gentle ambient depth, with pointer response; no vertical floor drift. */
(()=>{'use strict';
 const arena=document.getElementById('battlefield');
 if(!arena)return;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const layers=[...arena.querySelectorAll('.parallax-layer')];
 let frame=0,phase=0,last=0,pointer=0,target=0,visible=true;
 function paint(offset){
  for(const layer of layers){
   const depth=Number(layer.dataset.depth)||0;
   layer.style.transform=`translate3d(${(-offset*depth).toFixed(2)}px, 0, 0)`;
  }
 }
 function tick(time){
  const dt=last?Math.min((time-last)/1000,.05):0;last=time;
  phase+=dt*Math.PI/9;
  pointer+=(target-pointer)*(1-Math.exp(-dt*5));
  paint(Math.sin(phase)*14+pointer*10);
  frame=requestAnimationFrame(tick);
 }
 function sync(){
  cancelAnimationFrame(frame);frame=0;last=0;
  if(motion.matches){pointer=target=0;paint(0);return;}
  if(!document.hidden&&visible)frame=requestAnimationFrame(tick);
 }
 arena.addEventListener('pointermove',event=>{
  if(event.pointerType==='touch'||motion.matches)return;
  const rect=arena.getBoundingClientRect();
  if(rect.width)target=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
 },{passive:true});
 arena.addEventListener('pointerleave',()=>{target=0},{passive:true});
 document.addEventListener('visibilitychange',sync);
 motion.addEventListener?.('change',sync);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;sync();
 }).observe(arena);
 sync();
})();
