(function () {
  var DURATION = 1600;

  // ease-out-expo approximation
  function ease(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function parseCounter(text) {
    text = text.trim();
    var match = text.match(/^([^0-9]*)([0-9][0-9,.]*)([^0-9]*)$/);
    if (!match) return null;
    var raw = match[2].replace(/,/g, '');
    var value = parseFloat(raw);
    if (isNaN(value)) return null;
    return {
      prefix: match[1],
      value: value,
      suffix: match[3],
      useCommas: match[2].indexOf(',') !== -1
    };
  }

  function formatNumber(n, useCommas) {
    var rounded = Math.round(n);
    return useCommas ? rounded.toLocaleString('en-US') : String(rounded);
  }

  function animateCounter(el, parsed) {
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / DURATION, 1);
      var current = parsed.value * ease(progress);
      el.textContent = parsed.prefix + formatNumber(current, parsed.useCommas) + parsed.suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    var els = document.querySelectorAll('.km-counter__number');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var parsed = parseCounter(el.textContent);
        if (parsed) animateCounter(el, parsed);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });
    els.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
