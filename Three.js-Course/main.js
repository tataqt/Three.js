import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {
  OrbitControls
} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
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
const mouse = {
  x: undefined,
  y: undefined
}
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const light = new THREE.DirectionalLight(0xffffff, 1);
const backLight = new THREE.DirectionalLight(0xffffff, 1);
const colors = [];

// init dat.gui modify plane
gui.add(world.plane, 'width', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

// create orbit controls
new OrbitControls(camera, renderer.domElement);

// set positions
camera.position.z = 5;
light.position.set(0, 0, 1);
backLight.position.set(0, 0, -1);

document.body.appendChild(renderer.domElement);

// init plane
const planeGeometry = new THREE.PlaneGeometry(
  10, 10, 10, 10
);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
const {
  array
} = planeMesh.geometry.attributes.position;

// add to scene
scene.add(planeMesh);
scene.add(light);
scene.add(backLight);

// modify z index of mesh
for (let index = 0; index < array.length; index += 3) {
  const x = array[index];
  const y = array[index + 1];
  const z = array[index + 2];

  array[index + 2] = z + Math.random();
}

// setColor
for (let index = 0; index < planeMesh.geometry.attributes.position.count; index++) {
  colors.push(0, 0, 1);
}

planeMesh.geometry.setAttribute('color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObject(planeMesh);
  if (intersect.length) {
    
    intersect[0].object.geometry.attributes.color.setX(1, 0)
    intersect[0].object.geometry.attributes.color.needsUpdate = 1;

    console.log(intersect[0].object.geometry.attributes.color.getX());
  }
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

// mousemove
addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
})