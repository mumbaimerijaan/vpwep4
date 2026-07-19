import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        // GitHub Release Asset URL (which natively supports CORS and keeps the heavy GLB out of git source tree)
        const modelUrl = 'https://github.com/mumbaimerijaan/vpwep4/releases/download/v1.0.0/stadium.glb';
        
        console.log("Loading Al Janoub Stadium model from GitHub CDN...");

        loader.load(
            modelUrl,
            (gltf) => {
                const model = gltf.scene;
                setupModel(model, scene);
                console.log("Stadium model loaded successfully!");
                resolve(model);
            },
            undefined,
            (error) => {
                console.error("Failed to load stadium model:", error);
                reject(error);
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
    
    // Position Al Janoub Stadium model
    model.position.set(49, 0, 19);
    model.rotation.set(0, 0, 0);
    model.scale.set(1.4, 1.4, 1.4);
    
    scene.add(model);
}
