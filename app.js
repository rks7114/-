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
        <a href="index.html"><span class="pc-nav-ico">🏠</span><span>대시보드</span></a>
        <a href="admin-secretary.html"><span class="pc-nav-ico">1️⃣</span><span>1. 행정비서</span></a>
        <a href="safe-housing.html"><span class="pc-nav-ico">2️⃣</span><span>2. 안심주거</span></a>
        <a href="asset-guide.html"><span class="pc-nav-ico">3️⃣</span><span>3. 자산가이드</span></a>
        <a href="emergency-rescue.html"><span class="pc-nav-ico">4️⃣</span><span>4. 긴급구조</span></a>
        <a href="digital-help.html"><span class="pc-nav-ico">5️⃣</span><span>5. 생활편의</span></a>
        <a href="roadmaster.html"><span class="pc-nav-ico">6️⃣</span><span>6. 로드마스터</span></a>
        <a href="practical-conversation.html"><span class="pc-nav-ico">7️⃣</span><span>7. 실무회화</span></a>
        <a href="homeland-connect.html"><span class="pc-nav-ico">8️⃣</span><span>8. 본국연결</span></a>
        <a href="checklist-generator.html"><span class="pc-nav-ico">✅</span><span>체크리스트</span></a>
      </nav>
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
  }

  function updateJapanClock() {
    const tokyo = new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo' }).format(new Date());
    ['jp-time-ko', 'jp-time-ja', 'jp-time-zh'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = tokyo;
    });
  }

  ensureGlobalUi();
  ensureDesktopSidebar();
  ensurePcTopMenu();
  updateJapanClock();
  setInterval(updateJapanClock, 30000);

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
