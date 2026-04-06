const canvas = document.getElementById('canvas-galaxia');
const ctx = canvas.getContext('2d');
const btnStart = document.getElementById('btn-start');
const cancion = document.getElementById('mi-cancion');

let particulas = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particula {
    constructor() {
        this.radio = Math.random() * (canvas.width / 1.2); 
        this.angulo = Math.random() * Math.PI * 2;
        this.velocidad = Math.random() * 0.003 + 0.001;
        this.tamaño = Math.random() * 2 + 0.5;
        // Color inicial: Púrpura Sayonara
        this.color = `hsl(${Math.random() * 50 + 260}, 80%, 70%)`;
    }

    actualizar() {
        this.angulo += this.velocidad;
    }

    dibujar() {
        const x = canvas.width / 2 + Math.cos(this.angulo) * this.radio;
        const y = canvas.height / 2 + Math.sin(this.angulo) * this.radio;
        
        ctx.beginPath();
        ctx.arc(x, y, this.tamaño, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function init() {
    particulas = [];
    for (let i = 0; i < 300; i++) {
        particulas.push(new Particula());
    }
}

function animar() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particulas.forEach(p => {
        p.actualizar();
        p.dibujar();
    });
    requestAnimationFrame(animar);
}

init();
animar();

// --- ACCIÓN AL DAR CLIC EN START ---
btnStart.addEventListener('click', () => {
    // 1. SOLUCIÓN AUDIO: Reproducir al clic
    cancion.play().catch(error => console.log("Error de audio:", error));

    // 2. Desvanecer la intro
    gsap.to(".contenedor-texto", { 
        duration: 1.5, 
        opacity: 0, 
        y: -30, 
        onComplete: () => {
            document.querySelector(".contenedor-texto").style.display = "none";
            mostrarRegalo();
        }
    });

    // 3. Efecto visual: Las estrellas cambian a color girasol (dorado/amarillo)
    particulas.forEach(p => {
        p.color = `hsl(${Math.random() * 15 + 45}, 100%, 60%)`; 
        p.velocidad *= 1.5; 
    });
});

function mostrarRegalo() {
    const regalo = document.getElementById('regalo');
    regalo.style.display = "block";

    // Animación de entrada de la carta
    gsap.fromTo("#regalo", 
        { opacity: 0, scale: 0.9, y: 40 }, 
        { duration: 2, opacity: 1, scale: 1, y: 0, ease: "power3.out" }
    );

    // Brillo animado en el título
    gsap.to("#titulo-regalo", {
        duration: 2,
        textShadow: "0 0 20px rgba(188, 133, 255, 0.8)",
        repeat: -1,
        yoyo: true
    });
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});