import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import * as dat from 'dat.gui';
import './style.css';

// dat.gui constants
const gui = new dat.GUI();
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10
  }
};
// main constants
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const light = new THREE.DirectionalLight(
  0xffffff, 1
);

// init dat.gui modify plane
gui.add(world.plane, 'width', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

camera.position.z = 5;
light.position.set(0, 0, 1);

scene.add(light);

document.body.appendChild(renderer.domElement);

// init plane
const planeGeometry = new THREE.PlaneGeometry(
  10, 10, 10, 10
);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
const {
  array
} = planeMesh.geometry.attributes.position;

scene.add(planeMesh);

// modify  z index of mesg
for (let index = 0; index < array.length; index += 3) {
  const x = array[index];
  const y = array[index + 1];
  const z = array[index + 2];

  array[index + 2] = z + Math.random();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  const {
    array
  } = planeMesh.geometry.attributes.position;

  for (let index = 0; index < array.length; index += 3) {
    const x = array[index];
    const y = array[index + 1];
    const z = array[index + 2];

    array[index + 2] = z + Math.random();
  }
}

animate();