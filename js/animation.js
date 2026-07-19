import { gsap } from 'gsap';
import * as THREE from 'three';
import { updateHotspots } from './hotspots.js';

let time = 0;
let driftTarget = { x: 0, y: 0 };
let isCameraMoving = false;

export let basePosition = new THREE.Vector3(-260, 140.00, -90.00);
export let lookAtTarget = new THREE.Vector3(0, 10, 0);

export function flyToHotspot(targetPos) {
    isCameraMoving = true;
    const currentSpherical = new THREE.Spherical().setFromVector3(basePosition);
    const targetSpherical = new THREE.Spherical().setFromVector3(targetPos);
    
    const proxySpherical = currentSpherical.clone();
    
    // Orbit to match the target's horizontal angle (keeps current radius and phi)
    gsap.to(proxySpherical, {
        theta: targetSpherical.theta,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
            basePosition.setFromSpherical(proxySpherical);
        }
    });
    
    // Smoothly focus camera lookAt target onto the clicked hotspot
    gsap.to(lookAtTarget, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
            isCameraMoving = false;
        }
    });
}

export function resetCamera() {
    isCameraMoving = true;
    gsap.to(basePosition, {
        x: -260,
        y: 140.00,
        z: -90.00,
        duration: 2.0,
        ease: "power3.inOut"
    });
    
    gsap.to(lookAtTarget, {
        x: 0,
        y: 10,
        z: 0,
        duration: 2.0,
        ease: "power3.inOut",
        onComplete: () => {
            isCameraMoving = false;
        }
    });
}

export function startAnimationLoop(renderer, scene, camera) {
    // Force initial alignment once
    camera.lookAt(lookAtTarget);
    
    // Setup a continuous gentle drift using GSAP on a proxy object
    gsap.to(driftTarget, {
        x: 5,
        y: 2,
        duration: 10,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Apply subtle drift to the animated base position
        camera.position.x = basePosition.x + driftTarget.x * Math.sin(time * 0.5);
        camera.position.y = basePosition.y + driftTarget.y * Math.cos(time * 0.3);
        camera.position.z = basePosition.z + driftTarget.x * Math.cos(time * 0.4);
        
        if (isCameraMoving) {
            camera.lookAt(lookAtTarget);
        }
        
        // Update 2D hotspots to track 3D positions
        updateHotspots(camera);

        renderer.render(scene, camera);
    }
    
    animate();
}
