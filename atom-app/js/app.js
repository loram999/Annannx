/* ZenoATom Web Clone — App logic */

// ═══════════════════════════════════════════════════════════════
// Global error reporter — surfaces JS errors on screen
// ═══════════════════════════════════════════════════════════════
window.addEventListener('error', (e) => {
  const banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#900;color:#fff;padding:10px;font-size:12px;z-index:9999;font-family:monospace;white-space:pre-wrap;word-break:break-all;';
  banner.textContent = 'JS Error: ' + (e.message || e.error || e) + ' @ ' + (e.filename || '') + ':' + (e.lineno || '');
  document.body.appendChild(banner);
});
window.addEventListener('unhandledrejection', (e) => {
  const banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#900;color:#fff;padding:10px;font-size:12px;z-index:9999;font-family:monospace;white-space:pre-wrap;word-break:break-all;';
  banner.textContent = 'Promise Error: ' + (e.reason && e.reason.message ? e.reason.message : e.reason);
  document.body.appendChild(banner);
});
console.log('[atom] app.js loaded');

// ═══════════════════════════════════════════════════════════════
// Storage helpers (mirror SharedPreferences zenoatom_prefs / cityrun_prefs)
// ═══════════════════════════════════════════════════════════════

const K = {
  ACCOUNTS: 'zenoatom.accounts',     // [{msisdn, name, points, active}]
  ACTIVE:   'zenoatom.active',       // msisdn of active account
  HISTORY:  'zenoatom.history',      // [{date, type, title, amount, icon}]
  CLAIMED:  'zenoatom.claimed',      // {YYYY-MM-DD: bool}
  OTP_PENDING: 'zenoatom.otp_pending', // msisdn waiting for verify
  POINTS_TOTAL: 'zenoatom.points_total',
  SESSION:  'zenoatom.session'       // {token, msisdn, exp}
};

function _load(k, def) {
  try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); }
  catch (e) { return def; }
}
function _save(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); }
  catch (e) {}
}

const State = {
  msisdn: '',
  accounts: _load(K.ACCOUNTS, []),
  active: _load(K.ACTIVE, null),
  history: _load(K.HISTORY, []),
  claimed: _load(K.CLAIMED, {}),
  otp: _load(K.OTP_PENDING, null),
  session: _load(K.SESSION, null),
};

// Seed with a demo account on first load
if (State.accounts.length === 0) {
  const demo = {
    msisdn: '959777000000',
    name: 'Demo User',
    points: 1250,
    active: true,
    createdAt: new Date().toISOString()
  };
  State.accounts = [demo];
  State.active = demo.msisdn;
  _save(K.ACCOUNTS, State.accounts);
  _save(K.ACTIVE, State.active);
  // Seed history
  State.history = [
    { date: '2026-08-12 14:23', type: 'claim', icon: '🎁', title: 'Mystery Box', amount: 500 },
    { date: '2026-08-11 10:05', type: 'game',  icon: '🎮', title: 'Toh-Toh v68', amount: 150 },
    { date: '2026-08-10 21:42', type: 'bonus', icon: '🎁', title: 'Daily Bonus', amount: 50 },
    { date: '2026-08-09 09:11', type: 'game',  icon: '🎮', title: 'City Run', amount: 200 },
    { date: '2026-08-08 18:00', type: 'claim', icon: '🎁', title: 'Mystery Box', amount: 350 },
  ];
  _save(K.HISTORY, State.history);
}

// Persist on change
function persistAccounts() { _save(K.ACCOUNTS, State.accounts); _save(K.ACTIVE, State.active); }
function persistHistory()  { _save(K.HISTORY, State.history); }
function persistClaimed()  { _save(K.CLAIMED, State.claimed); }

function currentAccount() {
  return State.accounts.find(a => a.msisdn === State.active) || State.accounts[0] || null;
}

function totalPoints() {
  return State.accounts.reduce((s, a) => s + (a.points || 0), 0);
}

