/* Applies marker classes that used to be handled with :has() selectors.
   :has() isn't supported before Safari 15.4 — this works everywhere and
   the markup it targets comes from NationBuilder (form-check checkboxes,
   the donate page's amount-pill column), so it can't be classed directly
   in a template. */
(function () {
  document.querySelectorAll('.form-check-input.checkbox').forEach(function (input) {
    var wrap = input.closest('.form-check');
    if (wrap) wrap.classList.add('form-check--checkbox');
  });

  var amounts = document.querySelector('.donation-v2-amounts');
  if (amounts) {
    var col = amounts.closest('.form-group.col-md-8');
    if (col) col.classList.add('form-group--donate-amounts');
  }
})();
