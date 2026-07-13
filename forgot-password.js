document.addEventListener('DOMContentLoaded', function () {
  const API_BASE = 'http://localhost:5000/api';
  const emailInput = document.getElementById('email');
  const forgotBtn = document.getElementById('forgotBtn');
  const messageBox = document.getElementById('forgotMessage');

  function showMessage(html, isError) {
    messageBox.innerHTML = html;
    messageBox.style.display = 'block';
    messageBox.style.color = isError ? '#ff6b6b' : '#6bff8f';
  }

  forgotBtn.addEventListener('click', async function () {
    const email = emailInput.value.trim();
    if (!email) {
      showMessage('Please enter your email.', true);
      return;
    }

    const originalText = forgotBtn.textContent;
    forgotBtn.disabled = true;
    forgotBtn.textContent = 'Sending...';

    try {
      const response = await fetch(API_BASE + '/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      const result = await response.json();

      if (!response.ok) {
        showMessage(result.message || 'Something went wrong.', true);
        return;
      }

      // Mode démo : si l'email n'a pas pu être envoyé (SMTP non configuré),
      // le lien est renvoyé directement pour permettre de tester quand même
      if (result.resetLink) {
        showMessage(
          result.message + '<br><br><a href="' + result.resetLink + '" style="word-break:break-all;">' +
            result.resetLink +
          '</a>',
          false
        );
      } else {
        showMessage(result.message, false);
      }
    } catch (err) {
      console.error('Erreur:', err);
      showMessage('Cannot reach the server. Make sure the backend is running.', true);
    } finally {
      forgotBtn.disabled = false;
      forgotBtn.textContent = originalText;
    }
  });
});