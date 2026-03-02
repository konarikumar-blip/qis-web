/* ═══════════════════════════════════════════════════════
   QIS CET  —  auth.js  —  Auth Portal Logic
   ═══════════════════════════════════════════════════════ */
'use strict';

/* CURSOR */
const cursor=document.getElementById('cursor'),cursorRing=document.getElementById('cursorRing');
let mx=-100,my=-100,rx=-100,ry=-100;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
(function ar(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cursorRing.style.left=rx+'px';cursorRing.style.top=ry+'px';requestAnimationFrame(ar)})();
document.querySelectorAll('a,button,input,select').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.width='18px';cursor.style.height='18px';cursorRing.style.width='44px';cursorRing.style.height='44px'});
  el.addEventListener('mouseleave',()=>{cursor.style.width='10px';cursor.style.height='10px';cursorRing.style.width='32px';cursorRing.style.height='32px'});
});

/* TAB SWITCHER */
function switchTab(tab){
  document.getElementById('formSignin').classList.toggle('hidden', tab!=='signin');
  document.getElementById('formSignup').classList.toggle('hidden', tab!=='signup');
  document.getElementById('tabSignin').classList.toggle('active', tab==='signin');
  document.getElementById('tabSignup').classList.toggle('active', tab==='signup');
}

// Check URL hash for direct signup link
if(window.location.hash==='#signup') switchTab('signup');

/* PASSWORD TOGGLE */
function togglePwd(inputId, btnId){
  const inp=document.getElementById(inputId),btn=document.getElementById(btnId);
  const isPass=inp.type==='password';
  inp.type=isPass?'text':'password';
  btn.textContent=isPass?'HIDE':'SHOW';
}

/* DEMO CREDENTIALS */
const USERS=[
  {email:'student@qiscet.edu.in', password:'qis2024', role:'student', name:'Demo Student'},
  {email:'admin@qiscet.edu.in',   password:'admin2024', role:'admin',   name:'Admin User'},
];

/* SIGN IN */
const signinForm=document.getElementById('signinForm');
if(signinForm){
  signinForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const email=document.getElementById('siEmail').value.trim();
    const password=document.getElementById('siPassword').value;
    const errEl=document.getElementById('siError');
    const btn=signinForm.querySelector('.af-btn');
    errEl.textContent='';
    btn.textContent='AUTHENTICATING...';btn.disabled=true;

    await new Promise(r=>setTimeout(r,1000));

    // Try server first
    try{
      const res=await fetch('/api/login',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password})
      });
      const data=await res.json();
      if(res.ok){
        localStorage.setItem('qis_user', JSON.stringify(data.user));
        btn.textContent='ACCESS GRANTED ✓';
        setTimeout(()=>window.location.href='index.html',800);
        return;
      }
    }catch{}

    // Fallback: local auth
    const user=USERS.find(u=>u.email===email&&u.password===password);
    if(user){
      btn.textContent='ACCESS GRANTED ✓';
      setTimeout(()=>window.location.href='index.html',800);
    }else{
      errEl.textContent='ERROR: Invalid credentials. Check email and password.';
      btn.textContent='LOGIN ▶';btn.disabled=false;
    }
  });
}

/* SIGN UP */
const signupForm=document.getElementById('signupForm');
if(signupForm){
  signupForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const password=document.getElementById('suPassword').value;
    const confirm=document.getElementById('suConfirm').value;
    const errEl=document.getElementById('suError');
    const btn=signupForm.querySelector('.af-btn');
    errEl.textContent='';

    if(password.length<8){errEl.textContent='ERROR: Password must be at least 8 characters.';return}
    if(password!==confirm){errEl.textContent='ERROR: Passwords do not match.';return}

    btn.textContent='REGISTERING...';btn.disabled=true;
    await new Promise(r=>setTimeout(r,1200));

    btn.textContent='REGISTERED ✓ — REDIRECTING...';
    setTimeout(()=>switchTab('signin'),1500);
    btn.textContent='CREATE ACCOUNT ▶';btn.disabled=false;
  });
}

/* TERMINAL TYPING on heading */
const h2=document.querySelector('.af-hd h2');
if(h2){
  const orig=h2.textContent;h2.textContent='';let i=0;
  const t=()=>{if(i<orig.length){h2.textContent+=orig[i++];setTimeout(t,40)}};
  setTimeout(t,300);
}
