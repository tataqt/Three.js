import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {
  OrbitControls
} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import './style.css';

// dat.gui constants
const gui = new dat.GUI();
// main constants
const mouse = {
  x: undefined,
  y: undefined
}
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
};
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const light = new THREE.DirectionalLight(0xffffff, 1);
const backLight = new THREE.DirectionalLight(0xffffff, 1);
const colors = [];

// init dat.gui modify plane
gui.add(world.plane, 'width', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 50).onChange(generatePlane);
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
  world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments
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
const randomValues = [];

// modify z index of mesh (verticy position)
for (let index = 0; index < array.length; index++) {
  if (index % 3 === 0) {
    const x = array[index];
    const y = array[index + 1];
    const z = array[index + 2];

    array[index] = x + Math.random() - 0.5;
    array[index + 1] = y + Math.random() - 0.5;
    array[index + 2] = z + Math.random();

  }
  randomValues.push(Math.random() - 0.5);
}

planeMesh.geometry.attributes.position.randomValues = randomValues;
planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;

// setColor
for (let index = 0; index < planeMesh.geometry.attributes.position.count; index++) {
  colors.push(0, .19, .4);
}

planeMesh.geometry.setAttribute('color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

// add to scene
scene.add(planeMesh);
scene.add(light);
scene.add(backLight);

let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  frame += 0.01;
  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);

  const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position;
  for (let index = 0; index < array.length; index += 3) {
    // x
    array[index] = originalPosition[index] + Math.cos(frame + randomValues[index]) * 0.003;
    // y
    array[index + 1] = originalPosition[index + 1] + Math.sin(frame + randomValues[index + 1]) * 0.003;
  }

  planeMesh.geometry.attributes.position.needsUpdate = true

  const intersects = raycaster.intersectObject(planeMesh);

  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    const initialColor = {
      r: 0,
      g: .19,
      b: .4
    };
    const hoverColor = {
      r: 0.1,
      g: .5,
      b: 1
    };

    gsap.to(hoverColor, {
      ...initialColor,
      onUpdate: () => {
        // vertice 1
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        // vertice 2
        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        // vertice 3
        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
        color.needsUpdate = true;
      }
    })
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

    array[index] = x + Math.random() - 0.5;
    array[index + 1] = y + Math.random() - 0.5;
    array[index + 2] = z + Math.random();
  }

  planeMesh.geometry.setAttribute('color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
}

animate();

// mousemove
addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
})