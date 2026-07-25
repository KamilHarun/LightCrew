// ══════════════════════════════════════════════════════
//  LIGHT CREW AZ — ADMIN PANEL  |  admin.js
//  Single-page app: login + dashboard + team +
//  portfolio + messages + settings
// ══════════════════════════════════════════════════════

const API = 'http://localhost:8080/api';

// ─────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────
const Auth = {
  token:    () => localStorage.getItem('lc_token'),
  email:    () => localStorage.getItem('lc_email'),
  name:     () => localStorage.getItem('lc_fullname'),
  role:     () => localStorage.getItem('lc_role'),
  initials: () => {
    const n = Auth.name() || '';
    return n.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'A';
  },
  set: (data) => {
    localStorage.setItem('lc_token',    data.token);
    localStorage.setItem('lc_email',    data.email);
    localStorage.setItem('lc_fullname', data.fullName);
    localStorage.setItem('lc_role',     data.role);
  },
  clear: () => ['lc_token','lc_email','lc_fullname','lc_role'].forEach(k => localStorage.removeItem(k))
};

// ─────────────────────────────────────────────────────
// API FETCH
// ─────────────────────────────────────────────────────
async function api(method, path, body = null, isFormData = false) {
  const opts = { method, headers: { Authorization: `Bearer ${Auth.token()}` } };
  if (body) {
    if (isFormData) { opts.body = body; }
    else { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  }
  const res  = await fetch(`${API}${path}`, opts);
  const data = await res.json();
  if (res.status === 401) { doLogout(); return null; }
  return data;
}

// ─────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────
const Toast = {
  show(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const icons = { success:'✓', error:'✕', warning:'⚠' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span style="font-size:14px">${icons[type]||'·'}</span>${msg}`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),300); }, 3500);
  },
  success: m => Toast.show(m,'success'),
  error:   m => Toast.show(m,'error'),
  warning: m => Toast.show(m,'warning'),
};

// ─────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────
const Modal = {
  open(html, maxWidth = '560px') {
    const inner = document.getElementById('globalModalInner');
    if (inner) { inner.style.maxWidth = maxWidth; inner.innerHTML = html; }
    document.getElementById('globalModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  close() {
    document.getElementById('globalModal').classList.remove('open');
    document.body.style.overflow = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('globalModal').addEventListener('click', e => {
    if (e.target.id === 'globalModal') Modal.close();
  });

  // MÜVƏQQƏTİ ƏLAVƏ: Səhifə açılanda birbaşa admin panelə keç
  showAdmin();
});

// ─────────────────────────────────────────────────────
// CONFIRM DELETE
// ─────────────────────────────────────────────────────
function confirmDelete(msg) {
  return new Promise(resolve => {
    Modal.open(`
      <div class="modal-header">
        <span class="modal-title" style="color:var(--danger)">⚠ SİLMƏ TƏSDİQİ</span>
      </div>
      <div class="modal-body">
        <p style="font-family:var(--mono);font-size:12px;color:var(--text-2);line-height:1.6">${msg}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost btn-sm" onclick="Modal.close()">LƏĞV ET</button>
        <button class="btn btn-danger btn-sm" id="cnfYes">SİL</button>
      </div>
    `, '360px');
    document.getElementById('cnfYes').onclick = () => { Modal.close(); resolve(true); };
  });
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────
const fmtDate = iso => iso ? new Date(iso).toLocaleDateString('az-AZ',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
const fmtDateShort = iso => iso ? new Date(iso).toLocaleDateString('az-AZ',{day:'2-digit',month:'2-digit',year:'numeric'}) : '—';

function statusBadge(s) {
  const m = { NEW:['badge-red','YENİ'], IN_PROGRESS:['badge-yellow','İŞLƏNİR'], RESOLVED:['badge-green','HƏLL EDİLDİ'], ARCHIVED:['badge-muted','ARXİV'] };
  const [cls, lbl] = m[s] || ['badge-muted', s];
  return `<span class="badge ${cls}">${lbl}</span>`;
}

function categoryBadge(c) {
  const m = { FILM:'badge-blue', COMMERCIAL:'badge-yellow', CLIP:'badge-green' };
  return `<span class="badge ${m[c]||'badge-muted'}">${c}</span>`;
}

function icoSvg(name) {
  const i = {
    edit:  `<svg style="width:12px;height:12px" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"/></svg>`,
    trash: `<svg style="width:12px;height:12px" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/></svg>`,
    eye:   `<svg style="width:12px;height:12px" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></svg>`,
    plus:  `<svg style="width:13px;height:13px" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v10M3 8h10"/></svg>`,
  };
  return i[name] || '';
}

function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const prev  = document.getElementById(previewId);
  if (!input || !prev) return;

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { Toast.error('Yalnız şəkil faylı seçin'); input.value=''; return; }
    const reader = new FileReader();
    reader.onload = e => {
      prev.innerHTML = `<div class="upload-preview"><img src="${e.target.result}"><span class="upload-preview-name">${file.name}</span><button type="button" class="upload-preview-remove" onclick="clearImg('${inputId}','${previewId}')">✕</button></div>`;
    };
    reader.readAsDataURL(file);
  });

  const zone = input.closest('.upload-zone');
  if (zone) {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('dragover');
      if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); }
    });
  }
}

