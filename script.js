const canvas = document.getElementById('canvas-galaxia');
const btnStart = document.getElementById('btn-start');
const cancion = document.getElementById('mi-cancion');

/* =========================
   ESCENA
========================= */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
5000
);

const renderer = new THREE.WebGLRenderer({
canvas: canvas,
alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

/* =========================
   ESTRELLAS
========================= */
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 8000;
const positions = [];

for (let i = 0; i < starsCount; i++) {
positions.push(
(Math.random() - 0.5) * 5000,
(Math.random() - 0.5) * 5000,
(Math.random() - 0.5) * 5000
);
}

starsGeometry.setAttribute(
'position',
new THREE.Float32BufferAttribute(positions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
color: 0xbc85ff,
size: 2
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

/* =========================
   CAMINO DE RECUERDOS
========================= */

const textureLoader = new THREE.TextureLoader();

const recuerdos = [];
const textos = [];

/* 8 fotos (puedes cambiar luego) */
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
"Todo comenzó aquí...",
"Un momento que nunca olvidaré",
"Tu sonrisa cambió todo",
"Aquí supe que eras especial",
"El tiempo se detuvo contigo",
"Cada instante contigo vale oro",
"Eres mi lugar favorito",
"Y este es solo el comienzo..."
];

/* CREAR CAMINO */
for (let i = 0; i < 8; i++) {

const z = -i * 400 - 200;

/* FOTO */
const texture = textureLoader.load(fotos[i]);
const material = new THREE.SpriteMaterial({ map: texture });
const sprite = new THREE.Sprite(material);

sprite.position.set(
Math.sin(i * 0.5) * 200,
Math.cos(i * 0.3) * 100,
z
);

sprite.scale.set(120, 80, 1);

scene.add(sprite);
recuerdos.push(sprite);

/* TEXTO (canvas dinámico) */
const canvasText = document.createElement("canvas");
const ctx = canvasText.getContext("2d");

canvasText.width = 512;
canvasText.height = 256;

ctx.fillStyle = "white";
ctx.font = "28px Playfair Display";
ctx.textAlign = "center";
ctx.fillText(mensajes[i], 256, 130);

const textureText = new THREE.CanvasTexture(canvasText);

const materialText = new THREE.SpriteMaterial({ map: textureText });
const textSprite = new THREE.Sprite(materialText);

textSprite.position.set(
sprite.position.x,
sprite.position.y - 100,
sprite.position.z
);

textSprite.scale.set(200, 80, 1);

scene.add(textSprite);
textos.push(textSprite);
}

/* =========================
   MOVIMIENTO (PROGRESO)
========================= */

let progreso = 0;
let targetProgreso = 0;

/* SCROLL */
window.addEventListener('wheel', (e) => {
targetProgreso += e.deltaY * 0.0005;
});

/* TOUCH */
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
let delta = touchStartY - e.touches[0].clientY;
targetProgreso += delta * 0.0003;
touchStartY = e.touches[0].clientY;
});

/* =========================
   ANIMACIÓN
========================= */
function animate() {
requestAnimationFrame(animate);

/* suavizado */
progreso += (targetProgreso - progreso) * 0.05;

/* mover cámara en Z */
camera.position.z = progreso * -2000 + 5;

/* leve movimiento lateral */
camera.position.x = Math.sin(progreso * 2) * 100;
camera.position.y = Math.cos(progreso * 1.5) * 50;

/* rotación universo */
stars.rotation.y += 0.0005;

/* EFECTO ACERCAMIENTO */
recuerdos.forEach((r, i) => {
const distancia = Math.abs(camera.position.z - r.position.z);

if (distancia < 150) {
r.scale.set(180, 120, 1);
textos[i].material.opacity = 1;
} else {
r.scale.set(120, 80, 1);
textos[i].material.opacity = 0.2;
}
});

renderer.render(scene, camera);
}

animate();

/* =========================
   START
========================= */
btnStart.addEventListener('click', () => {

cancion.play().catch(() => {});

gsap.to(".contenedor-texto", {
duration: 1.5,
opacity: 0,
y: -30,
onComplete: () => {
document.querySelector(".contenedor-texto").style.display = "none";
}
});

/* inicio suave */
gsap.to({ val: 0 }, {
val: 0.2,
duration: 3,
onUpdate: function() {
targetProgreso = this.targets()[0].val;
}
});

});

/* =========================
   RESPONSIVE
========================= */
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});