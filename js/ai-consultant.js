/* Interactive Edition Advisor Widget for jupiter-wisdom-tales.com
 * Publisher: Limited Liability Company "Jupiter Group" (Jupiter Group LLC, Kyrgyz Republic)
 */
(function () {
    'use strict';

    if (document.getElementById('jg-ai-fab')) return;

    var DEFAULT_FACTS = {
        "site": "jupiter-wisdom-tales.com",
        "label": "Jupiter Wisdom Tales",
        "speaker": "Zinaida Jupiter, Author of the Series, Doctor of Business Administration (DBA)",
        "phone": "+996 (3222) 5-44-08",
        "phone_href": "tel:+996322254408",
        "email": "info@jupiter-wisdom-tales.com",
        "sla": "Our international publishing team at Jupiter Group LLC will send your catalog, sample PDFs, and invoice within 1 business hour.",
        "disclosure": "International Publishing Desk, Limited Liability Company 'Jupiter Group'. Helping families, leaders, and institutions select the right edition.",
        "quick_topics": [
            {
                "id": "strategy_and_skills",
                "label": "Strategy (Where to Walk) & Skills (How to Walk)",
                "answer": "Building skills helps a person walk the path with confidence, while strategy answers the most important question: where to walk. That is what we do through classic folk tales and centuries-old human wisdom: helping children and adults see where each path leads before taking the first step."
            },
            {
                "id": "two_editions",
                "label": "Two Editions of Each Book (6+ & 12+)",
                "answer": "Every book in our growing collection is published in two standalone editions: 1) Family Edition (Ages 6+): 5 illustrated story scenes, 3 evening conversation questions, the 'Three Roads' choice game, and a creative drawing page ($14.99 Digital / $29.99 Hardcover). 2) Adult & Leadership Edition (Ages 12+): the complete story plus practical life advice, negotiation tools, and real-world case scenarios."
            },
            {
                "id": "golden_tome",
                "label": "Collector's 'Golden Tome' Hardcover ($149)",
                "answer": "The Collector's 'Golden Tome' (84 to 108 pages + ornamental endpapers, $149.00 USD) unites selected tales in an heirloom binding: cloth spine, 3D relief gold foil stamping, 157 gsm warm parchment-toned paper, and a woven silk ribbon bookmark."
            },
            {
                "id": "quiz_start",
                "label": "Select an Edition or Corporate Print Run",
                "answer": "QUIZ_TRIGGER"
            }
        ],
        "quiz_steps": {
            "step1_title": "Step 1 of 3. What is your primary goal for the series?",
            "step1_options": [
                "Evening family read-aloud with children (Family Edition 6+)",
                "Practical life advice, leadership & negotiation tools (Adult Edition 12+)",
                "Collector's 'Golden Tome' Hardcover as a VIP or family gift",
                "Custom corporate or diplomatic print run with company Ex-Libris"
            ],
            "step2_title": "Step 2 of 3. Which package format would you like to order?",
            "step2_options": [
                "Single Digital or Hardcover Volumes ($14.99 to $29.99 USD)",
                "Complete 16-Book Library: All 32 Volumes ($249 Digital / $449 Print)",
                "Collector's 'Golden Tome' Hardcover Folio ($149.00 USD)",
                "Bespoke Corporate Gift Edition (50+ copies, from $2,950 USD)"
            ]
        }
    };

    function createWidget(facts) {
        var fab = document.createElement('button');
        fab.type = 'button';
        fab.id = 'jg-ai-fab';
        fab.className = 'jg-ai-fab';
        fab.setAttribute('aria-label', 'Open Book & Edition Advisor');
        fab.innerHTML = '<span class="jg-ai-fab__dot" aria-hidden="true"></span><span>Edition &amp; Order Advisor</span>';

        var drawer = document.createElement('section');
        drawer.id = 'jg-ai-drawer';
        drawer.className = 'jg-ai-drawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-label', 'Jupiter Wisdom Tales Edition Advisor');
        drawer.hidden = true;

        drawer.innerHTML = [
            '<div class="jg-ai-head">',
            '  <div>',
            '    <p class="jg-ai-head__title">Jupiter Wisdom Tales Advisor</p>',
            '    <p class="jg-ai-head__sub">' + facts.disclosure + '</p>',
            '  </div>',
            '  <button type="button" class="jg-ai-close" aria-label="Close advisor">&times;</button>',
            '</div>',
            '<div class="jg-ai-body" id="jg-ai-body">',
            '  <div class="jg-ai-msg">Welcome! I can help you select the right edition of <b>' + facts.label + '</b> (in English, or our official Russian and Mandarin Chinese translations), check USD pricing, or arrange an international order.</div>',
            '  <div class="jg-ai-chips" id="jg-ai-chips"></div>',
            '  <div id="jg-ai-quiz-slot"></div>',
            '</div>',
            '<div class="jg-ai-foot">',
            '  <span>Editorial Desk: <a href="' + facts.phone_href + '">' + facts.phone + '</a></span>',
            '  <a href="mailto:' + facts.email + '">' + facts.email + '</a>',
            '</div>'
        ].join('\n');

        document.body.appendChild(fab);
        document.body.appendChild(drawer);

        var bodyEl = drawer.querySelector('#jg-ai-body');
        var chipsEl = drawer.querySelector('#jg-ai-chips');
        var quizSlot = drawer.querySelector('#jg-ai-quiz-slot');
        var closeBtn = drawer.querySelector('.jg-ai-close');
        var quizState = { step1: '', step2: '' };

        function appendMessage(text, isUser) {
            var div = document.createElement('div');
            div.className = 'jg-ai-msg' + (isUser ? ' jg-ai-msg--user' : '');
            div.textContent = text;
            bodyEl.insertBefore(div, quizSlot);
            bodyEl.scrollTop = bodyEl.scrollHeight;
        }

        function renderQuizStep1() {
            quizSlot.innerHTML = '';
            var box = document.createElement('div');
            box.className = 'jg-ai-quiz-box';
            var title = document.createElement('strong');
            title.style.fontSize = '13px';
            title.textContent = facts.quiz_steps.step1_title;
            box.appendChild(title);

            facts.quiz_steps.step1_options.forEach(function (opt) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'jg-ai-chip';
                btn.textContent = opt;
                btn.addEventListener('click', function () {
                    quizState.step1 = opt;
                    renderQuizStep2();
                });
                box.appendChild(btn);
            });
            quizSlot.appendChild(box);
            bodyEl.scrollTop = bodyEl.scrollHeight;
        }

        function renderQuizStep2() {
            quizSlot.innerHTML = '';
            var box = document.createElement('div');
            box.className = 'jg-ai-quiz-box';
            var title = document.createElement('strong');
            title.style.fontSize = '13px';
            title.textContent = facts.quiz_steps.step2_title;
            box.appendChild(title);

            facts.quiz_steps.step2_options.forEach(function (opt) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'jg-ai-chip';
                btn.textContent = opt;
                btn.addEventListener('click', function () {
                    quizState.step2 = opt;
                    renderQuizStep3Form();
                });
                box.appendChild(btn);
            });
            quizSlot.appendChild(box);
            bodyEl.scrollTop = bodyEl.scrollHeight;
        }

        function renderQuizStep3Form() {
            quizSlot.innerHTML = '';
            var box = document.createElement('form');
            box.className = 'jg-ai-quiz-box';
            box.innerHTML = [
                '<strong style="font-size:13px;">Step 3 of 3. Where should we send the catalog, PDF samples &amp; invoice?</strong>',
                '<input type="text" name="name" placeholder="Your Full Name *" required minlength="2">',
                '<input type="email" name="email" placeholder="Work or Personal E-mail *" required>',
                '<input type="tel" name="phone" inputmode="tel" placeholder="Phone / WhatsApp (with country code) *" required>',
                '<select name="channel" aria-label="Preferred contact channel">',
                '  <option value="email">E-mail (Invoice &amp; Catalog)</option>',
                '  <option value="whatsapp">WhatsApp Business</option>',
                '  <option value="telegram">Telegram</option>',
                '  <option value="phone">International Phone Call</option>',
                '</select>',
                '<label class="jg-ai-consent"><input type="checkbox" name="pd" required><span>I agree to the <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a> of Limited Liability Company "Jupiter Group" (Jupiter Group LLC).</span></label>',
                '<label class="jg-ai-consent"><input type="checkbox" name="oferta" required><span>I accept the <a href="terms.html" target="_blank" rel="noopener">Terms &amp; Conditions of Sale</a>.</span></label>',
                '<button type="submit" class="jg-ai-submit">Request Catalog &amp; Order Terms</button>',
                '<div class="jg-ai-status" style="font-size:12px;"></div>'
            ].join('\n');

            box.addEventListener('submit', function (e) {
                e.preventDefault();
                var pdVal = box.querySelector('[name="pd"]').checked;
                var ofertaVal = box.querySelector('[name="oferta"]').checked;
                var statusEl = box.querySelector('.jg-ai-status');
                if (!pdVal || !ofertaVal) {
                    statusEl.style.color = '#DC2626';
                    statusEl.textContent = 'Please check both consent boxes to submit.';
                    return;
                }
                quizSlot.innerHTML = '<div class="jg-ai-msg" style="border-color:#22C55E;background:#F0FDF4;color:#14532D;"><b>Inquiry received by Jupiter Group LLC!</b><br>' + facts.sla + '</div>';
            });

            quizSlot.appendChild(box);
            bodyEl.scrollTop = bodyEl.scrollHeight;
        }

        facts.quick_topics.forEach(function (topic) {
            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'jg-ai-chip';
            chip.textContent = topic.label;
            chip.addEventListener('click', function () {
                appendMessage(topic.label, true);
                if (topic.answer === 'QUIZ_TRIGGER') {
                    renderQuizStep1();
                } else {
                    appendMessage(topic.answer, false);
                    renderQuizStep1();
                }
            });
            chipsEl.appendChild(chip);
        });

        fab.addEventListener('click', function () {
            drawer.hidden = !drawer.hidden;
        });

        closeBtn.addEventListener('click', function () {
            drawer.hidden = true;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            createWidget(DEFAULT_FACTS);
        });
    } else {
        createWidget(DEFAULT_FACTS);
    }
})();
