const canvas = document.getElementById('canvas-galaxia');
const btnStart = document.getElementById('btn-start');
const cancion = document.getElementById('mi-cancion');

/* =========================
   ESCENA THREE
========================= */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
3000
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
const starsCount = 6000;
const positions = [];

for (let i = 0; i < starsCount; i++) {
positions.push(
(Math.random() - 0.5) * 4000,
(Math.random() - 0.5) * 4000,
(Math.random() - 0.5) * 4000
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
   RECUERDOS (8 FOTOS)
========================= */
const textureLoader = new THREE.TextureLoader();

const recuerdos = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const fotos = [
"https://i.imgur.com/1.jpg",
"https://i.imgur.com/2.jpg",
"https://i.imgur.com/3.jpg",
"https://i.imgur.com/4.jpg",
"https://i.imgur.com/5.jpg",
"https://i.imgur.com/6.jpg",
"https://i.imgur.com/7.jpg",
"https://i.imgur.com/8.jpg"
];

for (let i = 0; i < 8; i++) {

const texture = textureLoader.load(fotos[i]);

const material = new THREE.SpriteMaterial({ map: texture });
const sprite = new THREE.Sprite(material);

// distribuir en el espacio
sprite.position.set(
(Math.random() - 0.5) * 800,
(Math.random() - 0.5) * 600,
- (Math.random() * 800 + 200)
);

sprite.scale.set(120, 80, 1);

scene.add(sprite);
recuerdos.push(sprite);
}

/* =========================
   CÁMARA
========================= */
camera.position.z = 5;

/* =========================
   INTERACCIÓN CLICK
========================= */
window.addEventListener('click', (event) => {

mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

raycaster.setFromCamera(mouse, camera);

const intersects = raycaster.intersectObjects(recuerdos);

if (intersects.length > 0) {

const target = intersects[0].object;

/* VIAJE HACIA EL RECUERDO */
gsap.to(camera.position, {
x: target.position.x,
y: target.position.y,
z: target.position.z + 100,
duration: 2,
ease: "power2.inOut"
});

/* EFECTO ENFOQUE */
gsap.to(target.scale, {
x: 180,
y: 120,
duration: 1
});

/* VOLVER DESPUÉS DE UN TIEMPO */
setTimeout(() => {
gsap.to(camera.position, {
x: 0,
y: 0,
z: 5,
duration: 3,
ease: "power3.inOut"
});

gsap.to(target.scale, {
x: 120,
y: 80,
duration: 1
});

}, 4000);

}

});

/* =========================
   SCROLL = AVANZAR
========================= */
window.addEventListener('wheel', (e) => {
camera.position.z += e.deltaY * 0.05;
});

/* =========================
   MOUSE = MIRAR
========================= */
window.addEventListener('mousemove', (e) => {
const x = (e.clientX / window.innerWidth) - 0.5;
const y = (e.clientY / window.innerHeight) - 0.5;

camera.position.x = x * 20;
camera.position.y = -y * 20;
});

/* =========================
   ANIMACIÓN
========================= */
function animate() {
requestAnimationFrame(animate);

stars.rotation.y += 0.0005;

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

/* VIAJE INICIAL */
gsap.to(camera.position, {
z: -100,
duration: 5,
ease: "power2.inOut"
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