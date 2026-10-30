/* UI preferences are independent of game saves. Apply theme before first paint. */
(()=>{'use strict';
 const root=document.documentElement;
 let theme='dark';try{theme=localStorage.getItem('hellward_ui_theme')==='classic'?'classic':'dark'}catch(_){}
 root.dataset.theme=theme;
 document.addEventListener('DOMContentLoaded',()=>{
  const themeButton=document.getElementById('themeToggle');
  const focusButton=document.getElementById('focusBattle');
  function updateTheme(){
   const dark=root.dataset.theme==='dark';
   themeButton.setAttribute('aria-pressed',String(dark));
   themeButton.textContent=dark?'☾ Escuro':'☀ Clássico';
   document.querySelector('meta[name="theme-color"]').content=dark?'#090c11':'#15120f';
  }
  themeButton.addEventListener('click',()=>{
   root.dataset.theme=root.dataset.theme==='dark'?'classic':'dark';
   try{localStorage.setItem('hellward_ui_theme',root.dataset.theme)}catch(_){}
   updateTheme();
  });updateTheme();
  focusButton.addEventListener('click',()=>{
   const focused=root.dataset.focus!=='battle';root.dataset.focus=focused?'battle':'normal';
   focusButton.setAttribute('aria-pressed',String(focused));focusButton.textContent=focused?'Sair do foco':'Focar batalha';
  });
  const values=[...document.querySelectorAll('.stat-tile strong,.resource-pill strong,.intel-chance strong,#heroHPText,#heroRegeneration,#xpLabel')];
  const base=new WeakMap();let frame=0;
  const measure=document.createElement('canvas').getContext('2d');
  function fit(){frame=0;for(const el of values){
   if(!el.clientWidth)continue;
   const style=getComputedStyle(el);
   const max=base.get(el)||parseFloat(style.fontSize);base.set(el,max);
   measure.font=`${style.fontWeight} ${max}px ${style.fontFamily}`;
   const width=measure.measureText(el.textContent).width;
   const size=width?Math.min(max,(el.clientWidth-2)/width*max):max;
   el.style.fontSize=`${Math.max(1,Math.floor(size*10)/10)}px`;
  }}
  function schedule(){if(!frame)frame=requestAnimationFrame(fit)}
  const resize=new ResizeObserver(schedule);values.forEach(el=>resize.observe(el));
  const mutations=new MutationObserver(fit);values.forEach(el=>mutations.observe(el,{childList:true,characterData:true,subtree:true}));
  document.fonts?.ready.then(schedule);schedule();
 });
})();
