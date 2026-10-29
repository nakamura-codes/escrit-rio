/* HELLWARD — Parallax 2.5D; enhancement only, combat logic untouched. */
(()=>{'use strict';
 const arena=document.getElementById('battlefield');
 if(!arena||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const layers=[...arena.querySelectorAll('.parallax-layer')];
 let pending=false, point=[0,0];
 function render(){
   pending=false;
   const [x,y]=point;
   for(const layer of layers){
     const d=Number(layer.dataset.depth)||0;
     const mx = (-x*d*16);
     const my = (-y*d*8);
     layer.style.transform=`translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
   }
 }
 function set(x,y){point=[x,y];if(!pending){pending=true;requestAnimationFrame(render)}}
 arena.addEventListener('pointermove',e=>{
   if(e.pointerType==='touch')return;
   const rect=arena.getBoundingClientRect();
   if(!rect.width||!rect.height)return;
   set(Math.max(-.5,Math.min(.5,(e.clientX-rect.left)/rect.width-.5))*2,
       Math.max(-.5,Math.min(.5,(e.clientY-rect.top)/rect.height-.5))*2);
 },{passive:true});
 arena.addEventListener('pointerleave',()=>set(0,0),{passive:true});
})();
