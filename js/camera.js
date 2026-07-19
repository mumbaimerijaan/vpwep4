import * as THREE from 'three';

export let camera;
export let cameraPivot;

export function initCamera(container) {
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    
    camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        10000 // Increased far plane to see massive floor
    );
    
    // Final view position with 20% more breathing room
    camera.position.set(-260, 140.00, -90.00); 
    
    // Look slightly downwards towards the stadium center
    camera.lookAt(0, 10, 0);
    
    camera.zoom = 1.0;
    camera.updateProjectionMatrix();

    // Create a pivot for the camera drift animation
    cameraPivot = new THREE.Group();
    cameraPivot.add(camera);
}