// ═══════════════════════════════════════════════════════════════
// UI helpers
// ═══════════════════════════════════════════════════════════════

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + name);
  if (target) target.classList.add('active');

  // Update bottom nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navMap = { dashboard:0, claim:1, history:2, accounts:3, profile:4 };
  if (navMap[name] !== undefined) {
    document.querySelectorAll('.nav-item')[navMap[name]].classList.add('active');
  }

  // Specific renders
  if (name === 'dashboard') renderDashboard();
  if (name === 'history')   renderHistory();
  if (name === 'accounts')  renderAccounts();
  if (name === 'profile')   renderProfile();
  if (name === 'claim')     renderClaim();
  if (name === 'otp')       setupOtp();

  // Hide topbar on splash
  const tb = document.getElementById('topbar');
  tb.style.display = (name === 'splash' || name === 'cityrun') ? 'none' : 'flex';

  // Show/hide bottomnav
  const bn = document.getElementById('bottomnav');
  bn.style.display = ['login','otp','splash','cityrun'].includes(name) ? 'none' : 'grid';

  window.scrollTo(0, 0);
}

function showToast(msg, ms = 2200) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), ms);
}

function showDialog(title, msg, onOk, okLabel = 'OK', cancelLabel = null, onCancel = null) {
  const back = document.createElement('div');
  back.className = 'dialog-back';
  const dlg = document.createElement('div');
  dlg.className = 'dialog';
  let html = `<h3>${title}</h3><p>${msg}</p>`;
  if (cancelLabel) {
    html += `<div class="row"><button class="btn btn-outline" id="dlg-cancel">${cancelLabel}</button><button class="btn" id="dlg-ok">${okLabel}</button></div>`;
  } else {
    html += `<button class="btn" id="dlg-ok">${okLabel}</button>`;
  }
  dlg.innerHTML = html;
  back.appendChild(dlg);
  document.body.appendChild(back);
  function close() { back.remove(); }
  dlg.querySelector('#dlg-ok').onclick = () => { close(); if (onOk) onOk(); };
  if (cancelLabel) dlg.querySelector('#dlg-cancel').onclick = () => { close(); if (onCancel) onCancel(); };
}

// ═══════════════════════════════════════════════════════════════
// Mirror of "msisdn=959xxx" → "09xxx" conversion (AccountsActivity.k)
// ═══════════════════════════════════════════════════════════════

function normalizeMsisdn(raw) {
  if (!raw) return '';
  if (raw.startsWith('959')) return '0' + raw.substring(3);
  return raw;
}

function isValidMyanmarMsisdn(s) {
  return /^09\d{8,9}$/.test(s) || /^959\d{8,9}$/.test(s);
}

// ═══════════════════════════════════════════════════════════════
// Login / OTP flow (mirror /local-auth/send-otp + /verify-otp)
// ═══════════════════════════════════════════════════════════════

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const phoneRaw = document.getElementById('phoneInput').value.trim();
  if (!isValidMyanmarMsisdn(phoneRaw)) {
    showToast('Phone format မှားနေပါသည် (09xxxxxxxx)');
    return;
  }
  const msisdn = phoneRaw.startsWith('959') ? phoneRaw : '959' + phoneRaw.replace(/^0+/, '');
  State.msisdn = msisdn;
  State.otp = { msisdn, code: '123456', expiresAt: Date.now() + 60000 };
  _save(K.OTP_PENDING, State.otp);

  // In a real app, the OTP would come from SMS via /local-auth/send-otp.
  // Demo: surface the OTP on the OTP screen for easy testing.
  showToast('OTP ပို့ပြီးပါပြီ (Demo: 123456)');
  showScreen('otp');
});

// ═══════════════════════════════════════════════════════════════
// OTP input — auto-advance, paste support
// ═══════════════════════════════════════════════════════════════

function setupOtp() {
  const inputs = document.querySelectorAll('.otp-row input');
  inputs.forEach((inp, i) => {
    inp.value = '';
    inp.oninput = () => {
      if (inp.value && i < inputs.length - 1) inputs[i+1].focus();
      if ([...inputs].every(i => i.value.length === 1)) verifyOtp();
    };
    inp.onkeydown = (e) => {
      if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i-1].focus();
    };
    inp.onpaste = (e) => {
      e.preventDefault();
      const data = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      data.split('').forEach((c, i) => { if (inputs[i]) inputs[i].value = c; });
      inputs[Math.min(data.length, inputs.length-1)].focus();
      if (data.length === 6) verifyOtp();
    };
  });
  document.getElementById('otpPhoneDisplay').textContent = normalizeMsisdn(State.msisdn);
  setTimeout(() => inputs[0].focus(), 100);
}

