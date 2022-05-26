import * as THREE from 'three';

// main constants
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

// init plane
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); 

document.body.appendChild(renderer.domElement);

camera.position.z = 10;

// create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.MeshBasicMaterial({
    // color: 0xFF0000
    map: new THREE.TextureLoader().load('./img/globe.jpg')
  })
);

scene.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();