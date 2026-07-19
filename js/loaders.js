import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            'assets/models/stadium.glb',
            (gltf) => {
                const model = gltf.scene;
                
                // Ensure model casts and receives shadows
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                
                // Position appropriately if needed, depending on model origin
                model.position.set(49, 0, 19);
                model.rotation.set(0, 0, 0);
                model.scale.set(1.4, 1.4, 1.4);
                
                scene.add(model);
                resolve(model);
            },
            (xhr) => {
                // Optional: handle progress
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                reject(error);
            }
        );
    });
}
