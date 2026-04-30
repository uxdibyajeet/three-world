// Author: Dibyajeet Kirttania
// Date: 30 April, 2026

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene, Camera and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

const app = document.querySelector('.app');
app.appendChild(renderer.domElement);

//Controls and Loaders

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();

//add cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate( time ) {
    controls.update();
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );