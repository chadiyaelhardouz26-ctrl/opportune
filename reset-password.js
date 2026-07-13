document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'http://localhost:5000/api';

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const resetBtn = document.getElementById('resetBtn');
  const messageBox = document.getElementById('resetMessage');

  function showMessage(text, isError) {
    messageBox.textContent = text;
    messageBox.style.display = 'block';
    messageBox.style.color = isError ? '#ff6b6b' : '#6bff8f';
  }

  if (!token) {
    showMessage('Invalid or missing reset link.', true);
    resetBtn.disabled = true;
    return;
  }

  resetBtn.addEventListener('click', async function () {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    if (!password || password.length < 6) {
      showMessage('Password must be at least 6 characters.', true);
      return;
    }
    if (password !== confirmPassword) {
      showMessage('Passwords do not match.', true);
      return;
    }

    const originalText = resetBtn.textContent;
    resetBtn.disabled = true;
    resetBtn.textContent = 'Resetting...';

    try {
      const response = await fetch(API_BASE + '/auth/reset-password/' + token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password })
      });
      const result = await response.json();

      if (!response.ok) {
        showMessage(result.message || 'Unable to reset password.', true);
        resetBtn.disabled = false;
        resetBtn.textContent = originalText;
        return;
      }

      showMessage('Password reset successfully! Redirecting to login...', false);
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      showMessage('Cannot reach the server. Make sure the backend is running.', true);
      resetBtn.disabled = false;
      resetBtn.textContent = originalText;
    }
  });
});