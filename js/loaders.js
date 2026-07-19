import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        // User's Google Drive File ID for stadium.glb
        const fileId = '1QVgfP9BEXjRx7FbGbxSZfRIuCQs-WGGA';
        const directUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;
        
        console.log("Loading Al Janoub Stadium model from Google Drive...");

        // Try direct download link first
        loader.load(
            directUrl,
            (gltf) => {
                const model = gltf.scene;
                setupModel(model, scene);
                resolve(model);
            },
            undefined,
            (error) => {
                console.warn("Direct Google Drive load failed (likely CORS). Retrying through CORS proxy...", error);
                
                // Fallback to CORS proxy
                loader.load(
                    proxyUrl,
                    (gltf) => {
                        const model = gltf.scene;
                        setupModel(model, scene);
                        resolve(model);
                    },
                    undefined,
                    (proxyError) => {
                        console.error("Failed to load stadium model from Google Drive via proxy:", proxyError);
                        reject(proxyError);
                    }
                );
            }
        );
    });
}

function setupModel(model, scene) {
    // Ensure model casts and receives shadows
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    
    // Position appropriately
    model.position.set(49, 0, 19);
    model.rotation.set(0, 0, 0);
    model.scale.set(1.4, 1.4, 1.4);
    
    scene.add(model);
}
