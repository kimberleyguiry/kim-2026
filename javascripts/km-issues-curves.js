(function () {
  function positionCurves() {
    var list = document.querySelector('.km-issues-list');
    if (!list) return;

    var listTop = list.getBoundingClientRect().top;

    var curves = list.querySelectorAll('.km-issues-item__curve');
    curves.forEach(function (curve) {
      var item = curve.closest('.km-issues-item');
      var heading = item && item.querySelector('.km-issues-item__heading');
      if (!heading) return;

      var headingRect = heading.getBoundingClientRect();
      var reach = (headingRect.top + headingRect.height / 2) - listTop;
      curve.style.height = reach + 'px';

      if (item.classList.contains('km-issues-item--terminal')) {
        var stripes = item.querySelector('.km-issues-item__stripes');
        if (stripes) stripes.style.height = reach + 'px';
      }
    });
  }

  window.addEventListener('load', positionCurves);
  window.addEventListener('resize', positionCurves);
})();
