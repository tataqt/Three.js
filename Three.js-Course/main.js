import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1,1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);

document.body.appendChild(renderer.domElement)
console.log(scene, camera, renderer);