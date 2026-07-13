/* =============================================
   edit-profile.js — تحميل وتعديل الملف الشخصي
   edit-profile.js — charge et met à jour le profil (GET/PUT /api/profile)
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'http://localhost:5000/api';
  const token = localStorage.getItem('opportune_token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const countryInput = document.getElementById('country');
  const cityInput = document.getElementById('city');
  const levelSelect = document.getElementById('level');
  const specialityInput = document.getElementById('speciality');
  const goalBtns = document.querySelectorAll('.goal-btn');
  const saveBtn = document.getElementById('saveProfileBtn');
  const messageBox = document.getElementById('editProfileMessage');

  /* =============================================
     Sélection des objectifs (toggle actif/inactif)
     ============================================= */
  goalBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      this.classList.toggle('active');
    });
  });

  function showMessage(text, isError) {
    messageBox.textContent = text;
    messageBox.style.display = 'block';
    messageBox.style.color = isError ? '#ff6b6b' : '#6bff8f';
  }

  /* =============================================
     Chargement du profil existant
     ============================================= */
  async function loadProfile() {
    try {
      const response = await fetch(API_BASE + '/profile', {
        headers: { Authorization: 'Bearer ' + token }
      });

      if (response.status === 404) return; // Pas encore de profil, formulaire vide

      const result = await response.json();
      if (!response.ok || !result.success) return;

      const profile = result.data;
      countryInput.value = profile.country || '';
      cityInput.value = profile.city || '';
      levelSelect.value = profile.studyLevel || '';
      specialityInput.value = profile.speciality || '';

      if (profile.goals) {
        goalBtns.forEach((btn) => {
          const key = btn.dataset.goal;
          if (profile.goals[key]) btn.classList.add('active');
        });
      }
    } catch (err) {
      console.error('Erreur de chargement du profil:', err);
      showMessage('Cannot reach the server. Make sure the backend is running.', true);
    }
  }

  /* =============================================
     Enregistrement des modifications
     ============================================= */
  async function saveProfile() {
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const goals = {};
    goalBtns.forEach((btn) => {
      goals[btn.dataset.goal] = btn.classList.contains('active');
    });

    try {
      const response = await fetch(API_BASE + '/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          country: countryInput.value.trim(),
          city: cityInput.value.trim(),
          studyLevel: levelSelect.value,
          speciality: specialityInput.value.trim(),
          goals: goals
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || 'Unable to save your profile right now.', true);
        return;
      }

      showMessage('Profile updated successfully ✓', false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du profil:', err);
      showMessage('Cannot reach the server. Make sure the backend is running.', true);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  }

  saveBtn.addEventListener('click', saveProfile);

  loadProfile();
});