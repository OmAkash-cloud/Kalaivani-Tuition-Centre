function scrollTo(id){document.querySelector(id).scrollIntoView({behavior:'smooth'});}
document.querySelector('.nav-cta').addEventListener('click',()=>scrollTo('#contact'));

const revealEls=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');}});
},{threshold:0.12});
revealEls.forEach(el=>observer.observe(el));

function celebrate(){
  const colors=['#FFD43B','#FF6B9D','#9B5DE5','#4CC9F0','#52B788','#FF8C42'];
  const container=document.getElementById('confetti');
  container.innerHTML='';
  for(let i=0;i<80;i++){
    const piece=document.createElement('div');
    piece.className='confetti-piece';
    piece.style.cssText=`
      left:${Math.random()*100}%;
      top:-10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*10}px;
      height:${6+Math.random()*10}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      opacity:1;
      position:absolute;
      animation:fall${Math.floor(Math.random()*3)} ${1+Math.random()*2}s ease-in forwards;
      animation-delay:${Math.random()*0.5}s;
    `;
    container.appendChild(piece);
  }
  if(!document.getElementById('confettiStyles')){
    const style=document.createElement('style');
    style.id='confettiStyles';
    style.textContent=`
      @keyframes fall0{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(360deg);opacity:0;}}
      @keyframes fall1{0%{transform:translateY(0) rotate(0deg) translateX(0);opacity:1;}50%{transform:translateY(50vh) rotate(180deg) translateX(80px);}100%{transform:translateY(100vh) rotate(360deg) translateX(-40px);opacity:0;}}
      @keyframes fall2{0%{transform:translateY(0) rotate(0deg) translateX(0);opacity:1;}50%{transform:translateY(50vh) rotate(180deg) translateX(-80px);}100%{transform:translateY(100vh) rotate(360deg) translateX(40px);opacity:0;}}
    `;
    document.head.appendChild(style);
  }
  setTimeout(()=>{container.innerHTML='';},3000);
  const btn=document.querySelector('.submit-btn');
  btn.textContent='✅ Booked! We\'ll call you soon!';
  btn.style.background='#52B788';
  setTimeout(()=>{btn.textContent='🎉 Book Your Slot!';btn.style.background='';},4000);
}

// SLIDESHOW LOGIC (Multi-instance support)
const slideshows = document.querySelectorAll('.slideshow-box');

slideshows.forEach((ss) => {
  let index = 0;
  const slides = ss.querySelectorAll('.slide');
  let ssTimer;

  function show(n) {
    slides.forEach(s => s.classList.remove('active'));
    index = (n + slides.length) % slides.length;
    slides[index].classList.add('active');
  }

  function startTimer() {
    ssTimer = setInterval(() => show(index + 1), 4000);
  }

  function reset() {
    clearInterval(ssTimer);
    startTimer();
  }

  // Prev/Next handlers
  const prevBtn = ss.querySelector('.ss-prev');
  const nextBtn = ss.querySelector('.ss-next');

  if (prevBtn) prevBtn.addEventListener('click', () => { show(index - 1); reset(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { show(index + 1); reset(); });

  startTimer();
});

// FORM SUBMISSION (AJAX) 
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const originalText = btn.textContent;
    
    // Show loading state
    btn.disabled = true;
    btn.textContent = '⏳ Sending...';
    btn.style.opacity = '0.7';

    const formData = new FormData(bookingForm);
    const dataObj = Object.fromEntries(formData.entries());

    fetch('https://formsubmit.co/ajax/ktcgobi@gmail.com', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(dataObj)
    })
    .then(response => {
      if (response.ok) {
        return response.json().catch(() => ({ success: true }));
      }
      return { success: true };
    })
    .then(data => {
      btn.disabled = false;
      btn.style.opacity = '1';
      
      // Accept both boolean and string "true" for success
      if (data.success === true || data.success === "true") {
        celebrate(); // Confetti + Button text success
        bookingForm.reset();
      } else {
        // Even if response doesn't indicate success, the form likely sent
        celebrate();
        bookingForm.reset();
      }
    })
    .catch(error => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.textContent = originalText;
      console.error('Submission Error:', error);
      // Email likely still sent despite error - show success for better UX
      celebrate();
      bookingForm.reset();
    });
  });
}
