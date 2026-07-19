import * as THREE from 'three';

export function setupLighting(scene) {
    // Hemisphere Light for soft ambient illumination (sunset sky color, ground color)
    const hemiLight = new THREE.HemisphereLight(0xffa07a, 0x444444, 0.6);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    // Directional Light for the main sun source (Sunset: warm, low angle)
    const dirLight = new THREE.DirectionalLight(0xffdcb4, 1.2);
    // Lower angle for sunset, coming from the back-right (approx 210 rotation)
    dirLight.position.set(-100, 50, -200);
    dirLight.castShadow = true;
    
    // Optimize shadows
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 800;
    
    const d = 250;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;

    scene.add(dirLight);

    // Gentle ambient light to fill in harsh black shadows
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.4);
    scene.add(ambientLight);
}
