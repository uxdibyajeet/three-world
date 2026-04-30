// Author: Dibyajeet Kirttania
// Date: 30 April, 2026

import * as THREE from 'three';


// Global Variables
let scene, camera, renderer, cube;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

//Config
const CONFIG = {
    zoom: 8,
    gridSize: 100,
    gridDivisions: 100,
    panSpeed: 0.01,
    colors: {
        ground: 0x222222,
        grid: 0x444444,
        cube: 0x00ff00
    }
};

// Core Functions: scene, camera and renderer

    // Scene Initialization
    function initScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('.app').appendChild(renderer.domElement);

        camera = createCamera(CONFIG.zoom);
        window.addEventListener('resize', onWindowResize);
    }

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

    // Window Resize
    function onWindowResize() {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -CONFIG.zoom * aspect;
        camera.right = CONFIG.zoom * aspect;
        camera.top = CONFIG.zoom;
        camera.bottom = -CONFIG.zoom;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


// Create World
function createGround() {
    const grid = new THREE.GridHelper(
        CONFIG.gridSize, 
        CONFIG.gridDivisions, 
        CONFIG.colors.grid, 
        CONFIG.colors.grid
    );
    scene.add(grid);

    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.MeshBasicMaterial({ 
        color: CONFIG.colors.ground, 
        visible: false // Keep it invisible if you just want the grid lines
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Lay it flat
    scene.add(plane);
}

// Create Cube 
function createObjects() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: CONFIG.colors.cube });
    cube = new THREE.Mesh(geometry, material);
    // Lift cube so it sits ON the plane
    cube.position.y = 0.5; 
    scene.add(cube);
}


// Interactions
    //Pan Controlls
    function setupPanControls() {
    window.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = 'default';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    // To invert the Up/Down movement, we swap the signs for deltaY
    // Old: (deltaX - deltaY) -> New: (deltaX + deltaY)
    // Old: (-deltaX - deltaY) -> New: (-deltaX + deltaY)
    
    const moveX = (deltaX + deltaY) * CONFIG.panSpeed;
    const moveZ = (-deltaX + deltaY) * CONFIG.panSpeed;

    camera.position.x -= moveX;
    camera.position.z -= moveZ;

    previousMousePosition = { x: e.clientX, y: e.clientY };
    });
}

// Execute
initScene();
createGround();
createObjects();
setupPanControls(); // The dragging logic we discussed

function animate() {
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);