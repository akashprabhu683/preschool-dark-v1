// ── CURSOR ──
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
const emojis = ['⭐','🌟','✨','🎈','💫','🎨','🌈','🦋','🌸','🍀'];
let mx=0, my=0, cx=0, cy=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx+'px'; cursor.style.top = my+'px';
});
setInterval(() => {
  cx += (mx-cx)*0.15; cy += (my-cy)*0.15;
  trail.style.left = cx+'px'; trail.style.top = cy+'px';
}, 16);

// sparkles on click
document.addEventListener('click', e => {
  for(let i=0;i<6;i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    const angle = (Math.PI*2/6)*i + Math.random()*0.5;
    const dist = 40+Math.random()*50;
    s.style.setProperty('--dx', Math.cos(angle)*dist+'px');
    s.style.setProperty('--dy', Math.sin(angle)*dist+'px');
    s.style.left = e.clientX+'px'; s.style.top = e.clientY+'px';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(), 750);
  }
});

// ── SUN RAYS ──
const sun = document.getElementById('sun');
for(let i=0;i<12;i++){
  const ray = document.createElement('div');
  ray.className = 'sun-ray';
  const angle = (360/12)*i;
  ray.style.cssText = `width:6px;height:40px;top:50%;left:50%;margin-left:-3px;margin-top:-20px;
    transform:rotate(${angle}deg) translateY(-120%);animation:sunpulse 3s ease-in-out infinite;
    animation-delay:${i*0.1}s;`;
  sun.appendChild(ray);
}

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', ()=>{
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY>80);
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      // admission steps special
      if(e.target.classList.contains('adm-step')) e.target.classList.add('visible');
    }
  });
},{threshold:0.15});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.adm-step').forEach(el=>observer.observe(el));

// ── STAGGERED HERO BOUNCE ──
['bounce-sunny','bounce-bliss','bounce-school'].forEach((id,idx)=>{
  const el = document.getElementById(id);
  el.style.display='inline-block';
  el.style.animation=`bounce-letter 1.8s ease-in-out ${idx*0.3}s infinite`;
});

// ── COUNT-UP ──
const countEls = document.querySelectorAll('[data-target]');
const countObserver = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = target===98?'%':'+';
      let current = 0;
      const step = Math.ceil(target/60);
      const timer = setInterval(()=>{
        current = Math.min(current+step, target);
        el.textContent = current+suffix;
        if(current>=target) clearInterval(timer);
      },25);
      countObserver.unobserve(el);
    }
  });
},{threshold:0.5});
countEls.forEach(el=>countObserver.observe(el));

// ── CONFETTI ──
function launchConfetti(){
  const colors=['var(--cyan)','var(--green)','var(--yellow)','var(--orange)','var(--red)','#fff'];
  for(let i=0;i<60;i++){
    const c=document.createElement('div');
    c.className='confetti-piece';
    c.style.cssText=`
      left:${Math.random()*100}vw;
      top:${-10+Math.random()*-10}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*10}px;
      height:${6+Math.random()*10}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation-duration:${1.5+Math.random()*2}s;
      animation-delay:${Math.random()*0.5}s;
    `;
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 3000);
  }
  const el = document.getElementById('fun-emoji');
  const seq=['🎉','🎊','🌈','🎆','⭐','🦄','🎠','🌟'];
  let idx=0;
  const t=setInterval(()=>{ el.textContent=seq[idx%seq.length]; idx++; if(idx>=seq.length*2) clearInterval(t); },150);
}

// ── FORM SUBMIT ──
function submitForm(){
  const n=document.getElementById('f-name').value.trim();
  const p=document.getElementById('f-phone').value.trim();
  if(!n||!p){ alert('Please fill in at least your name and phone number! 📞'); return; }
  launchConfetti();
  setTimeout(()=>{ document.getElementById('modal').classList.add('open'); },400);
  // clear
  ['f-name','f-phone','f-email','f-child','f-msg'].forEach(id=>{ document.getElementById(id).value=''; });
  document.getElementById('f-age').selectedIndex=0;
}

function closeModal(e){ if(e)e.preventDefault(); document.getElementById('modal').classList.remove('open'); }
document.getElementById('modal-close').onclick = closeModal;
document.getElementById('modal').addEventListener('click', e=>{ if(e.target===document.getElementById('modal')) closeModal(); });

// ── WIGGLE SECTION TITLES ──
document.querySelectorAll('.section-title').forEach(el=>{
  const text=el.innerHTML;
  el.classList.add('wiggle-text');
  el.innerHTML=text.split('').map(ch=>ch===' '?' ':`<span>${ch}</span>`).join('');
});