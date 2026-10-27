/* International UTM Attribution & Order Helper (jupiter-wisdom-tales.com) */
(function () {
    'use strict';

    var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'];
    var STORAGE_FIRST = 'jg_en_utm_first_v1';
    var STORAGE_LAST = 'jg_en_utm_last_v1';

    function parseQueryUtm() {
        var params = new URLSearchParams(window.location.search);
        var found = {};
        var hasAny = false;
        UTM_KEYS.forEach(function (k) {
            var v = params.get(k);
            if (v) {
                found[k] = v.slice(0, 120);
                hasAny = true;
            }
        });
        return hasAny ? found : null;
    }

    function saveUtm() {
        try {
            var current = parseQueryUtm();
            if (current) {
                current._ts = Date.now();
                localStorage.setItem(STORAGE_LAST, JSON.stringify(current));
                if (!localStorage.getItem(STORAGE_FIRST)) {
                    localStorage.setItem(STORAGE_FIRST, JSON.stringify(current));
                }
            }
        } catch (e) {}
    }

    function getCollectedUtm() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_LAST) || '{}');
        } catch (e) {
            return {};
        }
    }

    function makeReqId() {
        if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
        return 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    }

    saveUtm();
    window.jgLeadHelper = {
        getUtm: getCollectedUtm,
        makeReqId: makeReqId
    };
})();
