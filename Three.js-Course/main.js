import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const light = new THREE.DirectionalLight(
  0xffffff, 1
);

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

camera.position.z = 5;
light.position.set(0, 0, 1);

scene.add(light);

document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(
  5, 5, 10, 10
);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
const { array } = planeMesh.geometry.attributes.position;

scene.add(planeMesh);

for (let index = 0; index < array.length; index += 3) {
  const x = array[index];
  const y = array[index + 1];
  const z = array[index + 2];

  array[index + 2] = z + Math.random();

  console.log(x, y, z);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();