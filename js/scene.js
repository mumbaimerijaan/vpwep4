import * as THREE from 'three';

export let scene;

function createRadialAlphaMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Radial gradient: white in center (opaque), black at edges (transparent)
    const gradient = ctx.createRadialGradient(512, 512, 200, 512, 512, 500);
    gradient.addColorStop(0, '#ffffff'); // Opaque
    gradient.addColorStop(0.7, '#ffffff'); // Stay opaque for 70% of the radius
    gradient.addColorStop(1, '#000000'); // Fade to transparent at the very edge
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);
    
    return new THREE.CanvasTexture(canvas);
}

export function initScene() {
    scene = new THREE.Scene();
    
    // Remove fog since we are now blending via alpha transparency directly into the skybox
    // scene.fog = new THREE.FogExp2(0x3a2e35, 0.002);
    
    // Setup skybox (HDRI Panorama) as a physical sphere so we can move it vertically
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load('assets/images/skybox.png', () => {
        bgTexture.colorSpace = THREE.SRGBColorSpace;
        
        // Scale down the texture visually by 50% by tiling it
        bgTexture.wrapS = THREE.RepeatWrapping;
        bgTexture.wrapT = THREE.RepeatWrapping;
        bgTexture.repeat.set(2, 2);
        
        // Keep it as environment for reflections on the stadium
        bgTexture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = bgTexture;
        
        const skyGeo = new THREE.SphereGeometry(8000, 60, 40);
        const skyMat = new THREE.MeshBasicMaterial({ 
            map: bgTexture, 
            side: THREE.BackSide,
            depthWrite: false
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        
        // Moved sphere UP (from -800 to -600) to move the texture DOWN
        sky.position.y = -600; 
        
        // Rotated slightly more to move the texture LEFT
        sky.rotation.y = (Math.PI / 4) + 0.15;
        
        scene.add(sky);
    });

    // Setup floor plane (Top View map)
    const floorTexture = textureLoader.load('assets/images/floor.png');
    floorTexture.colorSpace = THREE.SRGBColorSpace;
    floorTexture.wrapS = THREE.ClampToEdgeWrapping;
    floorTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Use a CircleGeometry
    const floorGeometry = new THREE.CircleGeometry(1437.5, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        alphaMap: createRadialAlphaMap(),
        transparent: true,
        roughness: 0.9,
        metalness: 0.1,
        depthWrite: false // Helps prevent z-fighting transparent edges with the sky
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);
}
