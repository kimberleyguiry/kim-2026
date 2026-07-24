(function () {
  var toggle = document.querySelector('.km-hamburger');
  var panel = document.getElementById('km-mobile-nav');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', function () {
    var isOpen = panel.classList.toggle('km-mobile-nav--open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('km-nav-open', isOpen);
  });

  var closeBtn = panel.querySelector('.km-mobile-nav__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      panel.classList.remove('km-mobile-nav--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('km-nav-open');
    });
  }
})();