function verifyOtp() {
  const inputs = document.querySelectorAll('.otp-row input');
  const code = [...inputs].map(i => i.value).join('');
  if (!State.otp || Date.now() > State.otp.expiresAt) {
    showToast('OTP သက်တမ်းကုန်သွားပါပြီ');
    return;
  }
  if (code !== State.otp.code) {
    showToast('OTP မှားနေပါသည်');
    return;
  }
  // Success — log in or add account
  const msisdn = State.otp.msisdn;
  let acc = State.accounts.find(a => a.msisdn === msisdn);
  if (!acc) {
    acc = {
      msisdn, name: 'Atom User ' + msisdn.slice(-4),
      points: 100,
      active: true,
      createdAt: new Date().toISOString()
    };
    State.accounts.push(acc);
    State.active = msisdn;
    persistAccounts();
  } else {
    State.active = msisdn;
    acc.active = true;
    State.accounts.forEach(a => a.active = (a.msisdn === msisdn));
    persistAccounts();
  }
  State.session = { token: 'mock_' + Math.random().toString(36).slice(2), msisdn, exp: Date.now() + 86400000 };
  _save(K.SESSION, State.session);
  State.otp = null;
  _save(K.OTP_PENDING, null);
  showToast('လော့ဂ်အင် အောင်မြင်ပါသည်');
  showScreen('dashboard');
}

document.getElementById('resendOtpBtn').addEventListener('click', () => {
  State.otp = { msisdn: State.msisdn, code: '123456', expiresAt: Date.now() + 60000 };
  _save(K.OTP_PENDING, State.otp);
  showToast('OTP ပြန်ပို့ပြီးပါပြီ (Demo: 123456)');
});

// ═══════════════════════════════════════════════════════════════
// Dashboard
// ═══════════════════════════════════════════════════════════════

