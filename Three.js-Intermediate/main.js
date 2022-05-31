import * as THREE from 'three';
import gsap from 'gsap';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import atmosphereVertex from './shaders/atmosphereVertex.glsl';
import atmosphereFragment from './shaders/atmosphereFragment.glsl';
import { Float32BufferAttribute } from 'three';

// main constants
const mouse = {
  x: 0,
  y: 0
}
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
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./img/globe.jpg')
      }
    }
  })
);

// create a atmosphere 
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
);

// scale atmosphere
atmosphere.scale.set(1.1, 1.1, 1.1);

// create a group
const group = new THREE.Group();
group.add(sphere);

// create star
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
});

const starVertices = [];
//create x, y, z positions
for (let index = 0; index < 10000; index++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  starVertices.push(x, y, z)
}

//set stars position
starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(
  starGeometry,
  starMaterial
);


scene.add(group);
scene.add(atmosphere);
scene.add(stars);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.001;
  gsap.to(group.rotation, {
    x: -mouse.y * 0.5,
    y: mouse.x * 0.5,
    duration: 2
  });
}

animate();

addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
});