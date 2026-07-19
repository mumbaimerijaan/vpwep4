import { initScene, scene } from './scene.js';
import { initRenderer, renderer } from './renderer.js';
import { initCamera, camera } from './camera.js';
import { setupLighting } from './lighting.js';
import { loadModel } from './loaders.js';
import { startAnimationLoop, resetCamera, basePosition, lookAtTarget } from './animation.js';
import { initUI } from './ui.js';
import { gsap } from 'gsap';
import { setupHotspots, updateHotspots } from './hotspots.js';
import { initMinimap } from './minimap.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initNotificationUI } from './notification-ui.js';
import { initDashboard } from './dashboard.js';

async function init() {
    const container = document.getElementById('canvas-container');
    
    initRenderer(container);
    initScene();
    initCamera(container);
    
    setupLighting(scene);
    
    let stadiumModel;
    try {
        stadiumModel = await loadModel(scene);
        window.stadiumModel = stadiumModel; // Export for minimap rendering
        console.log('Model loaded successfully.');
    } catch (error) {
        console.error('Error loading model:', error);
    }
    
    setupHotspots(scene, camera, container);
    initUI();
    initMinimap();
    initNotificationUI();
    initDashboard();
    
    // Start the cinematic camera fly system and animation loop
    startAnimationLoop(renderer, scene, camera);

    // Switch between Landing Page and Operations Dashboard
    const btnHome = document.getElementById('dock-home');
    const btnOperations = document.getElementById('dock-operations');
    const infoCard = document.getElementById('info-card');
    const btnReturn = document.getElementById('btn-return');

    function showDashboard() {
        window.dispatchEvent(new CustomEvent('view-changed', { detail: 'dashboard' }));
    }

    function showLandingPage() {
        window.dispatchEvent(new CustomEvent('view-changed', { detail: 'landing' }));
    }

    // Natively update app-specific layout states based on event
    window.addEventListener('view-changed', (e) => {
        document.querySelectorAll('.dock-item').forEach(item => item.classList.remove('active'));
        if (e.detail === 'dashboard') {
            if (btnOperations) btnOperations.classList.add('active');
            if (infoCard) infoCard.classList.add('hidden');
            if (btnReturn) btnReturn.classList.add('hidden');
        } else {
            if (btnHome) btnHome.classList.add('active');
            resetCamera();
        }
    });

    if (btnHome) btnHome.addEventListener('click', showLandingPage);
    if (btnOperations) btnOperations.addEventListener('click', showDashboard);

    // Bind "View Details" button on Info Card to switch to Operations Dashboard
    const btnViewDetails = infoCard ? infoCard.querySelector('.primary-btn') : null;
    if (btnViewDetails) {
        btnViewDetails.addEventListener('click', showDashboard);
    }

    // Hook up Return Button
    if (btnReturn) {
        btnReturn.addEventListener('click', () => {
            resetCamera();
            infoCard.classList.add('hidden');
            btnReturn.classList.add('hidden');
        });
    }
    
    // Debug Panel Setup
    const dbgPanel = document.getElementById('debug-panel');
    const camGroup = document.getElementById('debug-cam-group');
    const modGroup = document.getElementById('debug-mod-group');

    const cx = document.getElementById('dbg-cx');
    const cy = document.getElementById('dbg-cy');
    const cz = document.getElementById('dbg-cz');
    const tx = document.getElementById('dbg-tx');
    const ty = document.getElementById('dbg-ty');
    const tz = document.getElementById('dbg-tz');
    const zoom = document.getElementById('dbg-zoom');
    
    const mx = document.getElementById('dbg-mx');
    const my = document.getElementById('dbg-my');
    const mz = document.getElementById('dbg-mz');
    const rx = document.getElementById('dbg-rx');
    const ry = document.getElementById('dbg-ry');
    const rz = document.getElementById('dbg-rz');
    const mscale = document.getElementById('dbg-mscale');

    const output = document.getElementById('debug-output');
    let currentMode = 'camera';

    function updateDebugOutput() {
        if (currentMode === 'camera') {
            output.value = `pos: new THREE.Vector3(${cx.value}, ${cy.value}, ${cz.value})\ntarget: new THREE.Vector3(${tx.value}, ${ty.value}, ${tz.value})\nzoom: ${zoom.value}`;
        } else {
            output.value = `pos: new THREE.Vector3(${mx.value}, ${my.value}, ${mz.value})\nrot: new THREE.Euler(${rx.value}, ${ry.value}, ${rz.value})\nscale: new THREE.Vector3(${mscale.value}, ${mscale.value}, ${mscale.value})`;
        }
    }

    // Helper to safely parse numbers with defaults
    const parseSafe = (val, def = 0) => {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? def : parsed;
    };

    [cx, cy, cz, tx, ty, tz, zoom].forEach(input => {
        input.addEventListener('input', () => {
            gsap.killTweensOf(basePosition);
            gsap.killTweensOf(lookAtTarget);
            gsap.killTweensOf(camera);
            basePosition.set(parseSafe(cx.value, 0), parseSafe(cy.value, 0), parseSafe(cz.value, 0));
            lookAtTarget.set(parseSafe(tx.value, 0), parseSafe(ty.value, 0), parseSafe(tz.value, 0));
            camera.zoom = parseSafe(zoom.value, 1);
            camera.updateProjectionMatrix();
            updateDebugOutput();
        });
    });

    [mx, my, mz, rx, ry, rz, mscale].forEach(input => {
        input.addEventListener('input', () => {
            if (!stadiumModel) return;
            stadiumModel.position.set(parseSafe(mx.value, 0), parseSafe(my.value, 0), parseSafe(mz.value, 0));
            stadiumModel.rotation.set(parseSafe(rx.value, 0), parseSafe(ry.value, 0), parseSafe(rz.value, 0));
            const s = parseSafe(mscale.value, 1);
            stadiumModel.scale.set(s, s, s);
            updateDebugOutput();
        });
    });

    document.getElementById('btn-debug-copy').addEventListener('click', () => {
        navigator.clipboard.writeText(output.value);
        dbgPanel.classList.add('hidden');
    });

    document.getElementById('btn-debug-cancel').addEventListener('click', () => {
        dbgPanel.classList.add('hidden');
    });

    window.showDebugPanel = function(title, mode = 'camera') {
        currentMode = mode;
        dbgPanel.classList.remove('hidden');
        document.getElementById('debug-title').innerText = title + " (Debug)";
        
        if (mode === 'camera') {
            camGroup.classList.remove('hidden');
            modGroup.classList.add('hidden');
            cx.value = basePosition.x.toFixed(2);
            cy.value = basePosition.y.toFixed(2);
            cz.value = basePosition.z.toFixed(2);
            tx.value = lookAtTarget.x.toFixed(2);
            ty.value = lookAtTarget.y.toFixed(2);
            tz.value = lookAtTarget.z.toFixed(2);
            zoom.value = camera.zoom.toFixed(2);
        } else {
            camGroup.classList.add('hidden');
            modGroup.classList.remove('hidden');
            if (stadiumModel) {
                mx.value = stadiumModel.position.x.toFixed(2);
                my.value = stadiumModel.position.y.toFixed(2);
                mz.value = stadiumModel.position.z.toFixed(2);
                rx.value = stadiumModel.rotation.x.toFixed(2);
                ry.value = stadiumModel.rotation.y.toFixed(2);
                rz.value = stadiumModel.rotation.z.toFixed(2);
                mscale.value = stadiumModel.scale.x.toFixed(2);
            }
        }
        updateDebugOutput();
    };

    // Click canvas to show debug for Main View
    // renderer.domElement.addEventListener('click', () => {
    //     window.showDebugPanel("Main View", "camera");
    // });
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
}

init();
