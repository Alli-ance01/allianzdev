/* ─── FIREBASE CONFIGURATION ─────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyDM2OARbJ7tYCdsqhu0zI-fgCOsP13rznY",
  authDomain: "portfolio-2a3c3.firebaseapp.com",
  projectId: "portfolio-2a3c3",
  storageBucket: "portfolio-2a3c3.firebasestorage.app",
  messagingSenderId: "529557030671",
  appId: "1:529557030671:web:bb5687161b755e3c37e07a"
};

// Initialize Firebase (Compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ─── INITIALIZATION & URL PARSING ────────────────── */
const urlParams = new URLSearchParams(window.location.search);
let partnerName = urlParams.get('name');

// DOM Elements
const phases = document.querySelectorAll('.phase');
const partnerNameEls = document.querySelectorAll('.partner-name');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const subText = document.getElementById('sub-text');
const startBtn = document.getElementById('start-btn');
const nameInput = document.getElementById('recipient-name-input');
const printBtn = document.getElementById('print-btn');

// Initial state
if (partnerName) {
    updateNameDisplay(partnerName);
    showPhase(1);
} else {
    showPhase(0);
}

function showPhase(id) {
    phases.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`phase-${id}`);
    if (target) {
        target.classList.add('active');
        gsap.from(target.querySelector('.card'), {
            y: 50, opacity: 0, duration: 0.8, ease: "back.out(1.7)"
        });
    }
}

function updateNameDisplay(name) {
    partnerNameEls.forEach(el => el.textContent = name);
}

/* ─── RECIPIENT NAME ENTRY ────────────────────────── */
if (startBtn) {
    startBtn.addEventListener('click', () => {
        partnerName = nameInput.value.trim();
        if (partnerName) {
            updateNameDisplay(partnerName);
            showPhase(1);
        } else {
            gsap.to(nameInput, { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
        }
    });
}

/* ─── PHASE NAVIGATION ────────────────────────────── */
const nextBtns = document.querySelectorAll('.next-phase');

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const nextId = btn.getAttribute('data-next');
        const currentPhase = btn.closest('.phase');
        
        gsap.to(currentPhase.querySelector('.card'), {
            scale: 0.9, opacity: 0, duration: 0.4, onComplete: () => {
                showPhase(nextId);
            }
        });
    });
});

/* ─── NO BUTTON RUNAWAY & YES BUTTON GROWTH ───────── */
let yesScale = 1;
let noClickCount = 0;

const guiltTrips = [
    "Are you sure? 🥺",
    "Think again! 💔",
    "I'll be very sad... 😭",
    "You're breaking my heart! 🥀",
    "Is that your final answer? 🧐",
    "But we're so cute! ✨",
    "Please say yes! 💖",
    "I'll ask again! 😂",
    "Don't do this to me! 😢",
    "Look at the cat! 🐱",
    "You're making me cry... 😿",
    "Wait, let's talk about this! 🗣️"
];

function handleNoInteraction() {
    noClickCount++;
    
    // Move No Button
    const maxX = window.innerWidth - noBtn.offsetWidth - 40;
    const maxY = window.innerHeight - noBtn.offsetHeight - 40;
    const randomX = Math.max(20, Math.floor(Math.random() * maxX));
    const randomY = Math.max(20, Math.floor(Math.random() * maxY));
    
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '1000';
    
    gsap.to(noBtn, {
        left: randomX,
        top: randomY,
        duration: 0.3,
        ease: "power2.out"
    });
    
    // Update No Button text
    noBtn.textContent = guiltTrips[noClickCount % guiltTrips.length];
    
    // Grow Yes Button
    yesScale += 0.2;
    gsap.to(yesBtn, {
        scale: yesScale,
        duration: 0.3,
        ease: "back.out(1.7)"
    });
    
    // Pulse subtext
    gsap.fromTo(subText, { scale: 1 }, { scale: 1.2, color: "#ff4d6d", duration: 0.2, yoyo: true, repeat: 1 });
}

noBtn.addEventListener('mouseover', handleNoInteraction);
noBtn.addEventListener('click', handleNoInteraction);

/* ─── YES BUTTON SUCCESS ─────────────────────────── */
yesBtn.addEventListener('click', () => {
    // Record response in Firebase
    if (typeof firebase !== 'undefined' && db) {
        console.log("Attempting to record response for:", partnerName);
        db.collection("proposals").add({
            name: partnerName,
            response: "Yes",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log("Success: Response recorded in Firestore!");
            // alert("Response recorded! Check your dashboard."); // Optional: remove if annoying
        })
        .catch(err => {
            console.error("Firestore Error:", err);
            alert("Firebase Error: " + err.message + "\n\nPlease check your Firestore Rules (set to Test Mode).");
        });
    } else {
        console.error("Firebase not initialized correctly.");
        alert("Firebase is not loaded. Please check your internet connection.");
    }

    const currentPhase = document.getElementById('phase-3');
    gsap.to(currentPhase.querySelector('.card'), {
        y: -100, opacity: 0, duration: 0.6, ease: "power4.in", onComplete: () => {
            showPhase(4);
            
            // Set Date
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', options);
            
            triggerConfetti();
        }
    });
});

/* ─── PRINTING & UTILITIES ───────────────────────── */
if (printBtn) {
    printBtn.addEventListener('click', () => {
        window.print();
    });
}

function triggerConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4, y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.6, y: Math.random() - 0.2 } });
    }, 250);
}

musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add('playing');
    } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    }
});

// Floating Hearts
function createHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('i');
    heart.classList.add('fa-solid', 'fa-heart', 'heart');
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '110vh';
    heart.style.animationDuration = Math.random() * 3 + 3 + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 400);
