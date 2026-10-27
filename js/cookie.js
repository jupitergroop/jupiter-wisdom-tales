/* International Cookie Consent Banner (jupiter-wisdom-tales.com) */
(function () {
    'use strict';
    var KEY = 'jg_en_cookie_consent';
    try {
        var existing = localStorage.getItem(KEY);
        if (existing === 'accepted' || existing === 'essential') return;
    } catch (e) {}

    var bar = document.getElementById('cookie-bar');
    if (!bar) return;

    function hideBar(val) {
        try { localStorage.setItem(KEY, val); } catch (e) {}
        bar.classList.remove('is-shown');
        window.setTimeout(function () { bar.hidden = true; }, 350);
    }

    var acceptBtn = bar.querySelector('[data-cookie-accept]');
    var rejectBtn = bar.querySelector('[data-cookie-reject]');

    if (acceptBtn) acceptBtn.addEventListener('click', function () { hideBar('accepted'); });
    if (rejectBtn) rejectBtn.addEventListener('click', function () { hideBar('essential'); });

    window.setTimeout(function () {
        bar.hidden = false;
        void bar.offsetHeight;
        bar.classList.add('is-shown');
    }, 1200);
})();
