/* Copy corporate details to clipboard (jupiter-wisdom-tales.com) */
(function () {
    document.querySelectorAll('.req-copy').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var value = btn.getAttribute('data-copy');
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(value).then(function () {
                var was = btn.textContent;
                btn.textContent = 'Copied!';
                btn.classList.add('is-done');
                window.setTimeout(function () {
                    btn.textContent = was;
                    btn.classList.remove('is-done');
                }, 1800);
            });
        });
    });
})();
