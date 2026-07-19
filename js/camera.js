import * as THREE from 'three';
import { CAMERA_CONFIG } from './config.js';

export let camera;
export let cameraPivot;

export function initCamera(container) {
    const cfg = CAMERA_CONFIG;
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    
    camera = new THREE.PerspectiveCamera(
        cfg.fov,
        width / height,
        cfg.near,
        cfg.far
    );
    
    // Final view position with camera initial parameters
    camera.position.set(cfg.initialPos.x, cfg.initialPos.y, cfg.initialPos.z); 
    
    // Look slightly downwards towards the stadium center
    camera.lookAt(cfg.lookAt.x, cfg.lookAt.y, cfg.lookAt.z);
    
    camera.zoom = cfg.zoom;
    camera.updateProjectionMatrix();

    // Create a pivot for the camera drift animation
    cameraPivot = new THREE.Group();
    cameraPivot.add(camera);
}
