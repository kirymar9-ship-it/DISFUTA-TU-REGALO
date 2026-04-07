const canvas = document.getElementById('canvas-galaxia');
const btnStart = document.getElementById('btn-start');
const cancion = document.getElementById('mi-cancion');

/* =========================
   ESCENA 3D (Three.js)
========================= */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

/* =========================
   ESTRELLAS EN 3D
========================= */
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 8000;
const positions = [];
for (let i = 0; i < starsCount; i++) {
    positions.push((Math.random() - 0.5) * 5000, (Math.random() - 0.5) * 5000, (Math.random() - 0.5) * 5000);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xbc85ff, size: 2 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

/* =========================
   CAMINO DE RECUERDOS (FOTOS)
========================= */
const textureLoader = new THREE.TextureLoader();
const recuerdos = [];
const textos = [];

const fotos = [
    "https://picsum.photos/400/300?random=1",
    "https://picsum.photos/400/300?random=2",
    "https://picsum.photos/400/300?random=3",
    "https://picsum.photos/400/300?random=4",
    "https://picsum.photos/400/300?random=5",
    "https://picsum.photos/400/300?random=6",
    "https://picsum.photos/400/300?random=7",
    "https://picsum.photos/400/300?random=8"
];

const mensajes = [
    "Todo comenzó aquí...", "Un momento inolvidable", "Tu sonrisa cambió todo",
    "Aquí supe que eras especial", "El tiempo se detuvo", "Cada instante vale oro",
    "Eres mi lugar favorito", "Y esto es solo el comienzo..."
];

for (let i = 0; i < 8; i++) {
    const z = -i * 600 - 400; // Más espacio entre fotos
    const texture = textureLoader.load(fotos[i]);
    const material = new THREE.SpriteMaterial({ map: texture, opacity: 0 }); // Empiezan invisibles
    const sprite = new THREE.Sprite(material);
    sprite.position.set(Math.sin(i * 0.5) * 250, Math.cos(i * 0.3) * 150, z);
    sprite.scale.set(150, 100, 1);
    scene.add(sprite);
    recuerdos.push(sprite);

    // Texto de las fotos
    const canvasText = document.createElement("canvas");
    const ctx = canvasText.getContext("2d");
    canvasText.width = 512; canvasText.height = 128;
    ctx.fillStyle = "white";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(mensajes[i], 256, 64);
    
    const textureText = new THREE.CanvasTexture(canvasText);
    const textSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureText, opacity: 0 }));
    textSprite.position.set(sprite.position.x, sprite.position.y - 80, sprite.position.z);
    textSprite.scale.set(200, 50, 1);
    scene.add(textSprite);
    textos.push(textSprite);
}

/* =========================
   NAVEGACIÓN FLUÍDA
========================= */
let progreso = 0;
let targetProgreso = 0;

window.addEventListener('wheel', (e) => { targetProgreso += e.deltaY * 0.0005; });

let touchStartY = 0;
window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
window.addEventListener('touchmove', (e) => {
    let delta = touchStartY - e.touches[0].clientY;
    targetProgreso += delta * 0.001;
    touchStartY = e.touches[0].clientY;
});

function animate() {
    requestAnimationFrame(animate);
    progreso += (targetProgreso - progreso) * 0.05;

    camera.position.z = progreso * -3000 + 500;
    camera.position.x = Math.sin(progreso * 1.5) * 150;
    camera.position.y = Math.cos(progreso * 1.1) * 80;
    camera.lookAt(0, 0, camera.position.z - 1000);

    stars.rotation.y += 0.0005;

    recuerdos.forEach((r, i) => {
        const distancia = Math.abs(camera.position.z - r.position.z);
        const opacidad = Math.max(0, 1 - distancia / 1000);
        r.material.opacity = opacidad;
        textos[i].material.opacity = opacidad;
        if (distancia < 200) r.scale.set(180, 120, 1);
        else r.scale.set(150, 100, 1);
    });

    renderer.render(scene, camera);
}
animate();

/* =========================
   START & REGALO
========================= */
btnStart.addEventListener('click', () => {
    cancion.play().catch(() => {});

    gsap.to(".contenedor-texto", { 
        duration: 2, opacity: 0, y: -100, ease: "power2.inOut",
        onComplete: () => {
            document.querySelector(".contenedor-texto").style.display = "none";
            mostrarRegalo();
        }
    });

    // Pequeño impulso inicial al camino
    gsap.to({ val: 0 }, {
        val: 0.1, duration: 4, ease: "power1.inOut",
        onUpdate: function() { targetProgreso = this.targets()[0].val; }
    });
});

function mostrarRegalo() {
    const regalo = document.getElementById('regalo');
    regalo.style.display = "block";

    gsap.to("#regalo", { duration: 3, opacity: 1, y: 0, ease: "power3.out" });

    gsap.to("#luna", {
        duration: 15, x: -30, y: 30, repeat: -1, yoyo: true, ease: "sine.inOut"
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});