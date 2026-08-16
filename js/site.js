// Shared behaviour for every page: mobile nav, Services dropdown, payment warning.

// Close the mobile menu after tapping a nav link
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  document.querySelectorAll('.site-nav a').forEach(link => {
    link.addEventListener('click', () => { navToggle.checked = false; });
  });
}

// Services dropdown — click to open, so it works on touch as well as desktop
document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
  const item = toggle.closest('.has-dropdown');
  toggle.addEventListener('click', event => {
    event.stopPropagation();
    const open = item.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.has-dropdown.open').forEach(item => {
    item.classList.remove('open');
    item.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.has-dropdown.open').forEach(item => {
    item.classList.remove('open');
    item.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
  });
  closePayModal();
});

// Payment warning — students must be assessed by the Shaykh before paying, so
// every "pay fees" button opens this reminder instead of going straight to Stripe.
const payModal = document.getElementById('payModal');
let payReturnFocus = null;

function openPayModal(trigger) {
  if (!payModal) return;
  payReturnFocus = trigger || null;
  payModal.hidden = false;
  document.body.classList.add('modal-open');
  const first = payModal.querySelector('[data-modal-close]');
  if (first) first.focus();
}

function closePayModal() {
  if (!payModal || payModal.hidden) return;
  payModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (payReturnFocus) payReturnFocus.focus();
}

if (payModal) {
  document.querySelectorAll('[data-pay-trigger]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      openPayModal(button);
    });
  });

  payModal.querySelectorAll('[data-modal-close]').forEach(button => {
    button.addEventListener('click', closePayModal);
  });

  // Clicking the dimmed area behind the dialog closes it
  payModal.addEventListener('click', event => {
    if (event.target === payModal) closePayModal();
  });
}
