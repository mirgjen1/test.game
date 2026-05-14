import * as THREE from 'three';
import { createWorld } from './world.js';
import { Player } from './player.js';

// --- Initialization ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue
scene.fog = new THREE.Fog(0x87ceeb, 0, 75);   // Fog helps mask distant pop-in

// Setup Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- Game Modules ---
const world = createWorld(scene);
const player = new Player(scene, camera, document.body, world.shootableObjects, world.boundingBoxes);

// --- UI Overlay Logic ---
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', function () {
    player.controls.lock();
});

player.controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
});

player.controls.addEventListener('unlock', function () {
    blocker.style.display = 'flex';
    instructions.style.display = '';
});

// --- Window Resize Handling ---
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- Game Loop ---
let prevTime = performance.now();

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    // Update Player (Movement, Physics, Viewmodel)
    player.update(delta);

    // Render Scene
    renderer.render(scene, camera);

    prevTime = time;
}

// Start the loop
animate();
