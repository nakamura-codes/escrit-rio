/* HD parallax: small horizontal depth offsets preserve the floor perspective. */
(()=>{'use strict';
 const arena=document.getElementById('battlefield');
 if(!arena)return;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const layers=[...arena.querySelectorAll('.parallax-layer')];
 let frame=0,point=0;
 function render(){
  frame=0;
  for(const layer of layers){
   const depth=Number(layer.dataset.depth)||0;
   layer.style.transform=`translate3d(${(-point*depth*12).toFixed(2)}px, 0, 0)`;
  }
 }
 function set(value){point=motion.matches?0:value;if(!frame)frame=requestAnimationFrame(render);}
 arena.addEventListener('pointermove',event=>{
  if(event.pointerType==='touch'||motion.matches)return;
  const rect=arena.getBoundingClientRect();
  if(rect.width)set(Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1)));
 },{passive:true});
 arena.addEventListener('pointerleave',()=>set(0),{passive:true});
 motion.addEventListener?.('change',()=>set(0));
})();