function renderDashboard() {
  const acc = currentAccount();
  if (!acc) return;
  document.getElementById('dashBalance').innerHTML = `<span style="font-size:28px;font-weight:800;">${acc.points.toLocaleString()}</span><span style="font-size:14px;opacity:.7;"> pts</span>`;
  document.getElementById('dashPhone').textContent = normalizeMsisdn(acc.msisdn);
  document.getElementById('dashName').textContent = acc.name;

  // Today's claim status
  const todayKey = new Date().toISOString().slice(0, 10);
  const claimed = State.claimed[todayKey];
  document.getElementById('dashClaimStatus').textContent = claimed ? `ယနေ့ claim ပြီးပါပြီ (+${claimed})` : 'ယနေ့ ထပ်ရနိုင်ပါသည်';

  // Recent history (3 items)
  const recent = State.history.slice(0, 3);
  document.getElementById('dashRecent').innerHTML = recent.length === 0
    ? '<div class="text-dim text-center" style="padding:14px;">History မရှိသေးပါ</div>'
    : recent.map(h => `
      <div class="history-item">
        <div class="ic ${h.type}">${h.icon || '•'}</div>
        <div class="grow">
          <div class="title">${h.title}</div>
          <div class="meta">${h.date}</div>
        </div>
        <div class="amount plus">+${h.amount}</div>
      </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// Claim (Mystery Box)
// ═══════════════════════════════════════════════════════════════

function renderClaim() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const isClaimed = !!State.claimed[todayKey];
  const box = document.getElementById('giftBox');
  box.classList.toggle('opened', isClaimed);

  document.getElementById('claimBtn').disabled = isClaimed;
  document.getElementById('claimBtn').textContent = isClaimed ? 'ယနေ့ ပြန်ရမည့်အချိန်ကျန်သည်' : 'Claim Now';
  document.getElementById('claimHint').textContent = isClaimed
    ? `ယနေ့ +${State.claimed[todayKey]} pts ရယူပြီးပါပြီ`
    : 'Mystery box ဖွင့်ပြီး points ရယူပါ';
}

document.getElementById('giftBox').addEventListener('click', () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  if (State.claimed[todayKey]) return;
  if (!confirm('Mystery box ဖွင့်မည်လား?')) return;
  doClaim();
});

document.getElementById('claimBtn').addEventListener('click', () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  if (State.claimed[todayKey]) return;
  doClaim();
});

function doClaim() {
  const todayKey = new Date().toISOString().slice(0, 10);
  // Random reward 50-500 — matching the APK's mystery-box feel
  const reward = 50 + Math.floor(Math.random() * 451);
  const acc = currentAccount();
  if (!acc) return;

  acc.points += reward;
  State.claimed[todayKey] = reward;
  State.history.unshift({
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    type: 'claim', icon: '🎁',
    title: 'Mystery Box',
    amount: reward
  });
  persistAccounts();
  persistClaimed();
  persistHistory();
  renderClaim();
  showToast(`+${reward} pts ရရှိပါပြီ!`);
}

// ═══════════════════════════════════════════════════════════════
// History
// ═══════════════════════════════════════════════════════════════

function renderHistory() {
  const list = document.getElementById('historyList');
  if (State.history.length === 0) {
    list.innerHTML = '<div class="text-dim text-center" style="padding:20px;">မှတ်တမ်း မရှိသေးပါ</div>';
    return;
  }
  list.innerHTML = State.history.map(h => `
    <div class="history-item">
      <div class="ic ${h.type}">${h.icon || '•'}</div>
      <div class="grow">
        <div class="title">${h.title}</div>
        <div class="meta">${h.date}</div>
      </div>
      <div class="amount plus">+${h.amount}</div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════════════
// Accounts / Switch
// ═══════════════════════════════════════════════════════════════

function renderAccounts() {
  const list = document.getElementById('accountsList');
  list.innerHTML = State.accounts.map(a => `
    <div class="account ${a.msisdn === State.active ? 'active' : ''}" data-msisdn="${a.msisdn}">
      <div class="av">${(a.name||'?').slice(-2).toUpperCase()}</div>
      <div class="meta">
        <div class="name">${a.name || 'User'}</div>
        <div class="phone">${normalizeMsisdn(a.msisdn)}</div>
      </div>
      ${a.msisdn === State.active ? '<div class="badge">Active</div>' : ''}
    </div>
  `).join('') + `
    <div class="add-account mt-12" id="addAccountBtn">
      <span style="font-size:18px;margin-right:8px;">+</span> အကောင့်အသစ်ထည့်ပါ
    </div>
  `;

  list.querySelectorAll('.account').forEach(el => {
    el.onclick = () => switchAccount(el.dataset.msisdn);
  });
  document.getElementById('addAccountBtn').onclick = () => showScreen('login');
}

function switchAccount(msisdn) {
  State.active = msisdn;
  State.accounts.forEach(a => a.active = (a.msisdn === msisdn));
  persistAccounts();
  renderAccounts();
  showToast('အကောင့် ပြောင်းပြီးပါပြီ');
}

// ═══════════════════════════════════════════════════════════════
// Profile / Logout
// ═══════════════════════════════════════════════════════════════

function renderProfile() {
  const acc = currentAccount();
  if (!acc) return;
  document.getElementById('profileName').textContent = acc.name;
  document.getElementById('profilePhone').textContent = normalizeMsisdn(acc.msisdn);
  document.getElementById('profilePoints').textContent = acc.points.toLocaleString();
  document.getElementById('profileJoined').textContent = new Date(acc.createdAt).toLocaleDateString();
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  showDialog('ထွက်မည်', 'လော့ဂ်အောက် ထွက်မှာ သေချာပါသလား?', () => {
    State.session = null;
    State.active = null;
    State.accounts.forEach(a => a.active = false);
    _save(K.SESSION, null);
    persistAccounts();
    showScreen('login');
  }, 'ထွက်မည်', 'မထွက်ပါ', null);
});

// ═══════════════════════════════════════════════════════════════
// CityRun WebView (mirror CityRunActivity.onCreate loadUrl)
// ═══════════════════════════════════════════════════════════════

function openCityRun() {
  showScreen('cityrun');
  // The original WebView loads blatom.cityrun.pro to auto-detect MSISDN via carrier redirect.
  // Since we already have MSISDN from login, we just dump it via postMessage from iframe.
  const url = `https://cityrun.pro/?msisdn=${State.active || ''}&source=atom_web`;
  document.getElementById('cityrunUrl').textContent = url;
  document.getElementById('cityrunFrame').src = url;
}

document.getElementById('cityrunBack').addEventListener('click', () => showScreen('dashboard'));

// ═══════════════════════════════════════════════════════════════
// Splash → Login / Dashboard (auto-resume)
// ═══════════════════════════════════════════════════════════════

function boot() {
  // splash visible 1.4s, then auto-route
  setTimeout(() => {
    if (State.session && State.session.exp > Date.now() && State.active) {
      showScreen('dashboard');
    } else {
      showScreen('login');
    }
  }, 1400);
}

boot();
