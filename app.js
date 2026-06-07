// ── CURSOR & TRAILS ──
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
const emojis = ['⭐','✨','✈️','🎈','🦋','🎨','🖍️','🌈'];
let mx=0, my=0, cx=0, cy=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx+'px'; cursor.style.top = my+'px';
});

setInterval(() => {
  cx += (mx-cx)*0.15; cy += (my-cy)*0.15;
  trail.style.left = cx+'px'; trail.style.top = cy+'px';
}, 16);

// ── CLICK SPARKLES ──
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

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── ACTIVE NAV STATE via IntersectionObserver ──
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Map section IDs to nav links for fast lookup
const sectionLinkMap = {};
navLinks.forEach(link => {
  const sectionId = link.getAttribute('data-section');
  sectionLinkMap[sectionId] = link;
});

function setActiveLink(id) {
  navLinks.forEach(l => l.classList.remove('active'));
  if (sectionLinkMap[id]) {
    sectionLinkMap[id].classList.add('active');
  }
}

// Track which sections are visible and pick the topmost one
const visibleSections = new Set();

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      visibleSections.add(entry.target.id);
    } else {
      visibleSections.delete(entry.target.id);
    }
  });

  // Activate the section that appears earliest in DOM order (topmost on screen)
  let topSection = null;
  sections.forEach(section => {
    if (visibleSections.has(section.id)) {
      if (!topSection) topSection = section.id;
    }
  });

  if (topSection) setActiveLink(topSection);
}, {
  threshold: 0.25,
  rootMargin: '-60px 0px -20% 0px'
});

sections.forEach(section => navObserver.observe(section));

// Also update active state on nav link click immediately for snappier feel
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const id = link.getAttribute('data-section');
    setActiveLink(id);
  });
});

// ── HERO BOUNCE ANIMATION ──
['bounce-shafa','bounce-kids','bounce-school'].forEach((id,idx) => {
  const el = document.getElementById(id);
  el.style.animation = `bounce-letter 2s ease-in-out ${idx*0.3}s infinite`;
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