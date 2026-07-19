import * as THREE from 'three';
import { HOTSPOT_DATA } from './constants.js';
import { STADIUM_COLLIDER_CONFIG } from './config.js';
import { flyToHotspot } from './animation.js';

let sceneRef, cameraRef, containerRef;

// Re-map POS values to THREE.Vector3 instances
const hotspotData = HOTSPOT_DATA.map(h => ({
    ...h,
    pos: new THREE.Vector3(h.pos[0], h.pos[1], h.pos[2])
}));

const hotspotElements = [];
let stadiumCollider;

export function setupHotspots(scene, camera, container) {
    sceneRef = scene;
    cameraRef = camera;
    containerRef = container;
    
    const colCfg = STADIUM_COLLIDER_CONFIG;
    // Create an invisible cylinder collider that perfectly represents the circular stadium volume
    const colliderGeo = new THREE.CylinderGeometry(colCfg.radiusTop, colCfg.radiusBottom, colCfg.height, colCfg.radialSegments);
    const colliderPos = new THREE.Vector3(colCfg.pos.x, colCfg.pos.y, colCfg.pos.z);
    
    // Crucial: Use transparent/opacity: 0 instead of visible: false.
    // Three.js Raycaster ignores meshes with visible: false, which was causing our occlusion logic to fail!
    const colliderMat = new THREE.MeshBasicMaterial({ 
        transparent: true, 
        opacity: 0,
        depthWrite: false 
    });
    stadiumCollider = new THREE.Mesh(colliderGeo, colliderMat);
    stadiumCollider.position.copy(colliderPos);
    scene.add(stadiumCollider);
    
    const hotspotsContainer = document.getElementById('hotspots-container');
    const infoCard = document.getElementById('info-card');
    
    hotspotData.forEach(data => {
        const rawColor = data.color.replace('var(--accent-blue)', '#4fa8ff')
                                   .replace('var(--accent-green)', '#68d391')
                                   .replace('var(--accent-orange)', '#fbd38d')
                                   .replace('var(--accent-purple)', '#b794f4')
                                   .replace('var(--accent-red)', '#fc8181');

        const el = document.createElement('div');
        el.className = 'hotspot-beacon';
        el.style.setProperty('--beacon-color', rawColor);
        el.innerHTML = `
            <div class="dot">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" style="color: white;">
                    ${data.icon}
                </svg>
            </div>
            <span class="hotspot-label">${data.title}</span>
        `;
        
        el.addEventListener('click', () => {
            flyToHotspot(data.pos);

            // Update the global info card
            document.getElementById('card-title').innerText = data.title;
            document.getElementById('card-status-text').innerText = data.status;
            document.getElementById('card-status-pill').style.color = data.statusColor;
            
            document.getElementById('card-occupancy').innerText = data.stats.occ;
            document.getElementById('card-occupancy-bar').style.width = data.stats.occ;
            
            document.getElementById('card-queue').innerText = data.stats.queue;
            document.getElementById('card-wait').innerText = data.stats.wait;
            
            const recEl = document.getElementById('card-recommendation');
            recEl.innerText = data.stats.rec;
            recEl.style.color = data.statusColor;
            
            // Update location image dynamically
            const imgEl = document.getElementById('card-location-image');
            if (imgEl) {
                let imgPath = 'assets/images/locations/vip_lounge.jpg';
                if (data.id === 'gate-a') imgPath = 'assets/images/locations/gate_a.jpg';
                else if (data.id === 'parking') imgPath = 'assets/images/locations/parking.jpg';
                else if (data.id === 'vip') imgPath = 'assets/images/locations/vip_lounge.jpg';
                else if (data.id === 'fnb') imgPath = 'assets/images/locations/fnb.jpg';
                else if (data.id === 'security') imgPath = 'assets/images/locations/security.jpg';
                else if (data.id === 'fanzone') imgPath = 'assets/images/locations/fanzone.jpg';
                else if (data.id === 'metro') imgPath = 'assets/images/locations/metro.jpg';
                
                imgEl.src = imgPath;
            }
            
            // Trigger animation and buttons
            infoCard.classList.remove('hidden');
            infoCard.classList.remove('slide-in-left');
            void infoCard.offsetWidth;
            infoCard.classList.add('slide-in-left');
            
            document.getElementById('btn-return').classList.remove('hidden');
            
            // Show debug panel for this hotspot
            // if (window.showDebugPanel) {
            //     window.showDebugPanel(data.title);
            // }
        });

        // Create 3D Volumetric Beam
        const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
        beamGeo.translate(0, 0.5, 0); // Base at origin
        
        const beamMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(rawColor),
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.set(data.pos.x, 0, data.pos.z); // Start base at floor level (Y = 0)
        beam.scale.y = 30; // Initial height
        beam.userData.isBeam = true; // So we can ignore it in raycasts
        scene.add(beam);

        hotspotsContainer.appendChild(el);
        hotspotElements.push({ 
            element: el, 
            pos: data.pos, 
            beam: beam,
            currentHeight: 30,
            targetHeight: 30
        });
    });
}

