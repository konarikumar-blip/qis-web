/* ═══════════════════════════════════════════════════════
   QIS College of Engineering & Technology  —  script.js
   ═══════════════════════════════════════════════════════ */
'use strict';

/* CURSOR */
const cursor=document.getElementById('cursor'),cursorRing=document.getElementById('cursorRing');
let mx=-100,my=-100,rx=-100,ry=-100;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
(function animRing(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cursorRing.style.left=rx+'px';cursorRing.style.top=ry+'px';requestAnimationFrame(animRing)})();
document.querySelectorAll('a,button,.prog-row,.asb-item,.pf,.about-chips span').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.width='18px';cursor.style.height='18px';cursorRing.style.width='44px';cursorRing.style.height='44px';cursorRing.style.opacity='0.9'});
  el.addEventListener('mouseleave',()=>{cursor.style.width='10px';cursor.style.height='10px';cursorRing.style.width='32px';cursorRing.style.height='32px';cursorRing.style.opacity='0.5'});
});
document.addEventListener('mouseleave',()=>{cursor.style.opacity='0';cursorRing.style.opacity='0'});
document.addEventListener('mouseenter',()=>{cursor.style.opacity='1';cursorRing.style.opacity='0.5'});

/* NAVBAR SCROLL */
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',window.scrollY>50)},{passive:true});

/* MOBILE NAV */
const burger=document.getElementById('burger'),navLinks=document.getElementById('navLinks');
burger.addEventListener('click',()=>{burger.classList.toggle('open');navLinks.classList.toggle('open')});
navLinks.querySelectorAll('a').forEach(l=>l.addEventListener('click',()=>{burger.classList.remove('open');navLinks.classList.remove('open')}));

/* COUNTER ANIMATION */
function animCounter(el){
  const target=parseInt(el.dataset.to,10),dur=1600,stepT=dur/target;
  let cur=0;
  const t=setInterval(()=>{cur+=Math.ceil(target/60);if(cur>=target){cur=target;clearInterval(t)}el.textContent=cur.toLocaleString()},stepT);
}
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.hs-num').forEach(animCounter);statsObs.unobserve(e.target)}});
},{threshold:0.4});
const statsBar=document.querySelector('.hero-stats');
if(statsBar)statsObs.observe(statsBar);

/* SCROLL REVEAL */
document.querySelectorAll('.prog-row,.asb-item,.pf,.recruiter-grid span,.about-chips span,.ci-row').forEach(el=>el.classList.add('reveal'));
const revObs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('on'),i*55);revObs.unobserve(e.target)}});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

/* GLITCH EFFECT ON SECTION TITLES */
const gc='!@#$%^&*[]{}░▒▓█▄';
function glitch(el){
  const orig=el.textContent;let i=0;
  const iv=setInterval(()=>{
    el.textContent=orig.split('').map((c,idx)=>{if(c===' ')return ' ';if(idx<i)return orig[idx];return gc[Math.floor(Math.random()*gc.length)]}).join('');
    i+=2;if(i>orig.length+2){el.textContent=orig;clearInterval(iv)}
  },45);
}
document.querySelectorAll('.sec-title').forEach(t=>t.addEventListener('mouseenter',()=>glitch(t)));

/* CONTACT FORM */
const form=document.getElementById('contactForm'),toast=document.getElementById('toast');
function showToast(msg,dur=3500){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),dur)}
if(form){
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=form.querySelector('.cform-btn'),orig=btn.textContent;
    btn.textContent='TRANSMITTING...';btn.disabled=true;
    await new Promise(r=>setTimeout(r,1200));
    try{
      const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
      showToast(res.ok?'✓ Message transmitted!':'✓ Message received!');
    }catch{showToast('✓ Message received! We\'ll respond soon.')}
    form.reset();btn.textContent=orig;btn.disabled=false;
  });
}

/* RIPPLE ON PROG ROWS */
document.querySelectorAll('.prog-row').forEach(row=>{
  row.addEventListener('click',function(e){
    const rect=this.getBoundingClientRect(),rp=document.createElement('span');
    rp.style.cssText=`position:absolute;border-radius:50%;width:6px;height:6px;background:rgba(255,107,0,.35);left:${e.clientX-rect.left-3}px;top:${e.clientY-rect.top-3}px;transform:scale(0);animation:ripple .5s ease-out forwards;pointer-events:none`;
    this.appendChild(rp);setTimeout(()=>rp.remove(),500);
  });
});
const rs=document.createElement('style');rs.textContent='@keyframes ripple{to{transform:scale(60);opacity:0}}';document.head.appendChild(rs);

/* ACTIVE NAV */
const sections=document.querySelectorAll('section[id]'),navAs=document.querySelectorAll('.nl');
const secObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)navAs.forEach(a=>{a.style.color='';if(a.getAttribute('href')==='#'+e.target.id)a.style.color='var(--white)'})});
},{threshold:0.4});
sections.forEach(s=>secObs.observe(s));

/* TERMINAL TYPING */
const ey=document.querySelector('.hero-eyebrow');
if(ey){const ft=ey.textContent;ey.textContent='';let ci=0;const tp=()=>{if(ci<ft.length){ey.textContent+=ft[ci++];setTimeout(tp,38)}};setTimeout(tp,600)}

/* CAMPUS PARALLAX */
const cbImg=document.querySelector('.cb-img');
if(cbImg){
  const banner=cbImg.closest('.campus-banner');
  window.addEventListener('scroll',()=>{
    const r=banner.getBoundingClientRect();
    if(r.top<window.innerHeight&&r.bottom>0){
      const p=(window.innerHeight-r.top)/(window.innerHeight+r.height);
      cbImg.style.objectPosition=`center ${30+p*12}%`;
    }
  },{passive:true});
}

console.log('%cQIS CET 🔶','color:#ff6b00;font-size:22px;font-weight:bold;');
