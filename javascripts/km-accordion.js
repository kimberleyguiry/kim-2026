(function () {
  var titles = document.querySelectorAll('.km-accordion__title');

  titles.forEach(function (title) {
    title.addEventListener('click', function () {
      var item = title.closest('.km-accordion__item');
      if (!item) return;

      var isOpen = item.classList.toggle('km-accordion__item--open');
      title.setAttribute('aria-expanded', isOpen);

      var icon = title.querySelector('.km-accordion__icon');
      if (icon) {
        icon.classList.toggle('fa-plus', !isOpen);
        icon.classList.toggle('fa-minus', isOpen);
      }
    });
  });
})();
