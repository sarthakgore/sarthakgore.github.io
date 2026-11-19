(() => {
  const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
  function closeMenu(){nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();if(document.activeElement?.closest('.nav'))menu?.focus();}});
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;document.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
    const status=document.querySelector('#filter-status');if(status)status.textContent=`${count} project${count===1?'':'s'} shown`;
  }));
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.querySelector('.motion-toggle');
  let motionOff=reduce.matches;
  function setMotion(off){motionOff=off;document.body.classList.toggle('motion-off',off);if(toggle){toggle.textContent=off?'Enable motion':'Pause motion';toggle.setAttribute('aria-pressed',String(off));}}
  setMotion(motionOff);toggle?.addEventListener('click',()=>{setMotion(!motionOff);try{localStorage.setItem('portfolio-motion',motionOff?'off':'on');}catch{}});
  reduce.addEventListener('change',e=>setMotion(e.matches));
  const scene=document.querySelector('.hero-scene'),stack=document.querySelector('.scene-stack');
  scene?.addEventListener('pointermove',e=>{if(motionOff||reduce.matches||e.pointerType!=='mouse'||innerWidth<=800)return;const b=scene.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;stack.style.transform=`rotateY(${x*12-8}deg) rotateX(${-y*10+5}deg) rotateZ(2deg)`;});
  scene?.addEventListener('pointerleave',()=>{stack.style.transform='';});
})();
