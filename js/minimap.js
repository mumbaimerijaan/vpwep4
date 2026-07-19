import * as THREE from 'three';
import { basePosition } from './animation.js';
import { gsap } from 'gsap';
import { MAP_WORLD_SIZE } from './config.js'; 

let container, dot;
let isDragging = false;

export function initMinimap() {
    container = document.getElementById('mini-map');
    dot = document.getElementById('minimap-dot');
    
    if (!container || !dot) return;

    // 1. Render Loop for Dot Syncing
    function renderMinimap() {
        requestAnimationFrame(renderMinimap);
        
        // Sync dot position if not dragging
        if (!isDragging) {
            updateDotFromCamera();
        }
    }
    renderMinimap();

    // 2. Drag Logic
    setupDragLogic();
}

function updateDotFromCamera() {
    // Map basePosition (X, Z) to dot position (0-100%)
    const xPct = ((basePosition.x / (MAP_WORLD_SIZE/2)) * 0.5 + 0.5) * 100;
    const zPct = ((basePosition.z / (MAP_WORLD_SIZE/2)) * 0.5 + 0.5) * 100;
    
    dot.style.left = `${Math.max(0, Math.min(100, xPct))}%`;
    dot.style.top = `${Math.max(0, Math.min(100, zPct))}%`;
}

function setupDragLogic() {
    let rect;
    
    container.addEventListener('pointerdown', (e) => {
        isDragging = true;
        rect = container.getBoundingClientRect();
        updateCameraFromEvent(e);
        container.setPointerCapture(e.pointerId);
    });
    
    container.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        updateCameraFromEvent(e);
    });
    
    container.addEventListener('pointerup', (e) => {
        isDragging = false;
        container.releasePointerCapture(e.pointerId);
    });
    
    function updateCameraFromEvent(e) {
        // Calculate click position relative to center of minimap
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        // Clamp to circle (radius = 70px)
        const centerX = 70;
        const centerY = 70;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance > 70) {
            x = centerX + (dx / distance) * 70;
            y = centerY + (dy / distance) * 70;
        }
        
        // Update visual dot
        dot.style.left = `${(x / 140) * 100}%`;
        dot.style.top = `${(y / 140) * 100}%`;
        
        // Map back to 3D world space
        const worldX = ((x / 140) - 0.5) * MAP_WORLD_SIZE;
        const worldZ = ((y / 140) - 0.5) * MAP_WORLD_SIZE;
        
        // Use a fast GSAP tween to smooth out the mouse movement (eliminates jitter/jerkiness)
        gsap.to(basePosition, {
            x: worldX,
            z: worldZ,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto"
        });
    }
}

// Toggle minimap container natively upon view change
window.addEventListener('view-changed', (e) => {
    const minimapContainer = document.querySelector('.mini-map-container');
    if (minimapContainer) {
        minimapContainer.classList.toggle('hidden', e.detail !== 'landing');
    }
});
