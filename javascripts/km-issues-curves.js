(function () {
  // The curve's bottom border (its horizontal "right edge") is a 36px-thick
  // strip drawn upward from the box's bottom edge, so its own vertical
  // center sits 18px above wherever the box height points to. Adding that
  // back here is what actually centers the right edge on the heading's
  // line-height instead of leaving it sitting above center.
  var BORDER_THICKNESS = 36;

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
      var headingCenter = headingRect.top + headingRect.height / 2 + BORDER_THICKNESS / 2;

      // Curve is absolute-positioned against the list, so its height is
      // measured from the list's top.
      curve.style.height = (headingCenter - listTop) + 'px';

      // The row's own straight stripe is positioned against the row, so
      // it stops at the same point measured from the row's top instead —
      // the line shouldn't run on past the curve into the rest of the row.
      var stripes = curve.closest('.km-issues-item__stripes');
      if (stripes) {
        var rowTop = item.getBoundingClientRect().top;
        stripes.classList.add('km-issues-item__stripes--curved');
        stripes.style.height = (headingCenter - rowTop) + 'px';
      }
    });
  }

  window.addEventListener('load', positionCurves);
  window.addEventListener('resize', positionCurves);
})();
