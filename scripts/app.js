// Author: Dibyajeet Kirttania
// Date: 30 April, 2026

import * as THREE from 'three';


// Global Variables
let scene, camera, renderer, player;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

//Config
const CONFIG = {
    zoom: 5,
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

    // add Light
    function addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);
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

    //update camera
    function updateCamera() {
    // Only follow if we aren't actively dragging the mouse
        if (!isDragging) {
            const offset = new THREE.Vector3(CONFIG.zoom, CONFIG.zoom, CONFIG.zoom);
            const targetPosition = player.mesh.position.clone().add(offset);
            
            // Smoothly slide the camera toward the player
            camera.position.lerp(targetPosition, 0.1);
        }
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

// Spawn Player
function spawnPlayer() {
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const player = new THREE.Mesh(geometry, material);
    
    player.position.y = 1; // Half-height (0.5) + radius (0.5)
    scene.add(player);
    
    return {
        mesh: player,
        velocity: new THREE.Vector3(),
        speed: 0.1,
        isJumping: false
    };
}

    // update player
    function updatePlayer() {
    // Horizontal Movement
    if (keys.w || keys.ArrowUp) player.mesh.position.z -= player.speed;
    if (keys.s || keys.ArrowDown) player.mesh.position.z += player.speed;
    if (keys.a || keys.ArrowLeft) player.mesh.position.x -= player.speed;
    if (keys.d || keys.ArrowRight) player.mesh.position.x += player.speed;

    // Jump Logic (Basic)
    if (keys.Space && !player.isJumping) {
        player.velocity.y = 0.2;
        player.isJumping = true;
    }
    
    // Apply gravity and update Y
    // ... logic for falling back to y=1
}


// Interactions
    // Player Controlls
    const keys = {
        w: false, a: false, s: false, d: false,
        ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
        Space: false, e: false, Enter: false
    }
    window.addEventListener('keydown', (e) => { if (e.code in keys || e.key in keys) keys[e.code || e.key] = true; });
    window.addEventListener('keyup', (e) => { if (e.code in keys || e.key in keys) keys[e.code || e.key] = false; });

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
    
    const moveX = (deltaX + deltaY) * CONFIG.panSpeed;
    const moveZ = (-deltaX + deltaY) * CONFIG.panSpeed;

    camera.position.x -= moveX;
    camera.position.z -= moveZ;

    previousMousePosition = { x: e.clientX, y: e.clientY };
    });
}

// Execute
initScene();
player = spawnPlayer();
createGround();
setupPanControls(); // The dragging logic we discussed
addLights();

function animate() {
    if (player) {
        updatePlayer();
        updateCamera();
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);