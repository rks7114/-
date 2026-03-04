(function () {
  const KEY = 'jamgong_lang';
  const aliases = { jp: 'ja', cn: 'zh', ko: 'ko', ja: 'ja', zh: 'zh', kr: 'ko', tw: 'zh', ch: 'zh', en: 'ko' };

  function canonical(lang) {
    return aliases[String(lang || '').toLowerCase()] || 'ko';
  }


  const LANGUAGE_PACK = {
    ko: {
      nav: {
        dashboard: '대시보드', admin: '1. 행정비서', housing: '2. 안심주거', asset: '3. 자산가이드', emergency: '4. 긴급구조',
        digital: '5. 생활편의', roadmaster: '6. 로드마스터', conversation: '7. 실무회화', homeland: '8. 본국연결', checklist: '체크리스트',
        future: '미래설계', prev: '이전', next: '다음', checklistCta: '체크리스트로 이동', home: '홈'
      },
      dataHub: { title: '회장님 데이터 허브', hospital: '병원·보험', job: '취업 가이드', faq: '외국인 FAQ' },
      visa: { title: '비자 D-Day 설정', desc: '미래설계 데이터와 알림 엔진을 연동합니다.', label: '비자 만료일', save: '저장' },
      smart: { title: '오늘의 실무 알림', noneTitle: '알림 없음', noneDesc: '체크리스트 완료 또는 일정 미설정' }, quick: { kr: 'KR', jp: 'JP', cn: 'CN' }, cat: { hospitalInsurance: '병원·보험', jobGuide: '취업 가이드', foreignerFaq: '외국인 FAQ' }
    },
    ja: {
      nav: {
        dashboard: 'ダッシュボード', admin: '1. 行政秘書', housing: '2. 安心住居', asset: '3. 資産ガイド', emergency: '4. 緊急救助',
        digital: '5. 生活便利', roadmaster: '6. ロードマスター', conversation: '7. 実務会話', homeland: '8. 本国連携', checklist: 'チェックリスト',
        future: '未来設計', prev: '前へ', next: '次へ', checklistCta: 'チェックリストへ移動', home: 'ホーム'
      },
      dataHub: { title: '会長データハブ', hospital: '病院・保険', job: '就職ガイド', faq: '外国人FAQ' },
      visa: { title: 'ビザ D-Day 設定', desc: '未来設計データと通知エンジンを連動します。', label: 'ビザ満了日', save: '保存' },
      smart: { title: '本日の実務通知', noneTitle: '通知なし', noneDesc: 'チェックリスト完了または日程未設定' }, quick: { kr: 'KR', jp: 'JP', cn: 'CN' }, cat: { hospitalInsurance: '病院・保険', jobGuide: '就職ガイド', foreignerFaq: '外国人FAQ' }
    },
    zh: {
      nav: {
        dashboard: '仪表盘', admin: '1. 行政秘书', housing: '2. 安心住房', asset: '3. 资产指南', emergency: '4. 紧急救助',
        digital: '5. 生活便利', roadmaster: '6. 路线总览', conversation: '7. 实务会话', homeland: '8. 本国连接', checklist: '清单',
        future: '未来规划', prev: '上一步', next: '下一步', checklistCta: '前往清单', home: '首页'
      },
      dataHub: { title: '会长数据中心', hospital: '医院·保险', job: '就业指南', faq: '外国人FAQ' },
      visa: { title: '签证 D-Day 设置', desc: '联动未来规划数据与提醒引擎。', label: '签证到期日', save: '保存' },
      smart: { title: '今日实务提醒', noneTitle: '暂无提醒', noneDesc: '清单已完成或未设定日程' }, quick: { kr: 'KR', jp: 'JP', cn: 'CN' }, cat: { hospitalInsurance: '医院·保险', jobGuide: '就业指南', foreignerFaq: '外国人FAQ' }
    }
  };

  function getPack(lang) {
    return LANGUAGE_PACK[canonical(lang)] || LANGUAGE_PACK.ko;
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
    applyLanguagePack(lang);
    document.dispatchEvent(new CustomEvent('jamgong:langchange', { detail: { lang } }));
  }

  // 시스템 원칙 반영: 화면 텍스트에 YYYY-MM-DD 같은 날짜 표기를 직접 노출하지 않는다.
  function stripDateNotation(text) {
    return String(text || '')
      .replace(/\b\d{4}[./-]\d{1,2}[./-]\d{1,2}\b/g, '기준일')
      .replace(/\b\d{1,2}[./-]\d{1,2}\b/g, '기준일')
      .replace(/\d{4}년\s*\d{1,2}월\s*\d{1,2}일/g, '기준일')
      .replace(/(기준일)([.!?。！？]*)$/g, '$1');
  }

  function bindLanguageSwitchers() {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('button[data-set-lang], a[data-set-lang], [role="button"][data-set-lang], button[data-lang-set], a[data-lang-set], [role="button"][data-lang-set], button[data-lang], a[data-lang], [role="button"][data-lang]');
      if (!trigger) return;
      const raw = trigger.getAttribute('data-set-lang') || trigger.getAttribute('data-lang-set') || trigger.getAttribute('data-lang');
      if (!raw) return;
      event.preventDefault();
      applyLang(raw);
    });
  }


  const CHAIRMAN_DATA = {
    hospitalInsurance: [
      { ko: '응급 시 119 연락 후 가까운 구급 가능 병원으로 이동', ja: '緊急時は119へ連絡し、受入可能な病院へ移動', zh: '紧急情况先拨打119并前往可接收医院' },
      { ko: '국민건강보험·연금 가입 상태를 구청/회사에서 즉시 확인', ja: '国民健康保険・年金の加入状態を区役所/会社で確認', zh: '在区役所或公司核对健康保险与年金加入状态' },
      { ko: '진료 전 본인확인(재류카드/여권)과 보험증 지참', ja: '受診前に本人確認書類と保険証を持参', zh: '就诊前携带在留卡或护照及保险证' }
    ],
    jobGuide: [
      { ko: '채용공고의 비자 요건과 직무 일본어 수준을 먼저 체크', ja: '求人票の在留資格要件と日本語レベルを先に確認', zh: '优先确认招聘信息中的签证要求与日语等级' },
      { ko: '이력서·경력기술서·포트폴리오를 직무별 버전으로 관리', ja: '履歴書・職務経歴書・ポートフォリオを職種別に管理', zh: '按岗位管理简历、经历说明和作品集版本' },
      { ko: '내정 후 근로조건통지서와 사회보험 반영 여부를 점검', ja: '内定後は労働条件通知書と社会保険反映を点検', zh: '拿到录用后核对劳动条件通知书与社保登记' }
    ],
    foreignerFaq: [
      { q: { ko: '주소 변경 신고는 언제 해야 하나요', ja: '住所変更届はいつまでに必要ですか', zh: '住址变更需要何时申报' }, a: { ko: '전입 후 빠르게 구청에서 처리하고 증빙을 보관하세요', ja: '転入後は速やかに区役所で手続きし控えを保管', zh: '迁入后尽快到区役所办理并保留凭证' } },
      { q: { ko: '아르바이트 가능 시간은 어떻게 확인하나요', ja: 'アルバイト可能時間はどう確認しますか', zh: '如何确认可打工时长' }, a: { ko: '체류자격별 허용 조건을 입국관리 안내 기준으로 확인하세요', ja: '在留資格ごとの許可条件を入管案内で確認', zh: '按在留资格对应条件在入管指南中确认' } },
      { q: { ko: '의료 통역이 필요하면 어떻게 하나요', ja: '医療通訳が必要な場合はどうしますか', zh: '需要医疗口译时怎么办' }, a: { ko: '지자체 다국어 지원 창구 또는 병원 통역 연계를 이용하세요', ja: '自治体の多言語窓口または病院通訳連携を利用', zh: '使用政府多语服务窗口或医院口译联动' } }
    ]
  };

  function ensureChairmanDataHub(langInput) {
    const main = document.querySelector('main');
    if (!main) return;
    let slot = document.getElementById('chairman-data-slot');
    if (!slot) {
      slot = document.createElement('section');
      slot.id = 'chairman-data-slot';
      main.appendChild(slot);
    }
    const lang = canonical(langInput || localStorage.getItem(KEY) || 'ko');
    const pack = getPack(lang);

    const li = (item) => `<li>${stripDateNotation(item[lang] || item.ko || '')}</li>`;
    const faq = (item) => {
      const q = stripDateNotation(item.q[lang] || item.q.ko || '');
      const a = stripDateNotation(item.a[lang] || item.a.ko || '');
      return `<li><strong>Q.</strong> ${q}<br><strong>A.</strong> ${a}</li>`;
    };

    slot.className = 'principles chairman-data-hub';
    slot.innerHTML = `
      <h2>${pack.dataHub.title}</h2>
      <div class="chairman-cats" role="tablist" aria-label="Chairman categories">
        <button type="button" class="chairman-cat active" data-chair-cat="hospitalInsurance">${pack.cat.hospitalInsurance}</button>
        <button type="button" class="chairman-cat" data-chair-cat="jobGuide">${pack.cat.jobGuide}</button>
        <button type="button" class="chairman-cat" data-chair-cat="foreignerFaq">${pack.cat.foreignerFaq}</button>
      </div>
      <div class="chairman-grid" id="chairmanCatContent"></div>
    `;

    const content = slot.querySelector('#chairmanCatContent');
    const renderCategory = (cat) => {
      if (!content) return;
      const key = cat in CHAIRMAN_DATA ? cat : 'hospitalInsurance';
      if (key === 'foreignerFaq') {
        content.innerHTML = `<article class="content-card"><h3>${pack.cat.foreignerFaq}</h3><ul>${CHAIRMAN_DATA.foreignerFaq.map(faq).join('')}</ul></article>`;
      } else if (key === 'jobGuide') {
        content.innerHTML = `<article class="content-card"><h3>${pack.cat.jobGuide}</h3><ul>${CHAIRMAN_DATA.jobGuide.map(li).join('')}</ul></article>`;
      } else {
        content.innerHTML = `<article class="content-card"><h3>${pack.cat.hospitalInsurance}</h3><ul>${CHAIRMAN_DATA.hospitalInsurance.map(li).join('')}</ul></article>`;
      }
      slot.querySelectorAll('.chairman-cat').forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-chair-cat') === key));
    };

    slot.querySelectorAll('.chairman-cat').forEach((btn) => {
      btn.addEventListener('click', () => renderCategory(btn.getAttribute('data-chair-cat')));
    });

    renderCategory(slot.dataset.cat || 'hospitalInsurance');
    slot.dataset.ready = '1';
  }


  function applyLanguagePack(langInput) {
    const lang = canonical(langInput || localStorage.getItem(KEY) || 'ko');
    const pack = getPack(lang);

    document.querySelectorAll('[data-nav-key]').forEach((el) => {
      const key = el.getAttribute('data-nav-key');
      if (pack.nav[key]) el.textContent = stripDateNotation(pack.nav[key]);
    });

    document.querySelectorAll('nav.mobile-bottom-nav a').forEach((a, idx) => {
      const href = a.getAttribute('href') || '';
      if (idx == 0 || href.includes('index.html')) a.textContent = pack.nav.home;
      else if (href.includes('admin-secretary')) a.textContent = pack.nav.admin;
      else if (href.includes('emergency-rescue')) a.textContent = pack.nav.emergency;
      else if (href.includes('asset-guide')) a.textContent = pack.nav.asset;
      else if (href.includes('practical-conversation')) a.textContent = pack.nav.conversation;
    });

    const smartTitle = document.querySelector('.smart-widget h3');
    if (smartTitle) smartTitle.textContent = pack.smart.title;

    document.querySelectorAll('[data-quick-key]').forEach((el) => {
      const key = el.getAttribute('data-quick-key');
      if (pack.quick[key]) el.textContent = pack.quick[key];
    });

    const visaPanel = document.querySelector('.visa-dday-panel');
    if (visaPanel) {
      const t = visaPanel.querySelector('[data-i18n-key="visa-title"]');
      const d = visaPanel.querySelector('[data-i18n-key="visa-desc"]');
      const l = visaPanel.querySelector('[data-i18n-key="visa-label"]');
      const b = visaPanel.querySelector('[data-i18n-key="visa-save"]');
      if (t) t.textContent = pack.visa.title;
      if (d) d.textContent = pack.visa.desc;
      if (l) l.textContent = pack.visa.label;
      if (b) b.textContent = pack.visa.save;
    }

    const slot = document.getElementById('chairman-data-slot');
    if (slot) slot.dataset.ready = '0';
    ensureChairmanDataHub(lang);
  }


  function ensureQuickLangIcons() {
    if (!document.body || document.querySelector('.quick-lang-icons')) return;
    const wrap = document.createElement('div');
    wrap.className = 'quick-lang-icons';
    wrap.innerHTML = `
      <button type="button" class="quick-lang-btn" data-set-lang="ko" aria-label="Korean">🇰🇷 <span data-quick-key="kr">KR</span></button>
      <button type="button" class="quick-lang-btn" data-set-lang="ja" aria-label="Japanese">🇯🇵 <span data-quick-key="jp">JP</span></button>
      <button type="button" class="quick-lang-btn" data-set-lang="zh" aria-label="Chinese">🇨🇳 <span data-quick-key="cn">CN</span></button>
    `;
    document.body.prepend(wrap);
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
        <a href="index.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5v8a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1z"/></svg></span><span data-nav-key="dashboard">대시보드</span></a>
        <a href="admin-secretary.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">1</span></span><span data-nav-key="admin">1. 행정비서</span></a>
        <a href="safe-housing.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">2</span></span><span data-nav-key="housing">2. 안심주거</span></a>
        <a href="asset-guide.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">3</span></span><span data-nav-key="asset">3. 자산가이드</span></a>
        <a href="emergency-rescue.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">4</span></span><span data-nav-key="emergency">4. 긴급구조</span></a>
        <a href="digital-help.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">5</span></span><span data-nav-key="digital">5. 생활편의</span></a>
        <a href="roadmaster.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">6</span></span><span data-nav-key="roadmaster">6. 로드마스터</span></a>
        <a href="practical-conversation.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">7</span></span><span data-nav-key="conversation">7. 실무회화</span></a>
        <a href="homeland-connect.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="6"/></svg><span class="pc-num">8</span></span><span data-nav-key="homeland">8. 본국연결</span></a>
        <a href="checklist-generator.html"><span class="pc-nav-ico"><svg class="pc-nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7 10 17l-6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span data-nav-key="checklist">체크리스트</span></a>
      </nav>
      <div class="pc-sidebar-flow" aria-label="Desktop circulation">
        <a class="pc-flow-link prev" data-nav-key="prev" href="#">이전</a>
        <a class="pc-flow-link next" data-nav-key="next" href="#">다음</a>
      </div>
      <div class="pc-sidebar-cta-wrap">
        <a class="pc-sidebar-cta" data-nav-key="checklistCta" href="checklist-generator.html">체크리스트로 이동</a>
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
        <a href="index.html" data-nav-key="dashboard">대시보드</a>
        <a href="roadmaster.html" data-nav-key="roadmaster">로드마스터</a>
        <a href="future-planning.html" data-nav-key="future">미래설계</a>
        <a href="checklist-generator.html" data-nav-key="checklist">체크리스트</a>
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
      <h3 data-i18n-key="visa-title">비자 D-Day 설정</h3>
      <p data-i18n-key="visa-desc">미래설계 데이터와 알림 엔진을 연동합니다.</p>
      <div class="visa-dday-row">
        <label data-i18n-key="visa-label" for="visaExpiryDate">비자 만료일</label>
        <input id="visaExpiryDate" type="date" value="${smart.visaExpiryDate || ''}" />
      </div>
      <button type="button" class="cta-btn" data-i18n-key="visa-save" id="saveVisaDday">저장</button>
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
        <h3 data-i18n-key="smart-title">오늘의 실무 알림</h3>
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
        const pack = getPack(canonical(localStorage.getItem(KEY) || 'ko'));
        item.innerHTML = `<strong>${pack.smart.noneTitle}</strong><p>${pack.smart.noneDesc}</p>`;
        list.appendChild(item);
      } else {
        alerts.slice(0, 5).forEach((alert) => {
          const item = document.createElement('div');
          item.className = `smart-item ${alert.level}`;
          item.innerHTML = `<strong>${stripDateNotation(alert.text)}</strong><p>${stripDateNotation(alert.remain)}</p>`;
          list.appendChild(item);
        });
      }
    }

    const mobileLine = document.getElementById('mobileUrgentLine');
    if (mobileLine) {
      const urgent = alerts.find((x) => x.level === 'danger') || alerts[0];
      mobileLine.textContent = urgent ? stripDateNotation(`긴급 일정 · ${urgent.text} · ${urgent.remain}`) : '긴급 일정 · 현재 마감 임박 일정 없음';
    }
  }

  ensureQuickLangIcons();
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
  ensureChairmanDataHub(saved);

  window.switchLang = (lang) => applyLang(lang);
  bindLanguageSwitchers();



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



  function goHome(replace = false) {
    const url = new URL('index.html', window.location.href).toString();
    if (replace) window.location.replace(url);
    else window.location.assign(url);
  }

  function markHomeLogos() {
    document.querySelectorAll('.pc-sidebar-title, .hero .eyebrow, .dashboard-hero .eyebrow, .golden-streamline-header h1, .roadmaster-page .header-content h1, .hero h1, .dashboard-hero h1, .jg-titlebar h1').forEach((el) => {
      el.setAttribute('data-home-logo', 'true');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.style.cursor = 'pointer';
    });
  }

  function injectInlineHomeOnclick() {
    const js = "location.href='index.html'";
    const targets = document.querySelectorAll(
      'a.back-link, a[data-home-link], #t_back, a[href="index.html"], a[href="./index.html"], .cta-btn[href="index.html"], nav.mobile-bottom-nav a:first-child, [data-home-logo="true"]'
    );
    targets.forEach((el) => {
      if (el.matches('a')) el.setAttribute('href', 'index.html');
      el.setAttribute('onclick', js);
    });
  }

  function enforceHomeLinks() {
    document.querySelectorAll('nav.mobile-bottom-nav').forEach((nav) => {
      const first = nav.querySelector('a:first-child');
      if (first) first.setAttribute('href', 'index.html');
      nav.querySelectorAll('a').forEach((a) => {
        const label = a.textContent.trim();
        if (label === '홈' || label.toLowerCase() === 'home') a.setAttribute('href', 'index.html');
      });
    });

    document.querySelectorAll('a.back-link, a[data-home-link], #t_back, a[href="/"], a[href="./"], a[href="index.html"], a[href="./index.html"], .cta-btn[href="index.html"]').forEach((a) => {
      if (!a.getAttribute('href') || a.getAttribute('href') === '#') return;
      a.setAttribute('href', 'index.html');
    });

    markHomeLogos();
    injectInlineHomeOnclick();
  }

  function bindHomeRouting() {
    const HOME_SELECTOR = 'a[href="index.html"], a[href="./index.html"], a.back-link, a[data-home-link], #t_back, [data-home-logo="true"]';

    const routeHomeNow = (target, event) => {
      if (!target) return;
      if (target.matches('a')) {
        const href = (target.getAttribute('href') || '').trim();
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      }
      event.preventDefault();
      console.info('[jamgong-nav] home tap detected -> index.html');
      goHome(true);
    };

    document.addEventListener('pointerup', (event) => {
      if (event.button !== 0) return;
      routeHomeNow(event.target.closest(HOME_SELECTOR), event);
    }, { capture: true });

    document.addEventListener('click', (event) => {
      routeHomeNow(event.target.closest(HOME_SELECTOR), event);
    }, { capture: true });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      routeHomeNow(event.target.closest('[data-home-logo="true"]'), event);
    });
  }

  window.jamgongGoHome = goHome;
  enforceHomeLinks();
  bindHomeRouting();

  console.info('[jamgong-nav] mobile home link enforcement active');

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
