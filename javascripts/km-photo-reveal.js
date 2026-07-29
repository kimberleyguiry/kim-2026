(function () {
  if (!('IntersectionObserver' in window)) return;

  var els = document.querySelectorAll('.km-reveal');
  if (!els.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.setProperty('--km-reveal-shift', '0deg');
        el.classList.remove('km-reveal--pending');
        observer.unobserve(el);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );

  els.forEach(function (el) {
    var sign = Math.random() < 0.5 ? -1 : 1;
    var magnitude = 8 + Math.random() * 6;
    el.style.setProperty('--km-reveal-shift', sign * magnitude + 'deg');
    el.classList.add('km-reveal--pending');
  });

  // Force the browser to paint the pending (hidden) state before observing.
  // Elements already in the viewport (e.g. the hero polaroids) otherwise get
  // their "intersecting" callback on the very next microtask, collapsing the
  // hidden -> visible change into a single frame so the transition never
  // actually plays.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      els.forEach(function (el) {
        observer.observe(el);
      });
    });
  });
})();
