// Author: Dibyajeet Kirttania
// Date: 30 April, 2026

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Ortographic Camera
function createCamera (zoom = 5) {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
        -zoom * aspectRatio, //left
        zoom * aspectRatio, //right
        zoom, //top
        -zoom, //bottom
        0.1, //near
        1000 //far
    );
    camera.position.set(zoom, zoom, zoom);
    camera.lookAt(0, 0 , 0);

    return camera;
}

const zoomLevel = 5;
let mainCamera = createCamera(zoomLevel);

// Scene, Camera and Renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

const app = document.querySelector('.app');
app.appendChild(renderer.domElement);

//Controls and Loaders
const controls = new OrbitControls( mainCamera, renderer.domElement );
const loader = new GLTFLoader();

//add cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate( time ) {
    controls.update();
    renderer.render( scene, mainCamera );
}
renderer.setAnimationLoop( animate );