function clearImg(inputId, previewId) {
  const i = document.getElementById(inputId); if (i) i.value = '';
  const p = document.getElementById(previewId); if (p) p.innerHTML = '';
}

// ─────────────────────────────────────────────────────
// LOGIN / LOGOUT
// ─────────────────────────────────────────────────────
async function doLogin() {
  const btn   = document.getElementById('loginBtn');
  const err   = document.getElementById('loginError');
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;

  btn.textContent = 'GİRİŞ...'; btn.classList.add('loading');
  err.classList.remove('visible');

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (data.success) { Auth.set(data.data); showAdmin(); }
    else throw new Error(data.message || 'Email və ya şifrə yanlışdır');
  } catch(e) {
    err.textContent = e.message; err.classList.add('visible');
    btn.textContent = 'GİRİŞ'; btn.classList.remove('loading');
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginPage').style.display !== 'none') doLogin();
});

function doLogout() { Auth.clear(); location.reload(); }

// ─────────────────────────────────────────────────────
// SHOW ADMIN SHELL
// ─────────────────────────────────────────────────────
function showAdmin() {
  document.getElementById('loginPage').style.display   = 'none';
  document.getElementById('adminShell').style.display  = 'flex';

  document.getElementById('sidebarAvatar').textContent = Auth.initials();
  document.getElementById('sidebarName').textContent   = Auth.name()  || 'Admin';
  document.getElementById('sidebarRole').textContent   = Auth.role()  || 'ADMIN';

  // Clock
  const tick = () => {
    const el = document.getElementById('topbarTime');
    if (el) el.textContent = new Date().toLocaleTimeString('az-AZ',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  };
  tick(); setInterval(tick, 1000);

  // Unread badge
  api('GET','/admin/messages/unread-count').then(d => {
    if (d?.success && d.data > 0) {
      const b = document.getElementById('msgBadge');
      if (b) { b.textContent = d.data; b.style.display = 'block'; }
    }
  }).catch(()=>{});

  goTo('dashboard');
}

// ─────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────
const pageNames = { dashboard:'DASHBOARD', team:'KOMANDA', portfolio:'PORTFOLİO', messages:'MESAJLAR', settings:'PARAMETRLƏr' };

function goTo(page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  document.getElementById('topbarPageName').textContent = pageNames[page] || page.toUpperCase();
  document.getElementById('sidebar').classList.remove('open');

  const content = document.getElementById('mainContent');
  content.innerHTML = `<div class="loading-state"><div class="spinner"></div><span class="loading-text">YÜKLƏNIR...</span></div>`;

  const routes = { dashboard: renderDashboard, team: renderTeam, portfolio: renderPortfolio, messages: renderMessages, settings: renderSettings };
  if (routes[page]) routes[page]();
}

// ─────────────────────────────────────────────────────
// PAGE: DASHBOARD
// ─────────────────────────────────────────────────────
async function renderDashboard() {
  const data = await api('GET','/admin/dashboard');
  const content = document.getElementById('mainContent');
  const nameShort = (Auth.name() || 'Admin').split(' ')[0];

  if (!data?.success) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><div class="empty-text">Məlumat yüklənmədi</div></div>`;
    return;
  }

  const d = data.data;
  content.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div>
          <h1 class="page-title">Salam, ${nameShort}! 👋</h1>
          <p class="page-sub">${new Date().toLocaleDateString('az-AZ',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-label">KOMANDA</div>
          <div class="stat-card-value">${d.totalTeamMembers}</div>
          <div class="stat-card-sub">${d.activeTeamMembers} aktiv üzüv</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">LAYİHƏLƏR</div>
          <div class="stat-card-value">${d.totalProjects}</div>
          <div class="stat-card-sub">ümumi portfolio</div>
        </div>
        <div class="stat-card accent">
          <div class="stat-card-label">OXUNMAMIŞLAR</div>
          <div class="stat-card-value">${d.unreadMessages}</div>
          <div class="stat-card-sub">yeni mesaj</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">ÜMUMI MESAJ</div>
          <div class="stat-card-value">${d.totalMessages}</div>
          <div class="stat-card-sub">bütün vaxtlar</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">SON MESAJLAR</span>
          <button class="btn btn-ghost btn-sm" onclick="goTo('messages')">Hamısına bax →</button>
        </div>
        ${!d.recentMessages?.length ? `<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">Mesaj yoxdur</div></div>` : `
        <div class="table-wrap"><table>
          <thead><tr><th>AD SOYAD</th><th>EMAIL</th><th>STATUS</th><th>TARİX</th><th></th></tr></thead>
          <tbody>
            ${d.recentMessages.map(m=>`
              <tr>
                <td><div class="flex gap-8">${!m.read?`<span style="width:6px;height:6px;background:var(--accent);border-radius:50%;flex-shrink:0;margin-top:4px"></span>`:''}<span style="${!m.read?'font-weight:700':''}">${m.fullName}</span></div></td>
                <td class="text-mono" style="font-size:12px;color:var(--text-2)">${m.email}</td>
                <td>${statusBadge(m.status)}</td>
                <td class="text-mono" style="font-size:11px;color:var(--muted)">${fmtDateShort(m.createdAt)}</td>
                <td><button class="btn btn-ghost btn-sm btn-icon" onclick="goTo('messages')" title="Bax">${icoSvg('eye')}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table></div>`}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────
// PAGE: TEAM
// ─────────────────────────────────────────────────────
let _team = [];

async function renderTeam() {
  const data = await api('GET','/admin/team');
  _team = data?.data || [];
  const content = document.getElementById('mainContent');

  content.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div>
          <h1 class="page-title">Komanda</h1>
          <p class="page-sub" id="teamCount">${_team.length} üzüv</p>
        </div>
        <button class="btn btn-primary" onclick="openTeamModal()">
          ${icoSvg('plus')} YENİ ÜZÜV
        </button>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">KOMANDA ÜZVLƏR</span>
          <div class="search-box"><input type="text" id="teamSearch" placeholder="Axtar..." oninput="filterTeam()"></div>
        </div>
        <div id="teamTableWrap"></div>
      </div>
    </div>
  `;

  renderTeamTable(_team);
}

function renderTeamTable(members) {
  const wrap = document.getElementById('teamTableWrap');
  if (!wrap) return;
  if (!members.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">👥</div><div class="empty-text">Üzüv tapılmadı</div></div>`;
    return;
  }
  wrap.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>ÜZÜV</th><th>VƏZİFƏ</th><th>SIRALAMA</th><th>STATUS</th><th>TARİX</th><th style="text-align:right">ƏMƏLİYYAT</th></tr></thead>
    <tbody>
      ${members.map(m=>`
        <tr>
          <td>
            <div class="flex gap-12">
              ${m.photoUrl ? `<img src="${m.photoUrl}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:1px solid var(--border);flex-shrink:0">` : `<div style="width:38px;height:38px;border-radius:50%;background:var(--surface-3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--muted);flex-shrink:0">${m.name.charAt(0)}</div>`}
              <div>
                <div style="font-weight:600">${m.name}</div>
                ${m.bio?`<div style="font-size:11px;color:var(--muted);margin-top:2px">${m.bio.slice(0,50)}${m.bio.length>50?'...':''}</div>`:''}
              </div>
            </div>
          </td>
          <td><span class="badge badge-blue">${m.role}</span></td>
          <td class="text-mono" style="color:var(--muted)">${m.orderIndex}</td>
          <td><span class="badge ${m.active?'badge-green':'badge-red'}">${m.active?'AKTİV':'GİZLİ'}</span></td>
          <td class="text-mono" style="font-size:11px;color:var(--muted)">${fmtDateShort(m.createdAt)}</td>
          <td style="text-align:right">
            <div class="flex gap-8" style="justify-content:flex-end">
              <button class="btn btn-ghost btn-sm btn-icon" onclick="toggleTeamMember(${m.id})" title="${m.active?'Gizlə':'Göstər'}">${m.active?'👁':'🔒'}</button>
              <button class="btn btn-ghost btn-sm btn-icon" onclick="openTeamModal(${m.id})">${icoSvg('edit')}</button>
              <button class="btn btn-danger btn-sm btn-icon" onclick="deleteTeamMember(${m.id},'${m.name.replace(/'/g,"\\'")}')">  ${icoSvg('trash')}</button>
            </div>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
}

function filterTeam() {
  const q = document.getElementById('teamSearch')?.value.toLowerCase() || '';
  renderTeamTable(_team.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)));
}

function openTeamModal(id) {
  const m = id ? _team.find(x => x.id === id) : null;
  Modal.open(`
    <div class="modal-header">
      <span class="modal-title">${m ? 'ÜZVÜ DÜZƏLT' : 'YENİ ÜZÜV'}</span>
      <button class="modal-close" onclick="Modal.close()">✕</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="tm_id" value="${m?.id||''}">
      <div class="form-row">
        <div class="form-group"><label class="form-label">AD *</label><input class="form-input" id="tm_name" value="${m?.name||''}" placeholder="Əli Həsənov"></div>
        <div class="form-group"><label class="form-label">VƏZİFƏ *</label><input class="form-input" id="tm_role" value="${m?.role||''}" placeholder="Gaffer"></div>
      </div>
      <div class="form-row full">
        <div class="form-group"><label class="form-label">BİO</label><textarea class="form-textarea" id="tm_bio" rows="3">${m?.bio||''}</textarea></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">INSTAGRAM</label><input class="form-input" id="tm_insta" value="${m?.instagramUrl||''}" placeholder="https://instagram.com/..."></div>
        <div class="form-group"><label class="form-label">LINKEDIN</label><input class="form-input" id="tm_linkedin" value="${m?.linkedinUrl||''}" placeholder="https://linkedin.com/in/..."></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">SIRALAMA</label><input type="number" class="form-input" id="tm_order" value="${m?.orderIndex||0}" min="0"></div>
        <div class="form-group" style="display:flex;align-items:flex-end;padding-bottom:2px">
          <label class="toggle"><input type="checkbox" id="tm_active" ${m===null||m?.active?'checked':''}><div class="toggle-track"><div class="toggle-thumb"></div></div><span style="font-family:var(--mono);font-size:11px;color:var(--text-2)">AKTİV</span></label>
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label class="form-label">FOTO</label>
          <div class="upload-zone"><input type="file" id="tm_photo" accept="image/*"><div class="upload-icon">🖼</div><div class="upload-text">Şəkil seçin</div><div class="upload-hint">JPG, PNG · Maks 10MB</div></div>
          <div id="tm_photoPreview">${m?.photoUrl?`<div class="upload-preview"><img src="${m.photoUrl}"><span class="upload-preview-name">Mövcud şəkil</span></div>`:''}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="Modal.close()">LƏĞV ET</button>
      <button class="btn btn-primary" id="tm_saveBtn" onclick="saveTeamMember()">YADDA SAXLA</button>
    </div>
  `);
  setupImagePreview('tm_photo','tm_photoPreview');
}

async function saveTeamMember() {
  const btn = document.getElementById('tm_saveBtn');
  btn.textContent = 'SAXLANIR...'; btn.disabled = true;

  const id    = document.getElementById('tm_id').value;
  const photo = document.getElementById('tm_photo').files[0];
  const fd    = new FormData();
  fd.append('name',         document.getElementById('tm_name').value.trim());
  fd.append('role',         document.getElementById('tm_role').value.trim());
  fd.append('bio',          document.getElementById('tm_bio').value.trim());
  fd.append('instagramUrl', document.getElementById('tm_insta').value.trim());
  fd.append('linkedinUrl',  document.getElementById('tm_linkedin').value.trim());
  fd.append('orderIndex',   document.getElementById('tm_order').value);
  fd.append('active',       document.getElementById('tm_active').checked);
  if (photo) fd.append('photo', photo);

  const data = await api(id?'PUT':'POST', id?`/admin/team/${id}`:'/admin/team', fd, true);
  if (data?.success) { Toast.success(id?'Üzüv yeniləndi ✓':'Yeni üzüv əlavə edildi ✓'); Modal.close(); renderTeam(); }
  else { Toast.error(data?.message||'Xəta baş verdi'); btn.textContent='YADDA SAXLA'; btn.disabled=false; }
}

async function toggleTeamMember(id) {
  const d = await api('PATCH',`/admin/team/${id}/toggle`);
  if (d?.success) { Toast.success('Status dəyişdirildi'); renderTeam(); }
  else Toast.error('Xəta');
}

async function deleteTeamMember(id, name) {
  const ok = await confirmDelete(`<strong>${name}</strong> adlı üzvü silmək istədiyinizə əminsiniz?`);
  if (!ok) return;
  const d = await api('DELETE',`/admin/team/${id}`);
  if (d?.success) { Toast.success('Üzüv silindi'); renderTeam(); }
  else Toast.error('Xəta');
}

// ─────────────────────────────────────────────────────
// PAGE: PORTFOLIO
// ─────────────────────────────────────────────────────
let _portfolio = [];
let _pCat = 'ALL';
let _eqArr = [];

async function renderPortfolio() {
  const data = await api('GET','/admin/portfolio');
  _portfolio = data?.data || [];
  const content = document.getElementById('mainContent');

  content.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div><h1 class="page-title">Portfolio</h1><p class="page-sub">${_portfolio.length} layihə</p></div>
        <button class="btn btn-primary" onclick="openProjectModal()">${icoSvg('plus')} YENİ LAYİHƏ</button>
      </div>
      <div class="flex-between" style="margin-bottom:16px;flex-wrap:wrap;gap:12px">
        <div class="tab-bar">
          <button class="tab-btn active" data-cat="ALL"        onclick="switchPCat(this)">HAMISI</button>
          <button class="tab-btn"        data-cat="FILM"       onclick="switchPCat(this)">FİLM</button>
          <button class="tab-btn"        data-cat="COMMERCIAL" onclick="switchPCat(this)">REKLAM</button>
          <button class="tab-btn"        data-cat="CLIP"       onclick="switchPCat(this)">KLİP</button>
        </div>
        <div class="search-box"><input type="text" id="pSearch" placeholder="Axtar..." oninput="filterPortfolio()"></div>
      </div>
      <div class="card"><div id="pTableWrap"></div></div>
    </div>
  `;

  renderPortfolioTable(_portfolio);
}

function switchPCat(btn) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  _pCat = btn.dataset.cat;
  filterPortfolio();
}

function filterPortfolio() {
  const q = document.getElementById('pSearch')?.value.toLowerCase() || '';
  let f = _portfolio;
  if (_pCat !== 'ALL') f = f.filter(p=>p.category===_pCat);
  if (q) f = f.filter(p=>p.title.toLowerCase().includes(q)||(p.description||'').toLowerCase().includes(q));
  renderPortfolioTable(f);
}

function renderPortfolioTable(projects) {
  const wrap = document.getElementById('pTableWrap');
  if (!wrap) return;
  if (!projects.length) { wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">🎬</div><div class="empty-text">Layihə tapılmadı</div></div>`; return; }
  wrap.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>LAYİHƏ</th><th>KATEQORİYA</th><th>TARİX</th><th>STATUS</th><th>ÖNƏ ÇIXAR</th><th style="text-align:right">ƏMƏLİYYAT</th></tr></thead>
    <tbody>
      ${projects.map(p=>`
        <tr>
          <td>
            <div class="flex gap-12">
              ${p.imageUrl?`<img src="${p.imageUrl}" style="width:56px;height:40px;object-fit:cover;border-radius:2px;border:1px solid var(--border);flex-shrink:0">`:`<div style="width:56px;height:40px;background:var(--surface-3);border-radius:2px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🎬</div>`}
              <div><div style="font-weight:600">${p.title}</div>${p.description?`<div style="font-size:11px;color:var(--muted);margin-top:2px">${p.description.slice(0,60)}${p.description.length>60?'...':''}</div>`:''}</div>
            </div>
          </td>
          <td>${categoryBadge(p.category)}</td>
          <td class="text-mono" style="font-size:11px;color:var(--muted)">${fmtDateShort(p.projectDate)}</td>
          <td><span class="badge ${p.active?'badge-green':'badge-red'}">${p.active?'AKTİV':'GİZLİ'}</span></td>
          <td>${p.featured?'<span class="badge badge-yellow">⭐ ÖNƏ</span>':'<span class="text-muted">—</span>'}</td>
          <td style="text-align:right">
            <div class="flex gap-8" style="justify-content:flex-end">
              <button class="btn btn-ghost btn-sm btn-icon" onclick="openProjectModal(${p.id})">${icoSvg('edit')}</button>
              <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProject(${p.id},'${p.title.replace(/'/g,"\\'")}')">  ${icoSvg('trash')}</button>
            </div>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
}

function openProjectModal(id) {
  const p = id ? _portfolio.find(x=>x.id===id) : null;
  _eqArr = p ? [...(p.equipment||[])] : [];

  Modal.open(`
    <div class="modal-header">
      <span class="modal-title">${p?'LAYİHƏNİ DÜZƏLT':'YENİ LAYİHƏ'}</span>
      <button class="modal-close" onclick="Modal.close()">✕</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="pm_id" value="${p?.id||''}">
      <div class="form-row">
        <div class="form-group"><label class="form-label">KATEQORİYA *</label>
          <select class="form-select" id="pm_cat">
            <option value="FILM"       ${p?.category==='FILM'?'selected':''}>Film</option>
            <option value="COMMERCIAL" ${p?.category==='COMMERCIAL'?'selected':''}>Reklam</option>
            <option value="CLIP"       ${p?.category==='CLIP'?'selected':''}>Klip</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">TARİX</label><input type="date" class="form-input" id="pm_date" value="${p?.projectDate||''}"></div>
      </div>
      <div class="form-row full"><div class="form-group"><label class="form-label">BAŞLIQ *</label><input class="form-input" id="pm_title" value="${p?.title||''}" placeholder="Feature Film Lighting..."></div></div>
      <div class="form-row full"><div class="form-group"><label class="form-label">AÇIQLAMA</label><textarea class="form-textarea" id="pm_desc" rows="4">${p?.description||''}</textarea></div></div>
      <div class="form-row full">
        <div class="form-group">
          <label class="form-label">AVADANLIQ</label>
          <div class="eq-input-row">
            <input class="form-input" id="pm_eqInput" placeholder="ARRI SkyPanel S60-C" onkeydown="if(event.key==='Enter'){event.preventDefault();addEq()}">
            <button type="button" class="btn btn-ghost btn-sm" onclick="addEq()">ƏLAVƏ ET</button>
          </div>
          <div id="pm_eqTags" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px"></div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">SIRALAMA</label><input type="number" class="form-input" id="pm_order" value="${p?.orderIndex||0}" min="0"></div>
        <div class="form-group" style="display:flex;align-items:flex-end;gap:16px;padding-bottom:2px">
          <label class="toggle"><input type="checkbox" id="pm_active" ${p===null||p?.active?'checked':''}><div class="toggle-track"><div class="toggle-thumb"></div></div><span style="font-family:var(--mono);font-size:11px;color:var(--text-2)">AKTİV</span></label>
          <label class="toggle"><input type="checkbox" id="pm_featured" ${p?.featured?'checked':''}><div class="toggle-track"><div class="toggle-thumb"></div></div><span style="font-family:var(--mono);font-size:11px;color:var(--text-2)">ÖNƏ ÇIXAR</span></label>
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label class="form-label">ANA ŞƏKİL</label>
          <div class="upload-zone"><input type="file" id="pm_img" accept="image/*"><div class="upload-icon">🖼</div><div class="upload-text">Əsas şəkil seçin</div><div class="upload-hint">1200×800 tövsiyə olunur</div></div>
          <div id="pm_imgPreview">${p?.imageUrl?`<div class="upload-preview"><img src="${p.imageUrl}"><span class="upload-preview-name">Mövcud şəkil</span></div>`:''}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="Modal.close()">LƏĞV ET</button>
      <button class="btn btn-primary" id="pm_saveBtn" onclick="saveProject()">YADDA SAXLA</button>
    </div>
  `, '640px');

  setupImagePreview('pm_img','pm_imgPreview');
  renderEqTags();
}

function addEq() {
  const input = document.getElementById('pm_eqInput');
  const val   = input?.value.trim();
  if (!val || _eqArr.includes(val)) return;
  _eqArr.push(val); input.value = ''; renderEqTags();
}

function removeEq(i) { _eqArr.splice(i,1); renderEqTags(); }

function renderEqTags() {
  const el = document.getElementById('pm_eqTags');
  if (el) el.innerHTML = _eqArr.map((eq,i)=>`<span class="eq-tag" onclick="removeEq(${i})">${eq} ✕</span>`).join('');
}

async function saveProject() {
  const btn = document.getElementById('pm_saveBtn');
  btn.textContent='SAXLANIR...'; btn.disabled=true;

  const id  = document.getElementById('pm_id').value;
  const img = document.getElementById('pm_img').files[0];
  const fd  = new FormData();
  fd.append('category',    document.getElementById('pm_cat').value);
  fd.append('title',       document.getElementById('pm_title').value.trim());
  fd.append('description', document.getElementById('pm_desc').value.trim());
  fd.append('projectDate', document.getElementById('pm_date').value||'');
  fd.append('orderIndex',  document.getElementById('pm_order').value);
  fd.append('active',      document.getElementById('pm_active').checked);
  fd.append('featured',    document.getElementById('pm_featured').checked);
  _eqArr.forEach(eq=>fd.append('equipment',eq));
  if (img) fd.append('mainImage', img);

  const data = await api(id?'PUT':'POST', id?`/admin/portfolio/${id}`:'/admin/portfolio', fd, true);
  if (data?.success) { Toast.success(id?'Layihə yeniləndi ✓':'Yeni layihə əlavə edildi ✓'); Modal.close(); renderPortfolio(); }
  else { Toast.error(data?.message||'Xəta baş verdi'); btn.textContent='YADDA SAXLA'; btn.disabled=false; }
}

async function deleteProject(id, title) {
  const ok = await confirmDelete(`<strong>${title}</strong> layihəsini silmək istədiyinizə əminsiniz?<br><br>Bütün şəkillər Cloudinary-dən silinəcək.`);
  if (!ok) return;
  const d = await api('DELETE',`/admin/portfolio/${id}`);
  if (d?.success) { Toast.success('Layihə silindi'); renderPortfolio(); }
  else Toast.error('Xəta');
}

// ─────────────────────────────────────────────────────
// PAGE: MESSAGES
// ─────────────────────────────────────────────────────
let _msgPage   = 0;
let _msgTotal  = 0;
let _msgStatus = '';
let _msgSelId  = null;
const MSG_SIZE = 20;

async function renderMessages() {
  const content = document.getElementById('mainContent');
  content.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div><h1 class="page-title">Mesajlar</h1><p class="page-sub" id="msgCount">yüklənir...</p></div>
      </div>
      <div class="filter-bar" style="margin-bottom:16px">
        <button class="filter-btn active" data-status=""            onclick="switchMsgFilter(this)">HAMISI</button>
        <button class="filter-btn"        data-status="NEW"         onclick="switchMsgFilter(this)">YENİ</button>
        <button class="filter-btn"        data-status="IN_PROGRESS" onclick="switchMsgFilter(this)">İŞLƏNİR</button>
        <button class="filter-btn"        data-status="RESOLVED"    onclick="switchMsgFilter(this)">HƏLL EDİLDİ</button>
        <button class="filter-btn"        data-status="ARCHIVED"    onclick="switchMsgFilter(this)">ARXİV</button>
      </div>
      <div class="message-layout">
        <div class="card" style="overflow:hidden" id="msgList">
          <div class="loading-state"><div class="spinner"></div></div>
        </div>
        <div class="card" id="msgDetail">
          <div class="empty-detail"><div class="icon">✉️</div><p>Mesaj seçin</p></div>
        </div>
      </div>
      <div class="pagination" id="msgPagination" style="display:none">
        <button class="page-btn" id="msgPrev" onclick="goMsgPage(-1)">‹</button>
        <span id="msgPageInfo" style="font-family:var(--mono);font-size:11px;color:var(--muted);padding:0 12px"></span>
        <button class="page-btn" id="msgNext" onclick="goMsgPage(1)">›</button>
      </div>
    </div>
  `;
  loadMsgList();
}

async function loadMsgList() {
  const listEl = document.getElementById('msgList');
  if (!listEl) return;
  listEl.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;

  const sp   = _msgStatus ? `&status=${_msgStatus}` : '';
  const data = await api('GET',`/admin/messages?page=${_msgPage}&size=${MSG_SIZE}${sp}`);
  if (!data?.success) return;

  const pg    = data.data;
  const items = pg.content || [];
  _msgTotal   = pg.totalPages || 0;

  const cnt = document.getElementById('msgCount');
  if (cnt) cnt.textContent = `${pg.totalElements||0} mesaj`;

  const pgBar = document.getElementById('msgPagination');
  if (pgBar) {
    if (_msgTotal > 1) {
      pgBar.style.display = 'flex';
      document.getElementById('msgPageInfo').textContent = `${_msgPage+1} / ${_msgTotal}`;
      document.getElementById('msgPrev').disabled = _msgPage === 0;
      document.getElementById('msgNext').disabled = _msgPage >= _msgTotal - 1;
    } else { pgBar.style.display = 'none'; }
  }

  if (!items.length) { listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">Mesaj tapılmadı</div></div>`; return; }

  listEl.innerHTML = items.map(m=>`
    <div class="msg-item ${!m.read?'unread':''} ${m.id===_msgSelId?'active':''}" onclick="openMsg(${m.id})" id="msgItem${m.id}">
      ${!m.read?'<div class="unread-dot"></div>':''}
      <div class="msg-sender">${m.fullName}</div>
      <div class="msg-email">${m.email}</div>
      <div class="msg-preview">${m.message}</div>
      <div class="msg-meta"><span class="msg-time">${fmtDateShort(m.createdAt)}</span>${statusBadge(m.status)}</div>
    </div>
  `).join('');
}

async function openMsg(id) {
  _msgSelId = id;
  document.querySelectorAll('.msg-item').forEach(el=>el.classList.remove('active'));
  document.getElementById(`msgItem${id}`)?.classList.add('active');

  const detail = document.getElementById('msgDetail');
  if (detail) detail.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;

  const data = await api('GET',`/admin/messages/${id}`);
  if (!data?.success || !detail) return;
  const m = data.data;

  const li = document.getElementById(`msgItem${id}`);
  if (li) { li.classList.remove('unread'); li.querySelector('.unread-dot')?.remove(); }

  detail.innerHTML = `
    <div class="detail-card">
      <div class="flex-between" style="margin-bottom:20px;flex-wrap:wrap;gap:10px">
        <div><div class="detail-name">${m.fullName}</div><div class="detail-email">${m.email}</div></div>
        <div class="flex gap-8">${statusBadge(m.status)}<button class="btn btn-danger btn-sm" onclick="deleteMsg(${m.id})">${icoSvg('trash')} SİL</button></div>
      </div>
      <div class="detail-row"><span class="detail-key">TELEFON</span><span style="font-family:var(--mono);font-size:12px">${m.phone||'—'}</span></div>
      <div class="detail-row"><span class="detail-key">TARİX</span><span style="font-family:var(--mono);font-size:12px">${fmtDate(m.createdAt)}</span></div>
      <div class="detail-body">${m.message}</div>
      <div class="divider"></div>
      <p class="form-label" style="margin-bottom:10px">STATUS DƏYİŞ</p>
      <div class="flex gap-8" style="flex-wrap:wrap;margin-bottom:16px">
        ${['NEW','IN_PROGRESS','RESOLVED','ARCHIVED'].map(s=>`
          <button class="filter-btn ${m.status===s?'active':''}" onclick="changeMsgStatus(${m.id},'${s}',this)">${{NEW:'YENİ',IN_PROGRESS:'İŞLƏNİR',RESOLVED:'HƏLL EDİLDİ',ARCHIVED:'ARXİV'}[s]}</button>
        `).join('')}
      </div>
      <p class="form-label" style="margin-bottom:8px">ADMIN QEYDI</p>
      <textarea class="note-area" id="noteArea${m.id}">${m.adminNote||''}</textarea>
      <div style="text-align:right;margin-top:8px">
        <button class="btn btn-ghost btn-sm" onclick="saveMsgNote(${m.id})">QEYDİ SAXLA</button>
      </div>
      <div class="divider"></div>
      <div style="text-align:right">
        <a href="mailto:${m.email}?subject=Re: Light Crew AZ" class="btn btn-primary btn-sm">✉ EMAIL GÖNDƏR</a>
      </div>
    </div>
  `;
}

async function changeMsgStatus(id, status, btn) {
  const d = await api('PATCH',`/admin/messages/${id}/status`,{status});
  if (d?.success) {
    Toast.success('Status dəyişdirildi');
    document.querySelectorAll('#msgDetail .filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    loadMsgList();
  } else Toast.error('Xəta');
}

async function saveMsgNote(id) {
  const note = document.getElementById(`noteArea${id}`)?.value;
  const d    = await api('PATCH',`/admin/messages/${id}/status`,{adminNote:note});
  if (d?.success) Toast.success('Qeyd saxlandı ✓'); else Toast.error('Xəta');
}

async function deleteMsg(id) {
  const ok = await confirmDelete('Bu mesajı silmək istədiyinizə əminsiniz?');
  if (!ok) return;
  const d = await api('DELETE',`/admin/messages/${id}`);
  if (d?.success) {
    Toast.success('Mesaj silindi');
    _msgSelId = null;
    const det = document.getElementById('msgDetail');
    if (det) det.innerHTML = `<div class="empty-detail"><div class="icon">✉️</div><p>Mesaj seçin</p></div>`;
    loadMsgList();
  } else Toast.error('Xəta');
}

function switchMsgFilter(btn) {
  document.querySelectorAll('.filter-bar .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  _msgStatus = btn.dataset.status; _msgPage = 0;
  loadMsgList();
}

function goMsgPage(dir) {
  _msgPage = Math.max(0, Math.min(_msgTotal-1, _msgPage+dir));
  loadMsgList();
}

// ─────────────────────────────────────────────────────
// PAGE: SETTINGS
// ─────────────────────────────────────────────────────
async function renderSettings() {
  const content = document.getElementById('mainContent');
  content.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div><h1 class="page-title">Parametrlər</h1><p class="page-sub">Sayt məlumatları və konfiqurasiya</p></div>
        <button class="btn btn-primary" onclick="saveSettings()">💾 YADDA SAXLA</button>
      </div>
      <div class="settings-layout">
        <div class="settings-nav">
          <button class="s-nav-btn active" data-tab="contact" onclick="switchStab(this)">📞 Əlaqə</button>
          <button class="s-nav-btn" data-tab="social"  onclick="switchStab(this)">📸 Sosial Media</button>
          <button class="s-nav-btn" data-tab="seo"     onclick="switchStab(this)">🔍 SEO</button>
          <button class="s-nav-btn" data-tab="account" onclick="switchStab(this)">👤 Hesab</button>
        </div>
        <div id="settingsBody">
          <div class="loading-state"><div class="spinner"></div></div>
        </div>
      </div>
    </div>
  `;

  const data = await api('GET','/admin/settings');
  const s = data?.data || {};

  document.getElementById('settingsBody').innerHTML = `
    <!-- Contact -->
    <div class="settings-section active" id="stab-contact">
      <div class="settings-group">
        <div class="settings-group-header">ƏLAQƏ MƏLUMATları</div>
        ${settingsRow('Telefon','Saytda göstəriləcək nömrə','phone','text',s.phone,'+994 XX XXX XX XX')}
        ${settingsRow('Email','Əsas email ünvanı','email','email',s.email,'info@lightcrewaz.com')}
        ${settingsRow('Ünvan','Fiziki ünvan','address','text',s.address,'Baku, Azerbaijan')}
        ${settingsRow('Haqqında','Footer alt başlığı','about_text','text',s.about_text,'Professional Gaffer Services...')}
      </div>
    </div>
    <!-- Social -->
    <div class="settings-section" id="stab-social">
      <div class="settings-group">
        <div class="settings-group-header">SOSİAL MEDİA LİNKLƏRİ</div>
        ${settingsRow('Instagram','Tam URL','instagram_url','url',s.instagram_url,'https://instagram.com/lightcrewaz')}
        ${settingsRow('Vimeo','Portfolio videoları','vimeo_url','url',s.vimeo_url,'https://vimeo.com/...')}
        ${settingsRow('LinkedIn','Peşəkar şəbəkə','linkedin_url','url',s.linkedin_url,'https://linkedin.com/company/...')}
      </div>
    </div>
    <!-- SEO -->
    <div class="settings-section" id="stab-seo">
      <div class="settings-group">
        <div class="settings-group-header">SEO & META</div>
        ${settingsRow('Meta Başlıq','Brauzer tab başlığı','meta_title','text',s.meta_title,'Light Crew AZ | Gaffer Services')}
        <div class="settings-row">
          <div><div class="settings-key">Meta Açıqlama</div><div class="settings-desc">Axtarış nəticələri üçün</div></div>
          <textarea class="form-textarea" data-key="meta_description" rows="3">${s.meta_description||''}</textarea>
        </div>
      </div>
    </div>
    <!-- Account -->
    <div class="settings-section" id="stab-account">
      <div class="settings-group">
        <div class="settings-group-header">ŞİFRƏ DƏYİŞDİR</div>
        <div class="settings-row"><div><div class="settings-key">Email</div></div><input class="form-input" value="${Auth.email()||''}" readonly style="opacity:.5;cursor:not-allowed"></div>
        <div class="settings-row"><div><div class="settings-key">Cari Şifrə</div></div><input type="password" class="form-input" id="s_curPwd" placeholder="••••••••"></div>
        <div class="settings-row"><div><div class="settings-key">Yeni Şifrə</div></div><input type="password" class="form-input" id="s_newPwd" placeholder="••••••••"></div>
        <div class="settings-row"><div><div class="settings-key">Təkrar Şifrə</div></div><input type="password" class="form-input" id="s_newPwd2" placeholder="••••••••"></div>
        <div style="padding:12px 20px;display:flex;justify-content:flex-end">
          <button class="btn btn-primary" onclick="changePassword()">ŞİFRƏNİ DƏYİŞ</button>
        </div>
      </div>
      <div class="settings-group">
        <div class="settings-group-header">SİSTEM MƏLUMATLARı</div>
        <div class="settings-row"><div><div class="settings-key">API URL</div></div><code style="font-family:var(--mono);font-size:12px;color:var(--accent)">${API}</code></div>
        <div class="settings-row"><div><div class="settings-key">Rolunuz</div></div><span class="badge badge-blue">${Auth.role()||'ADMIN'}</span></div>
      </div>
    </div>
  `;
}

function settingsRow(key, desc, dataKey, type, val, placeholder) {
  return `<div class="settings-row"><div><div class="settings-key">${key}</div><div class="settings-desc">${desc}</div></div><input type="${type}" class="form-input" data-key="${dataKey}" value="${val||''}" placeholder="${placeholder}"></div>`;
}

function switchStab(btn) {
  document.querySelectorAll('.s-nav-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.settings-section').forEach(s=>s.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`stab-${btn.dataset.tab}`)?.classList.add('active');
}

async function saveSettings() {
  const updates = {};
  document.querySelectorAll('[data-key]').forEach(el=>{ updates[el.dataset.key]=el.value.trim(); });
  const d = await api('PUT','/admin/settings',updates);
  if (d?.success) Toast.success('Parametrlər saxlandı ✓'); else Toast.error(d?.message||'Xəta');
}

function changePassword() {
  const cur  = document.getElementById('s_curPwd')?.value;
  const nw   = document.getElementById('s_newPwd')?.value;
  const nw2  = document.getElementById('s_newPwd2')?.value;
  if (!cur||!nw||!nw2) { Toast.warning('Bütün sahələri doldurun'); return; }
  if (nw !== nw2)       { Toast.error('Şifrələr uyğun gəlmir'); return; }
  if (nw.length < 8)    { Toast.error('Şifrə ən azı 8 simvol olmalıdır'); return; }
  Toast.warning('Backend-də /admin/auth/change-password endpoint-ini əlavə edin');
}

// ─────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────
if (Auth.token()) {
  showAdmin();
} else {
  document.getElementById('loginPage').style.display  = 'block';
  document.getElementById('adminShell').style.display = 'none';
}