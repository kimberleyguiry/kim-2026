(function () {
  if (!('IntersectionObserver' in window)) return;

  var els = document.querySelectorAll('.km-reveal');
  if (!els.length) return;

  var STAGGER_MS = 120;

  var observer = new IntersectionObserver(
    function (entries) {
      // Entries that become visible together (e.g. all the hero polaroids on
      // initial load) arrive in the same callback batch — stagger them by
      // their position in that batch instead of revealing all at once.
      var i = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = i * STAGGER_MS;
        i += 1;
        observer.unobserve(el);
        setTimeout(function () {
          el.style.setProperty('--km-reveal-shift', '0deg');
          el.classList.remove('km-reveal--pending');
        }, delay);
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
