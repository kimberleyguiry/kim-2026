(function () {
  var titles = document.querySelectorAll('.km-accordion__title');

  function setOpen(item, isOpen) {
    item.classList.toggle('km-accordion__item--open', isOpen);

    var title = item.querySelector('.km-accordion__title');
    if (title) title.setAttribute('aria-expanded', isOpen);

    var icon = item.querySelector('.km-accordion__icon');
    if (icon) {
      icon.classList.toggle('fa-plus', !isOpen);
      icon.classList.toggle('fa-minus', isOpen);
    }
  }

  titles.forEach(function (title) {
    title.addEventListener('click', function () {
      var item = title.closest('.km-accordion__item');
      if (!item) return;

      var isOpen = !item.classList.contains('km-accordion__item--open');

      // .km-accordion--single keeps at most one item open per accordion
      var single = item.closest('.km-accordion--single');
      if (isOpen && single) {
        single.querySelectorAll('.km-accordion__item--open').forEach(function (other) {
          if (other !== item) setOpen(other, false);
        });
      }

      setOpen(item, isOpen);
    });
  });
})();