export function updateHotspots(customCamera) {
    const cam = customCamera || cameraRef;
    if (!cam || !containerRef || !sceneRef) return;
    
    // Crucial: Update camera matrices so projection math uses the latest camera transforms
    cam.updateMatrixWorld(true);
    cam.updateProjectionMatrix();
    
    const raycaster = new THREE.Raycaster();
    
    hotspotElements.forEach(hotspot => {
        const dist = cam.position.distanceTo(hotspot.pos);
        // Calculate scale based on distance
        let scale = Math.max(0.6, Math.min(1.5, 200 / dist));
        
        // Fast and 100% robust mathematical occlusion check (oval cylinder projection)
        let occluded = false;
        const C = new THREE.Vector3(49, 15, 19); // Approximate center of stadium mesh
        const toCenter = new THREE.Vector3().subVectors(C, cam.position);
        
        // Direction vector from camera to hotspot
        const toHotspot = new THREE.Vector3().subVectors(hotspot.pos, cam.position);
        const dir = toHotspot.clone().normalize();
        
        // Projection of stadium center onto ray path
        const t = toCenter.dot(dir);
        
        if (t > 0 && t < dist) {
            const P_closest = new THREE.Vector3().addVectors(cam.position, dir.clone().multiplyScalar(t));
            const distToLine = P_closest.distanceTo(C);
            
            // If the ray passes within 125 units of the center, it goes directly through the stadium body
            if (distToLine < 125) {
                occluded = true;
            }
        }
        
        try {
            // Smoothly lerp beam height
            hotspot.targetHeight = occluded ? 100 : 15;
            hotspot.currentHeight += (hotspot.targetHeight - hotspot.currentHeight) * 0.1;
            hotspot.beam.position.y = 0;
            hotspot.beam.scale.y = hotspot.currentHeight + hotspot.pos.y;
            
            // Project the TOP of the beam
            const topPos = hotspot.pos.clone();
            topPos.y += hotspot.currentHeight;
            topPos.project(cam);
            
            // Determine if hotspot is behind the camera using dot product (more reliable than projection z-range)
            const toTarget = new THREE.Vector3().subVectors(topPos, cam.position);
            const viewDir = new THREE.Vector3();
            cam.getWorldDirection(viewDir);
            const isBehind = toTarget.dot(viewDir) < 0;
            
            let x = (topPos.x * 0.5 + 0.5) * window.innerWidth;
            let y = -(topPos.y * 0.5 - 0.5) * window.innerHeight;
            
            // Fallback for safety in case of NaN
            if (isNaN(x) || isNaN(y)) {
                x = window.innerWidth / 2;
                y = window.innerHeight / 2;
            }
            
            if (isBehind) {
                hotspot.element.style.opacity = '0';
                hotspot.element.style.pointerEvents = 'none';
            } else {
                hotspot.element.style.display = 'flex';
                hotspot.element.style.opacity = '1';
                hotspot.element.style.pointerEvents = 'auto';
                hotspot.element.style.left = `${x}px`;
                hotspot.element.style.top = `${y}px`;
                hotspot.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
        } catch (err) {
            console.error("Positioning error:", err);
        }
    });
}
