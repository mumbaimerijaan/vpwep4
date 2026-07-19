import * as THREE from 'three';
import { LIGHTS_CONFIG } from './config.js';

export function setupLighting(scene) {
    const cfg = LIGHTS_CONFIG;
    
    // Hemisphere Light for soft ambient illumination (sunset sky color, ground color)
    const hemiLight = new THREE.HemisphereLight(cfg.hemiLight.skyColor, cfg.hemiLight.groundColor, cfg.hemiLight.intensity);
    hemiLight.position.set(cfg.hemiLight.pos.x, cfg.hemiLight.pos.y, cfg.hemiLight.pos.z);
    scene.add(hemiLight);

    // Directional Light for the main sun source (Sunset: warm, low angle)
    const dirLight = new THREE.DirectionalLight(cfg.dirLight.color, cfg.dirLight.intensity);
    dirLight.position.set(cfg.dirLight.pos.x, cfg.dirLight.pos.y, cfg.dirLight.pos.z);
    dirLight.castShadow = true;
    
    // Optimize shadows
    dirLight.shadow.mapSize.width = cfg.dirLight.shadowMapSize;
    dirLight.shadow.mapSize.height = cfg.dirLight.shadowMapSize;
    dirLight.shadow.camera.near = cfg.dirLight.shadowNear;
    dirLight.shadow.camera.far = cfg.dirLight.shadowFar;
    
    const d = cfg.dirLight.shadowFrustum;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = cfg.dirLight.shadowBias;

    scene.add(dirLight);

    // Gentle ambient light to fill in harsh black shadows
    const ambientLight = new THREE.AmbientLight(cfg.ambientLight.color, cfg.ambientLight.intensity);
    scene.add(ambientLight);
}
