// Shared behaviour for every page: mobile nav, Services dropdown, payment warning.

// Paste the live Square Payment Link URLs here after the account owner creates
// the recurring plans in Square. Keeping them in one place prevents the same
// checkout URL from being copied into several pages.
const squarePaymentLinks = {
  adultOneDay: 'https://square.link/u/BFewchdD',
  adultBothDays: 'https://square.link/u/1i5sHagl',
  kids: ''
};

document.querySelectorAll('[data-square-payment]').forEach(link => {
  const paymentUrl = squarePaymentLinks[link.dataset.squarePayment];
  if (!paymentUrl) return;

  link.href = paymentUrl;
  link.hidden = false;
});

document.querySelectorAll('.modal').forEach(modal => {
  const paymentLinks = [...modal.querySelectorAll('[data-square-payment]')];
  const unavailableMessage = modal.querySelector('[data-payment-unavailable]');
  if (unavailableMessage && paymentLinks.length && paymentLinks.every(link => !link.hidden)) {
    unavailableMessage.hidden = true;
  }
});

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
// every "pay fees" button opens this reminder instead of going straight to Square.
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
