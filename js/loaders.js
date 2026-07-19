import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        // User's Google Drive File ID for stadium.glb
        const fileId = '1QVgfP9BEXjRx7FbGbxSZfRIuCQs-WGGA';
        
        // Symmetrical fail-safe URLs to bypass CORS restrictions
        const urls = [
            `https://docs.google.com/uc?export=download&id=${fileId}`,
            `https://corsproxy.io/?${encodeURIComponent(`https://docs.google.com/uc?export=download&id=${fileId}`)}`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://docs.google.com/uc?export=download&id=${fileId}`)}`
        ];
        
        let attempt = 0;
        
        function tryLoad() {
            if (attempt >= urls.length) {
                reject(new Error("All Google Drive load paths failed due to strict CORS or access restrictions."));
                return;
            }
            
            const currentUrl = urls[attempt];
            console.log(`Loading Al Janoub Stadium (Attempt ${attempt + 1}/${urls.length})...`);
            
            loader.load(
                currentUrl,
                (gltf) => {
                    const model = gltf.scene;
                    setupModel(model, scene);
                    console.log(`Stadium model loaded successfully on attempt ${attempt + 1}!`);
                    resolve(model);
                },
                undefined,
                (error) => {
                    console.warn(`Load attempt ${attempt + 1} failed (likely CORS/Access restriction):`, error);
                    attempt++;
                    tryLoad();
                }
            );
        }
        
        tryLoad();
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
