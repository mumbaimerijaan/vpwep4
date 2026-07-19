import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

export let composer;

export function initPostProcessing(renderer, scene, camera, container) {
    composer = new EffectComposer(renderer);
    
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bokehPass = new BokehPass(scene, camera, {
        focus: 150.0,
        aperture: 0.00002,
        maxblur: 0.008,
        width: container.clientWidth,
        height: container.clientHeight
    });
    
    composer.addPass(bokehPass);
    return composer;
}

export function updatePostProcessingSize(width, height) {
    if (composer) {
        composer.setSize(width, height);
    }
}
