// ── DETECT TOUCH DEVICE ──
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

// ── CURSOR & TRAILS (desktop only) ──
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
const emojis = ['⭐','✨','✈️','🎈','🦋','🎨','🖍️','🌈'];
let mx=0, my=0, cx=0, cy=0;

if (!isTouchDevice()) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx+'px'; cursor.style.top = my+'px';
  });

  setInterval(() => {
    cx += (mx-cx)*0.15; cy += (my-cy)*0.15;
    trail.style.left = cx+'px'; trail.style.top = cy+'px';
  }, 16);

  // ── CLICK SPARKLES (desktop only) ──
  document.addEventListener('click', e => {
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') return;
    for(let i=0; i<6; i++){
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      const angle = (Math.PI*2/6)*i + Math.random()*0.5;
      const dist = 40+Math.random()*50;
      s.style.setProperty('--dx', Math.cos(angle)*dist+'px');
      s.style.setProperty('--dy', Math.sin(angle)*dist+'px');
      s.style.left = e.clientX+'px'; s.style.top = e.clientY+'px';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  });
}

// ── NAVBAR SCROLL (desktop) ──
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 50);
});

// ── ACTIVE NAV STATE via IntersectionObserver ──
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavItems = document.querySelectorAll('.mobile-menu-item');
const sections = document.querySelectorAll('section[id]');

const sectionLinkMap = {};
navLinks.forEach(link => {
  const sectionId = link.getAttribute('data-section');
  sectionLinkMap[sectionId] = link;
});

const sectionMobileMap = {};
mobileNavItems.forEach(item => {
  const sectionId = item.getAttribute('data-section');
  if (sectionId) sectionMobileMap[sectionId] = item;
});

function setActiveLink(id) {
  navLinks.forEach(l => l.classList.remove('active'));
  mobileNavItems.forEach(l => l.classList.remove('active'));
  if (sectionLinkMap[id]) sectionLinkMap[id].classList.add('active');
  if (sectionMobileMap[id]) sectionMobileMap[id].classList.add('active');
}

const visibleSections = new Set();
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) visibleSections.add(entry.target.id);
    else visibleSections.delete(entry.target.id);
  });
  let topSection = null;
  sections.forEach(section => {
    if (visibleSections.has(section.id) && !topSection) topSection = section.id;
  });
  if (topSection) setActiveLink(topSection);
}, { threshold: 0.25, rootMargin: '-60px 0px -20% 0px' });

sections.forEach(section => navObserver.observe(section));

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const id = link.getAttribute('data-section');
    setActiveLink(id);
  });
});

// ── HERO BOUNCE ANIMATION ──
['bounce-shafa','bounce-kids','bounce-school'].forEach((id,idx) => {
  const el = document.getElementById(id);
  if (el) el.style.animation = `bounce-letter 2s ease-in-out ${idx*0.3}s infinite`;
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.classList.add('visible');
      if(e.target.classList.contains('section-title') && !e.target.classList.contains('wiggle-text')) {
        const text = e.target.innerHTML;
        e.target.classList.add('wiggle-text');
        e.target.innerHTML = text.split('').map(ch => ch===' '?' ':`<span>${ch}</span>`).join('');
      }
    }
  });
}, {threshold: 0.15});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── CONFETTI & FORM ──
function launchConfetti(){
  const colors=['var(--sky)','var(--lime)','var(--yellow)','var(--pink)','var(--purple)'];
  for(let i=0; i<80; i++){
    const c = document.createElement('div');
    c.style.position = 'fixed';
    c.style.zIndex = '10001';
    c.style.left = Math.random()*100 + 'vw';
    c.style.top = -20 + 'px';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.width = (6+Math.random()*10) + 'px';
    c.style.height = (6+Math.random()*10) + 'px';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    c.style.boxShadow = `0 0 10px ${c.style.background}`;
    const duration = 1.5 + Math.random()*2;
    c.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-in`;
    document.body.appendChild(c);
    c.getBoundingClientRect();
    c.style.transform = `translateY(120vh) rotate(${Math.random()*720}deg)`;
    c.style.opacity = '0';
    setTimeout(() => c.remove(), duration * 1000);
  }
}

function submitForm() {
  const n = document.getElementById('f-name').value.trim();
  const p = document.getElementById('f-phone').value.trim();
  if(!n || !p) {
    alert('Please fill in your name and phone number! 📞');
    return;
  }
  launchConfetti();
  setTimeout(() => { document.getElementById('modal').classList.add('open'); }, 500);
  ['f-name','f-phone','f-child'].forEach(id => { document.getElementById(id).value=''; });
  document.getElementById('f-age').selectedIndex = 0;
}

function closeModal(e) {
  if(e) e.preventDefault();
  document.getElementById('modal').classList.remove('open');
}

// Close modal on overlay click
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.getElementById('modal-close').addEventListener('click', closeModal);

// ════════════════════════════════════════
// ── PREMIUM MOBILE FLOATING NAV ──
// ════════════════════════════════════════
(function() {
  const wrapper   = document.getElementById('mobileNavWrapper');
  const btn       = document.getElementById('mobileNavBtn');
  const overlay   = document.getElementById('mobileNavOverlay');
  const items     = document.getElementById('mobileMenuItems');
  const menuItems = document.querySelectorAll('.mobile-menu-item');

  if (!wrapper || !btn) return;

  let isOpen = false;
  let isAnimating = false;

  // Calculate and set top offset for items container so it sits above the button
  function positionItems() {
    // Items container starts at top:0 of wrapper; the circle btn is last in flow
    // The menu items list needs to push down past itself to reveal from the circle
    // We use CSS transform on each item — already handled in CSS
    // Just ensure the container has correct bottom margin to not overlap button
    const btnH = btn.offsetHeight;
    const labelH = wrapper.querySelector('.mobile-nav-label')
      ? wrapper.querySelector('.mobile-nav-label').offsetHeight + 6
      : 0;
    items.style.paddingTop = '0';
    items.style.paddingBottom = (btnH + labelH + 12) + 'px';
  }

  positionItems();
  window.addEventListener('resize', positionItems);

  function openMenu() {
    if (isOpen || isAnimating) return;
    isAnimating = true;
    isOpen = true;
    wrapper.classList.remove('closing');
    wrapper.classList.add('open');
    setTimeout(() => { isAnimating = false; }, 500);
  }

  function closeMenu(cb) {
    if (!isOpen || isAnimating) return;
    isAnimating = true;
    isOpen = false;
    wrapper.classList.add('closing');

    // After closing animation completes, clean up classes
    setTimeout(() => {
      wrapper.classList.remove('open', 'closing');
      isAnimating = false;
      if (cb) cb();
    }, 420);
  }

  // Toggle on button tap/click
  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Close on overlay tap
  overlay.addEventListener('click', () => { if (isOpen) closeMenu(); });

  // Menu item tap → highlight → close → scroll
  menuItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const href = item.getAttribute('href');
      const sectionId = item.getAttribute('data-section');

      // Ripple glow
      item.classList.add('tapped');
      setTimeout(() => item.classList.remove('tapped'), 450);

      // Update active state
      if (sectionId) setActiveLink(sectionId);

      closeMenu(() => {
        // After menu closes, scroll to section
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
})();
