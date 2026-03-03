(function () {
  const KEY = 'jamgong_lang';
  const aliases = { jp: 'ja', cn: 'zh', ko: 'ko', ja: 'ja', zh: 'zh' };

  function canonical(lang) {
    return aliases[lang] || 'ko';
  }

  function updateOracleMessages(lang) {
    document.querySelectorAll('.oracle-alert [data-lang]').forEach((el) => {
      el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
    });
  }

  function applyLang(rawLang) {
    const lang = canonical(rawLang);
    localStorage.setItem(KEY, lang);
    document.body.classList.remove('lang-ko', 'lang-ja', 'lang-zh');
    document.body.classList.add(`lang-${lang}`);
    document.querySelectorAll('[data-set-lang]').forEach((b) => {
      b.classList.toggle('active', canonical(b.getAttribute('data-set-lang')) === lang);
    });
    updateOracleMessages(lang);
    document.dispatchEvent(new CustomEvent('jamgong:langchange', { detail: { lang } }));
  }


  function ensureGlobalUi() {
    const nav = document.querySelector('.lang-tabs');
    if (nav && !document.querySelector('.global-japan-alert')) {
      const bar = document.createElement('div');
      bar.className = 'global-japan-alert';
      bar.innerHTML = `
        <p class="lang-block ko">일본 경도 139.6917E 실시간 알림: <strong id="jp-time-ko">--:--</strong></p>
        <p class="lang-block ja"><ruby>日本経度<rt>にほんけいど</rt></ruby>139.6917E <ruby>通知<rt>つうち</rt></ruby>：<strong id="jp-time-ja">--:--</strong></p>
        <p class="lang-block zh"><ruby>日本经度<rt>rì běn jīng dù</rt></ruby>139.6917E <ruby>实时提醒<rt>shí shí tí xǐng</rt></ruby>：<strong id="jp-time-zh">--:--</strong></p>
      `;
      nav.insertAdjacentElement('afterend', bar);
    }

    if (!document.querySelector('.biz-footer') && document.body) {
      const footer = document.createElement('footer');
      footer.className = 'partner-slot biz-footer';
      footer.innerHTML = `
        <p class="biz-title">JAMGONG KOREA Co., Ltd.</p>
        <p>
          <span class="lang-block ko">한국 사업자 정보 · 글로벌 결제 지원</span>
          <span class="lang-block ja"><ruby>韓国事業者情報<rt>かんこくじぎょうしゃじょうほう</rt></ruby>・PayPay/VISA/Mastercard</span>
          <span class="lang-block zh"><ruby>韩国企业信息<rt>hán guó qǐ yè xìn xī</rt></ruby>·PayPay/VISA/Mastercard</span>
        </p>
        <div class="payment-logos" aria-label="global payments"><span>PayPay</span><span>VISA</span><span>Mastercard</span></div>
      `;
      document.body.appendChild(footer);
    }
  }


  function ensureDesktopSidebar() {
    if (!document.body || document.querySelector('.pc-sidebar')) return;
    const sidebar = document.createElement('aside');
    sidebar.className = 'pc-sidebar';
    sidebar.innerHTML = `
      <h2 class="pc-sidebar-title">JAMGONG JAPAN</h2>
      <nav class="pc-sidebar-menu" aria-label="Desktop menu">
        <a href="index.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5v8a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1z"/></svg></span><span>대시보드</span></a>
        <a href="admin-secretary.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">1</span></span><span>1. 행정비서</span></a>
        <a href="safe-housing.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">2</span></span><span>2. 안심주거</span></a>
        <a href="asset-guide.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">3</span></span><span>3. 자산가이드</span></a>
        <a href="emergency-rescue.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">4</span></span><span>4. 긴급구조</span></a>
        <a href="digital-help.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">5</span></span><span>5. 생활편의</span></a>
        <a href="roadmaster.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">6</span></span><span>6. 로드마스터</span></a>
        <a href="practical-conversation.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">7</span></span><span>7. 실무회화</span></a>
        <a href="homeland-connect.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">8</span></span><span>8. 본국연결</span></a>
        <a href="checklist-generator.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7 10 17l-6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>체크리스트</span></a>
      </nav>
      <div class="pc-sidebar-flow" aria-label="Desktop circulation">
        <a class="pc-flow-link prev" href="#">이전</a>
        <a class="pc-flow-link next" href="#">다음</a>
      </div>
      <div class="pc-sidebar-cta-wrap">
        <a class="pc-sidebar-cta" href="checklist-generator.html">체크리스트로 이동</a>
      </div>
    `;
    document.body.appendChild(sidebar);
    if (window.matchMedia('(min-width: 1024px)').matches) {
      document.body.classList.add('with-pc-sidebar');
    }

    const media = window.matchMedia('(min-width: 1024px)');
    const applyDesktopState = (e) => {
      document.body.classList.toggle('with-pc-sidebar', e.matches);
    };
    applyDesktopState(media);
    media.addEventListener('change', applyDesktopState);

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    sidebar.querySelectorAll('.pc-sidebar-menu a').forEach((link) => {
      const isActive = link.getAttribute('href') === currentPage;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
    });


    const flowOrder = [
      'index.html',
      'admin-secretary.html',
      'safe-housing.html',
      'asset-guide.html',
      'emergency-rescue.html',
      'digital-help.html',
      'roadmaster.html',
      'practical-conversation.html',
      'homeland-connect.html',
      'checklist-generator.html'
    ];
    const idx = flowOrder.indexOf(currentPage);
    if (idx !== -1) {
      const prev = flowOrder[(idx - 1 + flowOrder.length) % flowOrder.length];
      const next = flowOrder[(idx + 1) % flowOrder.length];
      const prevLink = sidebar.querySelector('.pc-flow-link.prev');
      const nextLink = sidebar.querySelector('.pc-flow-link.next');
      if (prevLink) prevLink.href = prev;
      if (nextLink) nextLink.href = next;
    }
  }



  function ensurePcTopMenu() {
    if (!document.body || document.querySelector('.pc-top-menu')) return;
    const bar = document.createElement('div');
    bar.className = 'pc-top-menu';
    bar.innerHTML = `
      <div class="pc-top-menu-inner">
        <a href="index.html">대시보드</a>
        <a href="roadmaster.html">로드마스터</a>
        <a href="future-planning.html">미래설계</a>
        <a href="checklist-generator.html">체크리스트</a>
      </div>
    `;
    document.body.appendChild(bar);

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    bar.querySelectorAll('.pc-top-menu-inner a').forEach((link) => {
      const isActive = link.getAttribute('href') === currentPage;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
    });
  }

  function updateJapanClock() {
    const tokyo = new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo' }).format(new Date());
    ['jp-time-ko', 'jp-time-ja', 'jp-time-zh'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = tokyo;
    });
  }


  const SMART_KEY = 'jamgong_smart_notice_v1';
  const CHECKLIST_KEY = 'jg_japan_checklist_v1';

  function toLocalDate(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function fmtDiff(targetDate) {
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    const totalMin = Math.max(0, Math.floor(diffMs / 60000));
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const mins = totalMin % 60;
    return `${days}일 ${hours}시간 ${mins}분`;
  }

  function loadSmartState() {
    try {
      return JSON.parse(localStorage.getItem(SMART_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveSmartState(next) {
    localStorage.setItem(SMART_KEY, JSON.stringify(next));
  }

  function loadChecklistState() {
    try {
      return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function computeSmartAlerts() {
    const smart = loadSmartState();
    const checklist = loadChecklistState();
    const arrival = toLocalDate(smart.arrivalDate || checklist?.arrivalDate);
    const visaExpiry = toLocalDate(smart.visaExpiryDate);
    const done = checklist?.done || {};
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const alerts = [];

    if (visaExpiry) {
      const dday = Math.ceil((visaExpiry.getTime() - now.getTime()) / 86400000);
      alerts.push({
        key: 'visa_dday',
        level: dday <= 30 ? 'danger' : 'gold',
        text: dday >= 0 ? `비자 만료 D-${dday}` : `비자 만료 ${Math.abs(dday)}일 경과`,
        remain: dday >= 0 ? `${dday}일 남음` : '즉시 갱신 필요'
      });
    }

    if (arrival) {
      const adminSteps = [
        { key: 'addr_register', title: '전입 신고', dueOffsetDays: 14 },
        { key: 'status_confirm', title: '체류자격 신고 점검', dueOffsetDays: 14 },
        { key: 'phone_setup', title: '통신 개통 정보 확인', dueOffsetDays: 14 }
      ];

      adminSteps.forEach((step) => {
        if (done[step.key]) return;
        const due = new Date(arrival);
        due.setDate(due.getDate() + step.dueOffsetDays);
        due.setHours(23, 59, 0, 0);
        const within14 = due.getTime() - Date.now() <= 14 * 86400000;
        if (!within14) return;
        const overdue = due.getTime() < Date.now();
        alerts.push({
          key: step.key,
          level: overdue ? 'danger' : 'gold',
          text: `행정 신고: ${step.title}`,
          remain: overdue ? '마감 초과' : `${fmtDiff(due)} 남음`
        });
      });
    }

    return alerts;
  }

  function ensureFutureVisaPanel() {
    if (!document.querySelector('.future-hero') || document.querySelector('.visa-dday-panel')) return;
    const wrap = document.createElement('section');
    wrap.className = 'visa-dday-panel principles';
    const smart = loadSmartState();
    wrap.innerHTML = `
      <h3>비자 D-Day 설정</h3>
      <p>미래설계 데이터와 알림 엔진을 연동합니다.</p>
      <div class="visa-dday-row">
        <label for="visaExpiryDate">비자 만료일</label>
        <input id="visaExpiryDate" type="date" value="${smart.visaExpiryDate || ''}" />
      </div>
      <button type="button" class="cta-btn" id="saveVisaDday">저장</button>
    `;
    const main = document.querySelector('main');
    if (main) main.prepend(wrap);
    const input = wrap.querySelector('#visaExpiryDate');
    const btn = wrap.querySelector('#saveVisaDday');
    if (btn && input) {
      btn.addEventListener('click', () => {
        const state = loadSmartState();
        state.visaExpiryDate = input.value || '';
        saveSmartState(state);
        updateSmartNoticeUi();
      });
    }
  }

  function ensureSmartNoticeUi() {
    const sidebar = document.querySelector('.pc-sidebar');
    if (sidebar && !sidebar.querySelector('.smart-widget')) {
      const widget = document.createElement('section');
      widget.className = 'smart-widget';
      widget.innerHTML = `
        <h3>오늘의 실무 알림</h3>
        <div class="smart-list" id="smartList"></div>
      `;
      sidebar.appendChild(widget);
    }

    const hero = document.querySelector('header.hero, .golden-streamline-header');
    if (hero && !document.querySelector('.mobile-urgent-line')) {
      const line = document.createElement('div');
      line.className = 'mobile-urgent-line';
      line.id = 'mobileUrgentLine';
      hero.insertAdjacentElement('afterend', line);
    }
  }

  function updateSmartNoticeUi() {
    const smart = loadSmartState();
    const checklist = loadChecklistState();
    if ((!smart.arrivalDate || !smart.arrivalDate.length) && checklist?.arrivalDate) {
      smart.arrivalDate = checklist.arrivalDate;
      saveSmartState(smart);
    }

    const alerts = computeSmartAlerts();
    const list = document.getElementById('smartList');
    if (list) {
      list.innerHTML = '';
      if (!alerts.length) {
        const item = document.createElement('div');
        item.className = 'smart-item gold';
        item.innerHTML = '<strong>알림 없음</strong><p>체크리스트 완료 또는 일정 미설정</p>';
        list.appendChild(item);
      } else {
        alerts.slice(0, 5).forEach((alert) => {
          const item = document.createElement('div');
          item.className = `smart-item ${alert.level}`;
          item.innerHTML = `<strong>${alert.text}</strong><p>${alert.remain}</p>`;
          list.appendChild(item);
        });
      }
    }

    const mobileLine = document.getElementById('mobileUrgentLine');
    if (mobileLine) {
      const urgent = alerts.find((x) => x.level === 'danger') || alerts[0];
      mobileLine.textContent = urgent ? `긴급 일정 · ${urgent.text} · ${urgent.remain}` : '긴급 일정 · 현재 마감 임박 일정 없음';
    }
  }

  ensureGlobalUi();
  ensureDesktopSidebar();
  ensurePcTopMenu();
  ensureFutureVisaPanel();
  ensureSmartNoticeUi();
  updateJapanClock();
  updateSmartNoticeUi();
  setInterval(updateJapanClock, 30000);
  setInterval(updateSmartNoticeUi, 60000);
  window.addEventListener('storage', (e) => {
    if (e.key === SMART_KEY || e.key === CHECKLIST_KEY) updateSmartNoticeUi();
  });

  const saved = canonical(localStorage.getItem(KEY) || 'ko');
  applyLang(saved);

  window.switchLang = (lang) => applyLang(lang);

  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-set-lang')));
  });



  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A') e.preventDefault();
      const modal = document.querySelector(btn.getAttribute('data-open-modal'));
      if (modal) modal.hidden = false;
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.pay-modal');
      if (modal) modal.hidden = true;
    });
  });

  document.querySelectorAll('.pay-modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  });



  function updateOracleClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const time = `${hh}:${mm}`;
    ['oracle-time-ko', 'oracle-time-ja', 'oracle-time-zh'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = time;
    });
  }

  updateOracleClock();
  setInterval(updateOracleClock, 30000);



  const fadeTargets = document.querySelectorAll('.principles, .card, .premium-card, .coming-soon-banner, .desktop-workbench');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12 });
    fadeTargets.forEach((el) => {
      el.classList.add('fade-in-target');
      io.observe(el);
    });
  } else {
    fadeTargets.forEach((el) => el.classList.add('is-visible'));
  }

  document.querySelectorAll('[role="button"]').forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const el = document.querySelector(btn.getAttribute('data-copy-target'));
      if (!el) return;
      try {
        await navigator.clipboard.writeText(el.textContent.trim());
        btn.textContent = '복사 완료';
        setTimeout(() => { btn.textContent = '복사'; }, 1100);
      } catch (_) {
        btn.textContent = '복사 실패';
      }
    });
  });

  document.querySelectorAll('[data-fullscreen-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = document.querySelector(btn.getAttribute('data-fullscreen-target'));
      if (!el) return;
      if (el.requestFullscreen) el.requestFullscreen();
    });
  });



  function enforceHomeLinks() {
    document.querySelectorAll('nav.mobile-bottom-nav').forEach((nav) => {
      const first = nav.querySelector('a:first-child');
      if (first) first.setAttribute('href', 'index.html');
      nav.querySelectorAll('a').forEach((a) => {
        if (a.textContent.trim() === '홈') a.setAttribute('href', 'index.html');
      });
    });
  }

  enforceHomeLinks();

  document.querySelectorAll('nav.mobile-bottom-nav a[href="index.html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      link.setAttribute('href', 'index.html');
      console.info('[jamgong-nav] home tap detected -> index.html');
      window.location.assign('index.html');
    });
  });

  console.info('[jamgong-nav] mobile home link enforcement active');


  document.querySelectorAll('a.back-link[href="index.html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      console.info('[jamgong-nav] dashboard return tap detected -> index.html');
      window.location.assign('index.html');
    });
  });

  const syncKey = 'jamgong_cloud_doc_v1';
  const syncState = document.getElementById('sync-state');
  const fields = {
    ko: document.getElementById('doc-ko'),
    ja: document.getElementById('doc-ja'),
    zh: document.getElementById('doc-zh')
  };

  function setSyncState(message) {
    if (syncState) syncState.textContent = message;
  }

  function loadDoc() {
    try {
      const saved = JSON.parse(localStorage.getItem(syncKey) || '{}');
      ['ko', 'ja', 'zh'].forEach((k) => {
        if (fields[k] && typeof saved[k] === 'string') fields[k].value = saved[k];
      });
      setSyncState('Cloud Sync: Restored');
    } catch (_) {
      setSyncState('Cloud Sync: Restore failed');
    }
  }

  function saveDoc(source = 'local') {
    const payload = {
      ko: fields.ko?.value || '',
      ja: fields.ja?.value || '',
      zh: fields.zh?.value || '',
      updatedAt: Date.now()
    };
    localStorage.setItem(syncKey, JSON.stringify(payload));
    setSyncState(`Cloud Sync: Saved (${source})`);
    return payload;
  }

  function applyA4() {
    const ko = fields.ko?.value || '';
    const ja = fields.ja?.value || '';
    const zh = fields.zh?.value || '';
    const a4ko = document.getElementById('a4-ko');
    const a4ja = document.getElementById('a4-ja');
    const a4zh = document.getElementById('a4-zh');
    if (a4ko) a4ko.textContent = ko;
    if (a4ja) a4ja.textContent = ja;
    if (a4zh) a4zh.textContent = zh;
  }

  loadDoc();
  applyA4();

  Object.values(fields).forEach((el) => {
    if (!el) return;
    el.addEventListener('input', () => {
      saveDoc('live');
      applyA4();
    });
  });

  window.addEventListener('storage', (e) => {
    if (e.key === syncKey) {
      loadDoc();
      applyA4();
      setSyncState('Cloud Sync: Updated from another device/session');
    }
  });

  document.getElementById('refresh-a4')?.addEventListener('click', applyA4);
  document.getElementById('print-a4')?.addEventListener('click', () => {
    applyA4();
    window.print();
  });


  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
