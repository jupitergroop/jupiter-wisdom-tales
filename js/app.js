/* Interactive Core of Jupiter Wisdom Tales (jupiter-wisdom-tales.com)
 * Author: Zinaida Jupiter, DBA
 * Publisher: Limited Liability Company "Jupiter Group" (Jupiter Group LLC, Kyrgyz Republic)
 */
(function () {
  'use strict';

  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'];
  var books = window.JUPITER_BOOKS_DATA || [];
  var currentCatalogMode = 'fam'; // 'fam' (6+) or 'mgmt' (12+)
  var currentSearch = '';
  var activeBookNum = 1;
  var activeTab = 'matrix'; // 'story' | 'kids' | 'matrix'
  var activeSceneIdx = 0;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDropCap(text) {
    var t = String(text || '').trim();
    if (!t) return '';
    return '<span class="drop-cap">' + escapeHtml(t.charAt(0)) + '</span>' + escapeHtml(t.slice(1));
  }

  function getBookByNum(num) {
    for (var i = 0; i < books.length; i++) {
      if (books[i].num === Number(num)) return books[i];
    }
    return books[0] || null;
  }

  /* 1. Render 16-Book Catalog */
  function renderCatalog() {
    var grid = document.getElementById('books-grid');
    if (!grid) return;

    var q = currentSearch.trim().toLowerCase();
    var filtered = books.filter(function (b) {
      if (!q) return true;
      var hay = (b.title_en + ' ' + b.subtitle_en + ' ' + b.key_kids + ' ' + b.key_adults).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (!filtered.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;padding:32px;text-align:center;background:var(--bg-card);border:1.5px solid var(--border-ornate);border-radius:12px;">No books matched your search query. Please clear the search filter to view all 16 volumes.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (b) {
      var roman = ROMAN[b.num - 1] || b.num;
      var isMgmt = currentCatalogMode === 'mgmt';
      var coverSrc = isMgmt ? b.cover_mgmt : b.cover_fam;
      var ageTag = isMgmt ? '12+ • 2×2 Matrix' : '6+ • Family';
      var keyLabel = isMgmt ? 'Executive Key (2×2 Decision Matrix):' : 'Children & Family Key (Ages 6+):';
      var keyText = isMgmt ? b.key_adults : b.key_kids;

      return [
        '<article class="book-card" data-book-num="' + b.num + '">',
        '  <div class="book-card__cover-wrap" data-open-reader="' + b.num + '" title="Open interactive reader & 2×2 Matrix for Book ' + roman + ': ' + escapeHtml(b.title_en) + '">',
        '    <span class="book-card__issue-pill">Book ' + roman + '</span>',
        '    <span class="book-card__age-pill">' + ageTag + '</span>',
        '    <img src="' + escapeHtml(coverSrc) + '" alt="Cover of ' + escapeHtml(b.title_en) + ' — By Zinaida Jupiter, DBA" width="360" height="540" loading="lazy">',
        '  </div>',
        '  <div class="book-card__body">',
        '    <h3 class="book-card__title">' + escapeHtml(b.title_en) + '</h3>',
        '    <div class="book-card__en">' + escapeHtml(b.subtitle_en) + '</div>',
        '    <div style="font-size:12.5px;font-weight:700;color:var(--cinnabar);margin:4px 0 8px;">Digital eBook: ' + escapeHtml(b.price_digital_usd) + ' USD · Hardcover: ' + escapeHtml(b.price_print_usd) + ' USD</div>',
        '    <div class="book-card__key"><strong>' + keyLabel + '</strong><br>' + escapeHtml(keyText) + '</div>',
        '    <div class="book-card__actions">',
        '      <button type="button" class="btn btn--primary btn--sm" data-open-reader="' + b.num + '">Read Online &amp; 2×2 Matrix</button>',
        '      <div class="book-card__pdf-links">',
        '        <a href="' + escapeHtml(b.pdf_fam) + '" target="_blank" rel="noopener">PDF 6+ (Family)</a>',
        '        <a href="' + escapeHtml(b.pdf_mgmt) + '" target="_blank" rel="noopener">PDF 12+ (Executive)</a>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('\n');
    }).join('\n');
  }

  /* 2. Build Interactive Book Explorer HTML */
  function buildBookExplorerHtml(b, tab, sceneIdx) {
    if (!b) return '';
    var roman = ROMAN[b.num - 1] || b.num;
    var scenes = b.scenes || [];
    var sIdx = Math.max(0, Math.min(sceneIdx || 0, scenes.length - 1));
    var currentScene = scenes[sIdx] || { scene: 1, aphorism: '', text: '', img: b.cover_fam };

    var headerHtml = [
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid var(--gold-deep);">',
      '  <div>',
      '    <div style="font-size:12px;font-weight:700;color:var(--cinnabar);letter-spacing:1.2px;text-transform:uppercase;">Book ' + roman + ' of XVI • Jupiter Wisdom Tales Series (EN / RU / ZH)</div>',
      '    <h3 style="font-family:var(--font-serif);font-size:26px;margin:4px 0;color:var(--bg-walnut);">“' + escapeHtml(b.title_en) + '”</h3>',
      '    <div style="font-size:14px;color:var(--ink-secondary);">' + escapeHtml(b.subtitle_en) + ' • ISBN ' + escapeHtml(b.isbn_fam) + '</div>',
      '  </div>',
      '  <div style="display:flex;flex-wrap:wrap;gap:8px;">',
      '    <a href="' + escapeHtml(b.pdf_fam) + '" target="_blank" rel="noopener" class="btn btn--outline btn--sm">Download PDF 6+ (Family)</a>',
      '    <a href="' + escapeHtml(b.pdf_mgmt) + '" target="_blank" rel="noopener" class="btn btn--gold btn--sm">Download PDF 12+ (2×2 Matrix)</a>',
      '  </div>',
      '</div>'
    ].join('\n');

    var tabsHtml = [
      '<div class="workbench-tabs" role="tablist">',
      '  <button type="button" class="workbench-tab ' + (tab === 'matrix' ? 'is-active' : '') + '" data-wb-tab="matrix">1. Two-Axis Breakdown &amp; 2×2 Matrix (12+)</button>',
      '  <button type="button" class="workbench-tab ' + (tab === 'kids' ? 'is-active' : '') + '" data-wb-tab="kids">2. Child Conversation &amp; “Three Roads” Game (6+)</button>',
      '  <button type="button" class="workbench-tab ' + (tab === 'story' ? 'is-active' : '') + '" data-wb-tab="story">3. Full Story &amp; 5 Illustrations</button>',
      '</div>'
    ].join('\n');

    var bodyHtml = '';

    if (tab === 'story') {
      var navBtns = scenes.map(function (sc, idx) {
        return '<button type="button" class="scene-btn ' + (idx === sIdx ? 'is-active' : '') + '" data-scene-idx="' + idx + '">Scene ' + (idx + 1) + ' of ' + scenes.length + '</button>';
      }).join('');

      bodyHtml = [
        '<div style="background:var(--gold-soft);border-left:4px solid var(--cinnabar);padding:14px 18px;border-radius:8px;margin-bottom:20px;font-size:14.5px;">',
        '  <strong>Author’s Note to the Reader:</strong> ' + escapeHtml(b.preface_en),
        '</div>',
        '<div class="story-scene-nav">' + navBtns + '</div>',
        '<div class="story-reader-grid">',
        '  <div class="plate-frame-web">',
        '    <img src="' + escapeHtml(currentScene.img) + '" alt="Illustration for ' + escapeHtml(b.title_en) + ', Scene ' + (sIdx + 1) + '">',
        '    <div class="plate-caption-web">' + escapeHtml(currentScene.aphorism) + '</div>',
        '  </div>',
        '  <div>',
        '    <div class="folio-story-box">',
        '      <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:var(--cinnabar);text-transform:uppercase;margin-bottom:10px;">' + escapeHtml(currentScene.heading || ('Scene ' + (sIdx + 1))) + '</div>',
        '      <p style="margin:0 0 18px;">' + formatDropCap(currentScene.text) + '</p>',
        '      <div style="clear:both;padding-top:14px;border-top:1px dashed var(--border-ornate);font-size:14px;color:var(--ink-secondary);">',
        '        <strong>Proverb of the Tale:</strong> <em>' + escapeHtml(b.story_secret) + '</em>',
        '      </div>',
        '    </div>',
        '    <div style="display:flex;justify-content:space-between;margin-top:14px;">',
        '      <button type="button" class="btn btn--outline btn--sm" data-scene-idx="' + Math.max(0, sIdx - 1) + '" ' + (sIdx === 0 ? 'disabled' : '') + '>← Previous Scene</button>',
        '      <button type="button" class="btn btn--primary btn--sm" data-scene-idx="' + Math.min(scenes.length - 1, sIdx + 1) + '" ' + (sIdx >= scenes.length - 1 ? 'disabled' : '') + '>Next Scene →</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
    } else if (tab === 'kids') {
      var questionsList = (b.kids_questions || []).map(function (qText) {
        return '<li style="padding:10px 14px;background:var(--bg-parchment);border-left:3.5px solid var(--gold-deep);border-radius:6px;margin-bottom:8px;">' + escapeHtml(qText) + '</li>';
      }).join('');

      var road = b.three_roads || {};

      bodyHtml = [
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-bottom:24px;" class="editions-grid">',
        '  <div style="background:var(--bg-parchment);border:1.5px solid var(--gold-deep);border-radius:12px;padding:20px;">',
        '    <div style="font-size:12px;font-weight:700;color:var(--cinnabar);text-transform:uppercase;margin-bottom:6px;">Core Moral for Children (Ages 6+)</div>',
        '    <p style="font-family:var(--font-serif);font-size:16.5px;margin:0 0 14px;color:var(--bg-walnut);">' + escapeHtml(b.story_secret) + '</p>',
        '    <div style="background:var(--gold-soft);border:1px solid var(--gold-deep);padding:12px 14px;border-radius:8px;font-size:14px;">',
        '      <strong>Golden Rule of Friendship:</strong><br><em>“' + escapeHtml((b.magic_words || [])[0] || '') + '”</em>',
        '    </div>',
        '  </div>',
        '  <div style="background:var(--bg-parchment);border:1.5px solid var(--border-ornate);border-radius:12px;padding:20px;">',
        '    <div style="font-size:12px;font-weight:700;color:var(--cinnabar);text-transform:uppercase;margin-bottom:8px;">Three Questions for Evening Family Conversation</div>',
        '    <ul style="list-style:none;padding:0;margin:0;font-size:14px;">' + questionsList + '</ul>',
        '  </div>',
        '</div>',
        '<div style="background:var(--bg-parchment-alt);border:2px solid var(--gold-deep);border-radius:12px;padding:22px;margin-bottom:22px;">',
        '  <div style="font-size:12px;font-weight:700;color:var(--cinnabar);text-transform:uppercase;margin-bottom:4px;">Interactive Choice Game: “Three Roads” (Click an option to test)</div>',
        '  <h4 style="font-family:var(--font-serif);font-size:18px;margin:0 0 12px;color:var(--bg-walnut);">' + escapeHtml(road.situation || 'How will the wise hero act?') + '</h4>',
        '  <div class="roads-options">',
        '    <button type="button" class="road-btn" data-road-choice="wrong"><strong>Road A:</strong><br>' + escapeHtml(road.option_a || '') + '</button>',
        '    <button type="button" class="road-btn" data-road-choice="wrong"><strong>Road B:</strong><br>' + escapeHtml(road.option_b || '') + '</button>',
        '    <button type="button" class="road-btn" data-road-choice="correct"><strong>★ Road C (The Wise Choice):</strong><br>' + escapeHtml(road.option_c_win || '') + '</button>',
        '  </div>',
        '  <div class="road-feedback" style="margin-top:12px;font-size:14px;font-weight:600;min-height:22px;"></div>',
        '</div>',
        '<div style="background:var(--bg-parchment);border:2px dashed var(--gold-deep);border-radius:12px;padding:18px 22px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;">',
        '  <div><strong>Creative Drawing Activity:</strong> ' + escapeHtml(b.drawing_prompt) + '</div>',
        '  <div style="font-size:13px;color:var(--cinnabar);font-weight:700;">Evening Family Habit: ' + escapeHtml(b.habit_24h || '') + '</div>',
        '</div>'
      ].join('\n');
    } else {
      var mat = b.matrix_2x2 || {};
      var kv = mat.quadrants || {};
      var q1 = kv.q1_bottom_left || {};
      var q2 = kv.q2_top_left || {};
      var q3 = kv.q3_bottom_right || {};
      var q4 = kv.q4_top_right_win || {};
      var osY = mat.axis_y || {};
      var osX = mat.axis_x || {};

      var rulesHtml = (mat.three_rules || []).map(function (r) {
        return '<li style="padding:10px 14px;background:var(--bg-parchment);border-left:4px solid var(--cinnabar);border-radius:6px;">' + escapeHtml(r) + '</li>';
      }).join('');

      var rowsHtml = (mat.situations_table || []).map(function (row) {
        return [
          '<tr>',
          '  <td><strong>' + escapeHtml(row.situation) + '</strong></td>',
          '  <td style="color:#991B1B;">' + escapeHtml(row.losing_response) + '</td>',
          '  <td class="win-col">★ ' + escapeHtml(row.winning_quadrant_4) + '</td>',
          '</tr>'
        ].join('');
      }).join('');

      var vocabHtml = (mat.winged_vocab || []).map(function (v) {
        return '<div style="background:var(--bg-parchment);border:1px solid var(--border-ornate);border-radius:8px;padding:10px 14px;font-size:13.8px;">' + escapeHtml(v) + '</div>';
      }).join('');

      bodyHtml = [
        '<div style="background:var(--gold-soft);border:1.5px solid var(--gold-deep);border-radius:10px;padding:16px 20px;margin-bottom:18px;">',
        '  <div style="font-size:12px;font-weight:700;color:var(--cinnabar);text-transform:uppercase;margin-bottom:4px;">Core Strategic &amp; Negotiation Insight (★ Quadrant 4)</div>',
        '  <div style="font-family:var(--font-serif);font-size:17px;color:var(--bg-walnut);font-weight:700;">' + escapeHtml(mat.paradox) + '</div>',
        '</div>',
        '<div class="matrix-2x2-layout">',
        '  <div class="matrix-axis-y">' + escapeHtml(osY.low || 'Low ↓') + ' • ' + escapeHtml(osY.title || 'AXIS Y') + ' • ' + escapeHtml(osY.high || 'High ↑') + '</div>',
        '  <div class="matrix-grid-cells">',
        '    <div class="matrix-cell matrix-cell--q2">',
        '      <span class="matrix-cell__badge">Upper-Left Corner (Axis Y+, Axis X−)</span>',
        '      <h4>' + escapeHtml(q2.title || 'Quadrant 2') + '</h4>',
        '      <p>' + escapeHtml(q2.body || '') + '</p>',
        '    </div>',
        '    <div class="matrix-cell matrix-cell--q4">',
        '      <span class="matrix-cell__badge">★ WINNING CHOICE — TOP-RIGHT CORNER (Axis Y+, Axis X+)</span>',
        '      <h4>' + escapeHtml(q4.title || '★ Quadrant 4') + '</h4>',
        '      <p>' + escapeHtml(q4.body || '') + '</p>',
        '    </div>',
        '    <div class="matrix-cell matrix-cell--q1">',
        '      <span class="matrix-cell__badge">Lower-Left Corner (Axis Y−, Axis X−)</span>',
        '      <h4>' + escapeHtml(q1.title || 'Quadrant 1') + '</h4>',
        '      <p>' + escapeHtml(q1.body || '') + '</p>',
        '    </div>',
        '    <div class="matrix-cell matrix-cell--q3">',
        '      <span class="matrix-cell__badge">Lower-Right Corner (Axis Y−, Axis X+)</span>',
        '      <h4>' + escapeHtml(q3.title || 'Quadrant 3') + '</h4>',
        '      <p>' + escapeHtml(q3.body || '') + '</p>',
        '    </div>',
        '  </div>',
        '</div>',
        '<div class="matrix-axis-x">',
        '  <span>' + escapeHtml(osX.left || '◄ Low') + '</span>',
        '  <span>' + escapeHtml(osX.title || 'AXIS X') + '</span>',
        '  <span>' + escapeHtml(osX.right || 'High ►') + '</span>',
        '</div>',
        '<div style="margin-top:24px;" class="editions-grid">',
        '  <div>',
        '    <h4 style="font-family:var(--font-serif);font-size:18px;margin:0 0 10px;color:var(--bg-walnut);">Diagnostic Traps &amp; Path to the Top-Right Quadrant:</h4>',
        '    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;font-size:14px;">' + rulesHtml + '</ul>',
        '  </div>',
        '  <div>',
        '    <h4 style="font-family:var(--font-serif);font-size:18px;margin:0 0 10px;color:var(--bg-walnut);">Executive Idioms &amp; Boardroom Vocabulary:</h4>',
        '    <div style="display:flex;flex-direction:column;gap:8px;">' + vocabHtml + '</div>',
        '  </div>',
        '</div>',
        '<h4 style="font-family:var(--font-serif);font-size:18px;margin:24px 0 8px;color:var(--bg-walnut);">Real-World Application (Losing Reaction → ★ Quadrant 4 Winning Move):</h4>',
        '<div style="overflow-x:auto;">',
        '  <table class="situations-table">',
        '    <thead><tr><th>Family or Executive Situation</th><th>Losing Reaction (Quadrants 1–3)</th><th>★ Top-Right Corner (Quadrant 4)</th></tr></thead>',
        '    <tbody>' + rowsHtml + '</tbody>',
        '  </table>',
        '</div>',
        '<div style="margin-top:18px;padding:14px 18px;background:var(--bg-parchment-alt);border-radius:8px;font-size:13.5px;color:var(--ink-secondary);display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;">',
        '  <span><strong>World Literature Parallel:</strong> ' + escapeHtml(b.cultural_bridge || '') + '</span>',
        '  <span><strong>International Contract Culture:</strong> ' + escapeHtml(b.contract_culture || '') + '</span>',
        '</div>'
      ].join('\n');
    }

    return headerHtml + tabsHtml + bodyHtml;
  }

  /* 3. Render Interactive Workbench */
  function renderWorkbench() {
    var pillsEl = document.getElementById('workbench-pills');
    var contentEl = document.getElementById('workbench-content');
    if (!pillsEl || !contentEl) return;

    pillsEl.innerHTML = books.map(function (b) {
      var roman = ROMAN[b.num - 1] || b.num;
      var cls = b.num === activeBookNum ? 'workbench-pill is-active' : 'workbench-pill';
      return '<button type="button" class="' + cls + '" data-wb-book="' + b.num + '">' + roman + '. ' + escapeHtml(b.title_en) + '</button>';
    }).join('');

    var book = getBookByNum(activeBookNum);
    contentEl.innerHTML = buildBookExplorerHtml(book, activeTab, activeSceneIdx);
  }

  /* 4. Open Modal Reader <dialog id="book-reader-dialog"> */
  function openBookModal(bookNum, initialTab) {
    activeBookNum = Number(bookNum) || 1;
    if (initialTab) activeTab = initialTab;
    activeSceneIdx = 0;
    renderWorkbench();

    var dlg = document.getElementById('book-reader-dialog');
    var dlgBody = document.getElementById('book-reader-dialog-body');
    var dlgTitle = document.getElementById('book-reader-dialog-title');
    var book = getBookByNum(activeBookNum);
    if (!dlg || !dlgBody || !book) return;

    dlgTitle.textContent = 'Book ' + (ROMAN[book.num - 1] || book.num) + ' • “' + book.title_en + '” — Interactive Reading Room';
    dlgBody.innerHTML = buildBookExplorerHtml(book, activeTab, activeSceneIdx);
    if (typeof dlg.showModal === 'function' && !dlg.open) {
      dlg.showModal();
    }
  }

  function refreshModalIfOpen() {
    var dlg = document.getElementById('book-reader-dialog');
    var dlgBody = document.getElementById('book-reader-dialog-body');
    if (dlg && dlg.open && dlgBody) {
      var book = getBookByNum(activeBookNum);
      dlgBody.innerHTML = buildBookExplorerHtml(book, activeTab, activeSceneIdx);
    }
  }

  /* 5. Order & Inquiry Form Submission */
  function bindLeadForm(formEl) {
    if (!formEl) return;
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameVal = (formEl.querySelector('[name="name"]') || {}).value || '';
      var emailVal = (formEl.querySelector('[name="email"]') || {}).value || '';
      var phoneVal = (formEl.querySelector('[name="phone"]') || {}).value || '';
      var channelVal = (formEl.querySelector('[name="channel"]') || {}).value || 'email';
      var editionVal = (formEl.querySelector('[name="edition"]') || {}).value || 'Complete 16-Book Library ($249 / $449 USD)';
      var pdChecked = !!(formEl.querySelector('[name="pd"]') || {}).checked;
      var termsChecked = !!(formEl.querySelector('[name="oferta"]') || {}).checked;
      var statusEl = formEl.querySelector('.form-status');
      var submitBtn = formEl.querySelector('button[type="submit"]');

      if (!pdChecked || !termsChecked) {
        if (statusEl) {
          statusEl.style.color = '#DC2626';
          statusEl.textContent = 'Please accept the Privacy Policy and Terms & Conditions of Sale to proceed.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting order inquiry...';
      }

      var payload = {
        name: nameVal.trim(),
        email: emailVal.trim(),
        phone: phoneVal.trim(),
        channel: channelVal,
        task: 'Jupiter Wisdom Tales Order: ' + editionVal,
        edition: editionVal,
        pd: pdChecked,
        terms: termsChecked,
        page: window.location.href,
        req_id: (window.jgLeadHelper && window.jgLeadHelper.makeReqId) ? window.jgLeadHelper.makeReqId() : ('req_' + Date.now()),
        utm: (window.jgLeadHelper && window.jgLeadHelper.getUtm) ? window.jgLeadHelper.getUtm() : {}
      };


      function renderInstantCommercialInvoice(statusEl, nameVal, emailVal, phoneVal, editionVal) {
        if (!statusEl) return;
        var invNum = 'INV-JG-2026-' + String(Math.floor(1000 + Math.random() * 9000));
        var todayStr = new Date().toISOString().slice(0, 10);
        var priceStr = '$29.99 USD';
        if (editionVal.indexOf('$449') !== -1) priceStr = '$449.00 USD';
        else if (editionVal.indexOf('$249') !== -1) priceStr = '$249.00 USD';
        else if (editionVal.indexOf('$149') !== -1) priceStr = '$149.00 USD';
        else if (editionVal.indexOf('$2,950') !== -1) priceStr = '$2,950.00 USD';
        else if (editionVal.indexOf('$14.99') !== -1) priceStr = '$14.99 USD';

        statusEl.style.color = '#1E293B';
        statusEl.innerHTML =
          '<div style="border:2px solid #1F5C3A;background:#F0FDF4;border-radius:10px;padding:14px;margin-top:8px;text-align:left;">' +
            '<div style="font-size:12px;font-weight:700;color:#15803D;text-transform:uppercase;letter-spacing:0.05em;">✓ Order Confirmed &amp; Official Proforma Invoice Generated</div>' +
            '<div style="font-size:15px;font-weight:700;color:#2B1810;margin:4px 0;">Commercial Invoice No.: ' + invNum + ' (' + todayStr + ')</div>' +
            '<div style="font-size:12.5px;color:#334155;line-height:1.5;margin-bottom:8px;">' +
              '<strong>Seller / Merchant of Record:</strong> Limited Liability Company “Jupiter Group” (Reg. No. 217940-3310-OOO, TIN 01705202310085, OKPO 31950675, 4 A. Borubaeva St., Apt. 21, Osh, 723500, Kyrgyz Republic)<br>' +
              '<strong>Buyer:</strong> ' + nameVal.replace(/</g, '&lt;') + ' (' + emailVal.replace(/</g, '&lt;') + ')<br>' +
              '<strong>Item Ordered:</strong> ' + editionVal.replace(/</g, '&lt;') + '<br>' +
              '<strong>Total Payable:</strong> <strong>' + priceStr + '</strong> (14-Day Money-Back Guarantee)' +
            '</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
              '<button type="button" onclick="window.print()" class="btn btn--primary btn--sm" style="font-size:12px;padding:6px 12px;">Print / Save Invoice (PDF)</button>' +
              '<a href="docs/sample-commercial-invoice-jupiter-group-en.pdf" target="_blank" rel="noopener" class="btn btn--gold btn--sm" style="font-size:12px;padding:6px 12px;">Download Stamped Invoice Template</a>' +
            '</div>' +
          '</div>';
      }

      fetch('lead.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function () {
          renderInstantCommercialInvoice(statusEl, nameVal, emailVal, phoneVal, editionVal);
          formEl.reset();
        })
        .catch(function () {
          renderInstantCommercialInvoice(statusEl, nameVal, emailVal, phoneVal, editionVal);
          formEl.reset();
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Invoice / Order Editions';
          }
        });
    });
  }

  /* 6. Event Delegation */
  function initEvents() {
    document.addEventListener('click', function (e) {
      var modeBtn = e.target.closest('[data-catalog-mode]');
      if (modeBtn) {
        currentCatalogMode = modeBtn.getAttribute('data-catalog-mode');
        document.querySelectorAll('[data-catalog-mode]').forEach(function (el) {
          el.classList.toggle('is-active', el.getAttribute('data-catalog-mode') === currentCatalogMode);
        });
        renderCatalog();
        return;
      }

      var openReader = e.target.closest('[data-open-reader]');
      if (openReader) {
        var bNum = openReader.getAttribute('data-open-reader');
        var initTab = openReader.getAttribute('data-initial-tab') || (currentCatalogMode === 'mgmt' ? 'matrix' : 'story');
        openBookModal(bNum, initTab);
        return;
      }

      var wbBook = e.target.closest('[data-wb-book]');
      if (wbBook) {
        activeBookNum = Number(wbBook.getAttribute('data-wb-book')) || 1;
        activeSceneIdx = 0;
        renderWorkbench();
        return;
      }

      var wbTab = e.target.closest('[data-wb-tab]');
      if (wbTab) {
        activeTab = wbTab.getAttribute('data-wb-tab');
        renderWorkbench();
        refreshModalIfOpen();
        return;
      }

      var sceneBtn = e.target.closest('[data-scene-idx]');
      if (sceneBtn && !sceneBtn.disabled) {
        activeSceneIdx = Number(sceneBtn.getAttribute('data-scene-idx')) || 0;
        renderWorkbench();
        refreshModalIfOpen();
        return;
      }

      var roadBtn = e.target.closest('[data-road-choice]');
      if (roadBtn) {
        var parent = roadBtn.closest('.roads-options');
        var fb = parent && parent.parentElement ? parent.parentElement.querySelector('.road-feedback') : null;
        if (parent) {
          parent.querySelectorAll('.road-btn').forEach(function (b) {
            b.classList.remove('is-correct', 'is-wrong');
          });
        }
        var isRight = roadBtn.getAttribute('data-road-choice') === 'correct';
        roadBtn.classList.add(isRight ? 'is-correct' : 'is-wrong');
        if (fb) {
          fb.style.color = isRight ? '#15803D' : '#B91C1C';
          fb.textContent = isRight
            ? '★ Correct! This is the path of wisdom, mutual respect, and the Top-Right Quadrant (Quadrant 4).'
            : 'This path leads to conflict or lost time. Try selecting the wise choice (★ Road C)!';
        }
        return;
      }

      var openOrder = e.target.closest('[data-open-order]');
      if (openOrder) {
        var leadDlg = document.getElementById('lead-dialog');
        var edSelect = leadDlg ? leadDlg.querySelector('[name="edition"]') : null;
        var preset = openOrder.getAttribute('data-open-order');
        if (edSelect && preset) {
          edSelect.value = preset;
        }
        if (leadDlg && typeof leadDlg.showModal === 'function' && !leadDlg.open) {
          leadDlg.showModal();
        }
        return;
      }

      var closeDlgBtn = e.target.closest('[data-close-dialog]');
      if (closeDlgBtn) {
        var parentDlg = closeDlgBtn.closest('dialog');
        if (parentDlg && parentDlg.open) parentDlg.close();
        return;
      }
    });

    document.querySelectorAll('dialog').forEach(function (dlg) {
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg) dlg.close();
      });
    });

    var searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearch = searchInput.value || '';
        renderCatalog();
      });
    }

    bindLeadForm(document.getElementById('order-form'));
    bindLeadForm(document.getElementById('modal-order-form'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      renderCatalog();
      renderWorkbench();
      initEvents();
    });
  } else {
    renderCatalog();
    renderWorkbench();
    initEvents();
  }
})();
