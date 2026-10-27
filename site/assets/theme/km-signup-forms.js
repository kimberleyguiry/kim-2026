/* AJAX signup forms — splits a single "name" field into first/last, submits
   without a page reload, and replaces the form with a success/error message
   once the submission actually completes. Pre-submit validation errors (empty
   name, bad email) leave the form in place so the visitor can fix and retry. */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function parseName(value) {
    var parts = (value || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { first: '', last: '' };
    if (parts.length === 1) return { first: parts[0], last: '' };
    return { first: parts[0], last: parts.slice(1).join(' ') };
  }

  function getCsrf(form) {
    var f = form.querySelector('[name="authenticity_token"]');
    if (f && f.value) return f.value;
    var m = document.querySelector('meta[name="csrf-token"]');
    return m ? m.getAttribute('content') : '';
  }

  function ajaxPost(url, data, csrf) {
    return fetch(url, {
      method: 'POST',
      body: data,
      credentials: 'same-origin',
      redirect: 'manual',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': csrf,
        'Accept': 'text/html, */*; q=0.01'
      }
    }).then(function (r) {
      if (r.type === 'opaqueredirect' || (r.status >= 200 && r.status < 400)) {
        return { ok: true };
      }
      return r.text().then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var errEl = doc.querySelector('.form-errors');
        var msg = errEl ? errEl.textContent.replace(/\s+/g, ' ').trim() : '';
        return { ok: false, msg: msg || 'Something went wrong. Please try again.' };
      });
    });
  }

  document.querySelectorAll('[data-ajax-signup]').forEach(function (form) {
    var nameInput  = form.querySelector('.km-ajax-name');
    var emailInput = form.querySelector('.km-ajax-email');
    var btn        = form.querySelector('[type="submit"]');
    var wrap       = form.parentNode;
    var successEl  = wrap.querySelector('.km-fighting__form-feedback--success');
    var errorEl    = wrap.querySelector('.km-fighting__form-feedback--error');

    function showPreflightError(msg) {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;

      var name  = nameInput  ? nameInput.value.trim()  : '';
      var email = emailInput ? emailInput.value.trim() : '';

      if (!name || !EMAIL_RE.test(email)) {
        showPreflightError('Please enter your name and a valid email address.');
        if (!name && nameInput) nameInput.focus();
        else if (emailInput) emailInput.focus();
        return;
      }

      var names  = parseName(name);
      var csrf   = getCsrf(form);
      var pageId = (form.querySelector('[name="page_id"]') || {}).value || '';
      var action = form.getAttribute('action') || '/forms/signups';
      var data   = new FormData();
      data.append('authenticity_token',   csrf);
      data.append('page_id',              pageId);
      data.append('signup[first_name]',   names.first);
      data.append('signup[last_name]',    names.last);
      data.append('signup[email]',        email);
      data.append('signup[email_opt_in]', '1');

      if (btn) btn.disabled = true;

      ajaxPost(action, data, csrf)
        .then(function (result) {
          form.hidden = true;
          if (result.ok) {
            if (successEl) successEl.hidden = false;
          } else if (errorEl) {
            errorEl.textContent = result.msg;
            errorEl.hidden = false;
          }
        })
        .catch(function () {
          form.hidden = true;
          if (errorEl) {
            errorEl.textContent = 'Something went wrong. Please try again.';
            errorEl.hidden = false;
          }
        });
    });

    [nameInput, emailInput].forEach(function (input) {
      if (!input || !errorEl) return;
      input.addEventListener('input', function () {
        errorEl.hidden = true;
      });
    });
  });
})();
