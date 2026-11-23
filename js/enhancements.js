(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const mobile = matchMedia('(max-width: 991px)');
  let motionOff = reduced.matches;
  let typingTimer;
  const typing = [...document.querySelectorAll('.typing-animation')];
  const roles = ['Data Analyst'];
  let role = 0, letter = 0;
  const cards = [...document.querySelectorAll('.resume-wrap, .ftco-project .project, .showcase-card, .contact-info .box')];

  function type() {
    clearTimeout(typingTimer);
    if (!typing.length) return;
    if (motionOff) { typing.forEach(el => el.textContent = roles[0]); return; }
    const label = roles[role].slice(0, ++letter);
    typing.forEach(el => el.textContent = label);
    if (letter >= roles[role].length) {
      typingTimer = setTimeout(() => { role = (role + 1) % roles.length; letter = 0; type(); }, 1800);
    } else typingTimer = setTimeout(type, 130);
  }
  function applyMotion() {
    document.body.classList.toggle('motion-off', motionOff);
    if (window.jQuery) {
      jQuery.fx.off = motionOff;
      jQuery('.home-slider').trigger(motionOff || mobile.matches ? 'stop.owl.autoplay' : 'play.owl.autoplay');
    }
    type();
  }
  const watch = (query, callback) => query.addEventListener ? query.addEventListener('change', callback) : query.addListener(callback);
  watch(reduced, () => { motionOff = reduced.matches; applyMotion(); });
  watch(mobile, applyMotion);
  applyMotion();

  cards.forEach(card => {
    // Keep the original scroll-reveal animation, then enable the independent tilt.
    card.addEventListener('animationend', () => card.classList.add('depth-ready'), { once: true });
    if (card.classList.contains('ftco-animated') || !card.classList.contains('ftco-animate')) card.classList.add('depth-ready');
    card.addEventListener('pointermove', event => {
      if (motionOff || !fine.matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--tilt-x', `${(-y * 14).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 14).toFixed(2)}deg`);
      card.style.setProperty('--lift', '-8px');
    });
    card.addEventListener('pointerleave', () => {
      ['--tilt-x', '--tilt-y', '--lift'].forEach(key => card.style.removeProperty(key));
    });
  });
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', event => {
    if (motionOff || !fine.matches) return;
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--portrait-x', `${((.5 - (event.clientY - rect.top) / rect.height) * 3).toFixed(2)}deg`);
    hero.style.setProperty('--portrait-y', `${(((event.clientX - rect.left) / rect.width - .5) * 4).toFixed(2)}deg`);
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.removeProperty('--portrait-x'); hero.style.removeProperty('--portrait-y');
  });
  // A native menu avoids lost taps while Bootstrap's collapse transition is running.
  const navigation = document.querySelector('#ftco-nav');
  const menuButton = document.querySelector('[aria-controls="ftco-nav"]');
  function closeMenu() {
    navigation.classList.remove('show', 'collapsing');
    navigation.classList.add('collapse');
    navigation.style.removeProperty('height');
    menuButton.setAttribute('aria-expanded', 'false');
  }
  menuButton.removeAttribute('data-toggle');
  menuButton.addEventListener('click', event => {
    event.stopPropagation();
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('show', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#ftco-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!event.target.closest('#ftco-navbar')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeMenu(); if (navigation.contains(document.activeElement)) menuButton.focus(); }
  });
})();
