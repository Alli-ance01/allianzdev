/* ─── MUSIC TOGGLE ────────────────────────────────── */
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add('playing');
    } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    }
});

/* ─── PHASE NAVIGATION ────────────────────────────── */
const phases = document.querySelectorAll('.phase');
const nextBtns = document.querySelectorAll('.next-phase');

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const nextId = btn.getAttribute('data-next');
        const currentPhase = btn.closest('.phase');
        const nextPhase = document.getElementById(`phase-${nextId}`);
        
        gsap.to(currentPhase.querySelector('.card'), {
            y: -50, opacity: 0, duration: 0.5, onComplete: () => {
                currentPhase.classList.remove('active');
                nextPhase.classList.add('active');
                
                gsap.from(nextPhase.querySelector('.card'), {
                    y: 50, opacity: 0, duration: 0.8, ease: "back.out(1.7)"
                });
            }
        });
    });
});

/* ─── MOVING NO BUTTON & GUILT TRIPS ──────────────── */
const noBtn = document.getElementById('no-btn');
const subText = document.getElementById('sub-text');

const guiltTrips = [
    "Are you sure? 🥺",
    "Think again! 💔",
    "I'll be very sad... 😭",
    "You're breaking my heart! 🥀",
    "Is that your final answer? 🧐",
    "I'll ask again later! 😂",
    "But we're so cute together! 🥰",
    "Please say yes! 💖"
];

let guiltIndex = 0;

function moveNoButton() {
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Change text to guilt trip
    noBtn.textContent = guiltTrips[guiltIndex];
    guiltIndex = (guiltIndex + 1) % guiltTrips.length;
    
    // Animate subtext
    gsap.to(subText, { scale: 1.1, color: "#ff4d6d", duration: 0.2, yoyo: true, repeat: 1 });
}

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('click', moveNoButton);

/* ─── SUCCESS STATE ────────────────────────────────── */
const yesButton = document.getElementById('yes-btn');
const phase3 = document.getElementById('phase-3');
const phase4 = document.getElementById('phase-4');
const displayImg = document.getElementById('display-img');

yesButton.addEventListener('click', () => {
    gsap.to(phase3.querySelector('.card'), {
        scale: 0, opacity: 0, duration: 0.5, onComplete: () => {
            phase3.classList.remove('active');
            phase4.classList.add('active');
            
            // Set Date
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', options);
            
            // Animate Letter
            gsap.from('.letter', {
                y: 100, rotateX: 45, opacity: 0, duration: 1.2, ease: "power4.out"
            });
            
            triggerConfetti();
        }
    });
});

function triggerConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4, y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.6, y: Math.random() - 0.2 } });
    }, 250);
}

/* ─── FLOATING HEARTS ─────────────────────────────── */
function createHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('i');
    heart.classList.add('fa-solid', 'fa-heart', 'heart');
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}
setInterval(createHeart, 300);
