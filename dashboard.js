/* =============================================
   dashboard.js — رابط لوحة التحكم بالـ API
   dashboard.js — connecte le dashboard à l'API (opportunités + candidatures)
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'http://localhost:5000/api';
  const token = localStorage.getItem('opportune_token');
  if (!token) return; // script.js s'occupe déjà de la redirection vers login.html

  const typeIcons = {
    Job: '🎓',
    Internship: '🏢',
    Volunteer: '🌍',
    Remote: '💻'
  };

  let opportunitiesCache = [];
  let applicationsCache = [];

  /* =============================================
     Chargement des opportunités
     ============================================= */
  async function loadOpportunities() {
    const grid = document.getElementById('opportunitiesGrid');
    try {
      const response = await fetch(API_BASE + '/opportunities', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        grid.innerHTML = '<p>Unable to load opportunities right now.</p>';
        return;
      }

      opportunitiesCache = result.data;
      renderOpportunities();
      updateStats();
    } catch (err) {
      console.error('Erreur de chargement des opportunités:', err);
      grid.innerHTML = '<p>Cannot reach the server. Make sure the backend is running.</p>';
    }
  }

  function renderOpportunities() {
    const grid = document.getElementById('opportunitiesGrid');
    if (!opportunitiesCache.length) {
      grid.innerHTML = '<p>No opportunities available right now.</p>';
      return;
    }

    const appliedIds = new Set(applicationsCache.map((a) => a.opportunity && a.opportunity._id));

    grid.innerHTML = opportunitiesCache
      .map((opp) => {
        const icon = typeIcons[opp.type] || '🏢';
        const typeClass = opp.type.toLowerCase();
        const alreadyApplied = appliedIds.has(opp._id);

        return (
          '<div class="opportunity-card">' +
          '<div class="opp-header">' +
          '<div class="opp-company">' + icon + ' ' + escapeHtml(opp.company) + '</div>' +
          '<div class="opp-type ' + typeClass + '">' + opp.type + '</div>' +
          '</div>' +
          '<h3 class="opp-title">' + escapeHtml(opp.title) + '</h3>' +
          '<div class="opp-details">' +
          '<span>📍 ' + escapeHtml(opp.location) + '</span>' +
          '<span>🕐 ' + escapeHtml(opp.duration || '—') + '</span>' +
          '<span>💰 ' + escapeHtml(opp.salary || '—') + '</span>' +
          '</div>' +
          '<div class="opp-footer">' +
          '<span class="opp-match">' + opp.match + '% match</span>' +
          '<button class="btn-apply" data-id="' + opp._id + '" ' + (alreadyApplied ? 'disabled' : '') + '>' +
          (alreadyApplied ? 'Applied ✓' : 'Apply ⚡') +
          '</button>' +
          '</div>' +
          '</div>'
        );
      })
      .join('');

    grid.querySelectorAll('.btn-apply').forEach((btn) => {
      btn.addEventListener('click', function () {
        applyToOpportunity(this.dataset.id, this);
      });
    });
  }

  /* =============================================
     Postuler à une opportunité
     ============================================= */
  async function applyToOpportunity(opportunityId, btn) {
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';

    try {
      const response = await fetch(API_BASE + '/applications/' + opportunityId, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token }
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || 'Unable to apply right now.');
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      btn.textContent = 'Applied ✓';
      await loadApplications();
      renderOpportunities();
      updateStats();
    } catch (err) {
      console.error('Erreur lors de la candidature:', err);
      alert('Cannot reach the server. Make sure the backend is running.');
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }

  /* =============================================
     Chargement des candidatures
     ============================================= */
  async function loadApplications() {
    try {
      const response = await fetch(API_BASE + '/applications', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const result = await response.json();

      if (!response.ok || !result.success) return;

      applicationsCache = result.data;
      renderApplications();
    } catch (err) {
      console.error('Erreur de chargement des candidatures:', err);
    }
  }

  function renderApplications() {
    const container = document.getElementById('applicationsContainer');

    if (!applicationsCache.length) {
      container.innerHTML =
        '<div class="dash-empty">' +
        '<div class="dash-empty-icon">📭</div>' +
        "<p>You haven't applied to any opportunity yet.</p>" +
        '<p class="dash-empty-sub">Applications will appear here once you apply from the list above.</p>' +
        '</div>';
      return;
    }

    container.innerHTML =
      '<div class="opportunities-grid">' +
      applicationsCache
        .map((app) => {
          const opp = app.opportunity || {};
          return (
            '<div class="opportunity-card">' +
            '<div class="opp-header">' +
            '<div class="opp-company">🏢 ' + escapeHtml(opp.company || 'N/A') + '</div>' +
            '<div class="opp-type">' + app.status + '</div>' +
            '</div>' +
            '<h3 class="opp-title">' + escapeHtml(opp.title || 'Opportunity removed') + '</h3>' +
            '<div class="opp-details">' +
            '<span>📍 ' + escapeHtml(opp.location || '—') + '</span>' +
            '<span>📅 ' + new Date(app.appliedAt).toLocaleDateString() + '</span>' +
            '</div>' +
            '<div class="opp-footer">' +
            '<button class="btn-apply" data-withdraw="' + app._id + '">Withdraw</button>' +
            '</div>' +
            '</div>'
          );
        })
        .join('') +
      '</div>';

    container.querySelectorAll('[data-withdraw]').forEach((btn) => {
      btn.addEventListener('click', function () {
        withdrawApplication(this.dataset.withdraw);
      });
    });
  }

  /* =============================================
     Retirer une candidature
     ============================================= */
  async function withdrawApplication(applicationId) {
    if (!confirm('Withdraw this application?')) return;

    try {
      const response = await fetch(API_BASE + '/applications/' + applicationId, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || 'Unable to withdraw right now.');
        return;
      }

      await loadApplications();
      renderOpportunities();
      updateStats();
    } catch (err) {
      console.error('Erreur lors du retrait:', err);
      alert('Cannot reach the server. Make sure the backend is running.');
    }
  }

  /* =============================================
     Mise à jour des statistiques
     ============================================= */
  function updateStats() {
    const statOpportunities = document.getElementById('statOpportunities');
    const statCvSent = document.getElementById('statCvSent');
    const statReplies = document.getElementById('statReplies');
    const statSuccessRate = document.getElementById('statSuccessRate');

    if (statOpportunities) statOpportunities.textContent = opportunitiesCache.length;
    if (statCvSent) statCvSent.textContent = applicationsCache.length;

    const replies = applicationsCache.filter((a) => a.status !== 'Pending').length;
    if (statReplies) statReplies.textContent = replies;

    const accepted = applicationsCache.filter((a) => a.status === 'Accepted').length;
    const rate = applicationsCache.length
      ? Math.round((accepted / applicationsCache.length) * 100)
      : 0;
    if (statSuccessRate) statSuccessRate.textContent = rate + '%';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* =============================================
     Initialisation
     ============================================= */
  (async function init() {
    await loadApplications();
    await loadOpportunities();
  })();
});