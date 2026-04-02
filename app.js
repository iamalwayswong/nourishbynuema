/* ==========================================================================
   Nourish by Nuema — Form Submission

   Submits to Google Sheets via a Google Apps Script Web App.

   SETUP INSTRUCTIONS:
   1. Create a Google Sheet
   2. Go to Extensions → Apps Script
   3. Paste the code from google-apps-script.js
   4. Deploy → New deployment → Web app
      - Execute as: Me
      - Who has access: Anyone
   5. Copy the deployment URL and paste it below as GOOGLE_SCRIPT_URL
   ========================================================================== */

// ← Replace with your deployed Google Apps Script web app URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0HyhPwQdmQPJrTTiVtMVdJBg7kjlZdIMvd1J5Cf3KIx0C4UNo8rJiuiaq20GoHXdKrg/exec';

const form = document.getElementById('waitlist-form');
const thankYou = document.getElementById('thank-you');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));

  // Validate required fields
  let valid = true;

  const firstName = form.querySelector('[name="firstName"]');
  if (!firstName.value.trim()) {
    firstName.classList.add('error');
    firstName.nextElementSibling.classList.add('visible');
    valid = false;
  }

  const email = form.querySelector('[name="email"]');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailPattern.test(email.value)) {
    email.classList.add('error');
    email.nextElementSibling.classList.add('visible');
    valid = false;
  }

  const neighborhood = form.querySelector('[name="neighborhood"]');
  if (!neighborhood.value) {
    neighborhood.classList.add('error');
    neighborhood.nextElementSibling.classList.add('visible');
    valid = false;
  }

  if (!valid) return;

  // Gather form data
  const data = {
    firstName: firstName.value.trim(),
    lastName: form.querySelector('[name="lastName"]').value.trim(),
    email: email.value.trim(),
    neighborhood: neighborhood.value,
    time: getCheckedValues('time'),
    days: getCheckedValues('days'),
    flavor: getRadioValue('flavor'),
    submittedAt: new Date().toISOString(),
  };

  // Submit
  const submitBtn = form.querySelector('.btn--filled');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  try {
    if (GOOGLE_SCRIPT_URL) {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      // Fallback: log to console when no URL is configured
      console.log('Form data (Google Script URL not set):', data);
    }

    // Show thank-you message
    form.style.display = 'none';
    thankYou.classList.add('visible');
  } catch (err) {
    console.error('Submission error:', err);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Join our waitlist';
    alert('Something went wrong. Please try again.');
  }
});

function getCheckedValues(name) {
  return Array.from(form.querySelectorAll(`[name="${name}"]:checked`))
    .map(cb => cb.value)
    .join(', ');
}

function getRadioValue(name) {
  const checked = form.querySelector(`[name="${name}"]:checked`);
  return checked ? checked.value : '';
}
