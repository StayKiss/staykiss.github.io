// --- 1. INTERACTIVE ZERO-GRAVITY PARTICLES (CANVAS) ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let mouse = { x: null, y: null, radius: 120 }; // Radius area efek kursor

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Ukuran partikel bervariasi
        this.speedX = (Math.random() * 1) - 0.5; // Kecepatan melayang X
        this.speedY = (Math.random() * 1) - 0.5; // Kecepatan melayang Y
        this.color = 'rgba(255, 255, 255, 0.7)'; // Warna putih semi-transparan (cocok dengan pastel)
    }
    
    update() {
        // Pergerakan alami (Zero-G)
        this.x += this.speedX;
        this.y += this.speedY;

        // Memantul jika mengenai tepi layar
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

        // INTERAKSI DENGAN KURSOR (REPEL EFFECT / MENGHINDAR)
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Menghitung kekuatan dorongan berdasarkan seberapa dekat kursor
                const force = (mouse.radius - distance) / mouse.radius;
                const forceX = (dx / distance) * force * 4; 
                const forceY = (dy / distance) * force * 4;
                
                // Mendorong partikel menjauh dari kursor
                this.x -= forceX;
                this.y -= forceY;
            }
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inisialisasi Partikel
function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 12000; // Jumlah partikel disesuaikan ukuran layar
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Animasi Loop Partikel
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan frame sebelumnya
    
    // Menggambar dan mengupdate setiap partikel
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // (Opsional) Membuat garis tipis antar partikel jika mereka saling berdekatan
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance/400})`; // Garis semakin pudar jika jauh
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

// Responsive Canvas
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animateParticles();


// --- 2. CUSTOM CURSOR LOGIC ---
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

const interactables = document.querySelectorAll("a, .btn, .social-btn");
interactables.forEach(el => {
    el.addEventListener("mouseenter", () => {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorOutline.style.backgroundColor = "rgba(159, 170, 216, 0.2)";
    });
    el.addEventListener("mouseleave", () => {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.backgroundColor = "transparent";
    });
});

// --- 3. SCROLL TRIGGER REVEAL ANIMATION ---
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100; 

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal();

// --- 4. TYPEWRITER EFFECT ---
const words = ["Curious Learner", "Problem Solver", "Lifelong Learner"];
let typingIndex = 0;
let timer;

function typingEffect() {
    let word = words[typingIndex].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('typewriter').innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000);
            return false;
        }
        timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[typingIndex].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('typewriter').innerHTML = word.join("");
        } else {
            if (words.length > (typingIndex + 1)) {
                typingIndex++;
            } else {
                typingIndex = 0;
            }
            typingEffect();
            return false;
        }
        timer = setTimeout(loopDeleting, 50);
    };
    loopDeleting();
}

window.onload = function() {
    typingEffect();
};

// Reset mouse position saat kursor keluar layar agar partikel kembali tenang
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});