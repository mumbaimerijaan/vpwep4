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
    
    // Start the cinematic camera fly system and animation loop
    startAnimationLoop(renderer, scene, camera);

    // Hook up Return Button
    document.getElementById('btn-return').addEventListener('click', () => {
        resetCamera();
        document.getElementById('info-card').classList.add('hidden');
        document.getElementById('btn-return').classList.add('hidden');
    });
    
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

    [cx, cy, cz, tx, ty, tz, zoom].forEach(input => {
        input.addEventListener('input', () => {
            gsap.killTweensOf(basePosition);
            gsap.killTweensOf(lookAtTarget);
            gsap.killTweensOf(camera);
            basePosition.set(parseFloat(cx.value), parseFloat(cy.value), parseFloat(cz.value));
            lookAtTarget.set(parseFloat(tx.value), parseFloat(ty.value), parseFloat(tz.value));
            camera.zoom = parseFloat(zoom.value) || 1;
            camera.updateProjectionMatrix();
            updateDebugOutput();
        });
    });

    [mx, my, mz, rx, ry, rz, mscale].forEach(input => {
        input.addEventListener('input', () => {
            if (!stadiumModel) return;
            stadiumModel.position.set(parseFloat(mx.value), parseFloat(my.value), parseFloat(mz.value));
            stadiumModel.rotation.set(parseFloat(rx.value), parseFloat(ry.value), parseFloat(rz.value));
            const s = parseFloat(mscale.value) || 1;
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
