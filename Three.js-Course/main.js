import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

camera.position.z = 5;

document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(
  1, 1, 1
);
const material = new THREE.MeshBasicMaterial({
  color: 0x00FF00
});
const mesh = new THREE.Mesh(boxGeometry, material);

scene.add(mesh);

const planeGeometry = new THREE.PlaneGeometry(
  5, 5, 10, 10
);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.Double.Side
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh)

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
}

animate();