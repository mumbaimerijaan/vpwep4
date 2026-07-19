// js/config.js

export const CAMERA_CONFIG = {
    fov: 45,
    near: 0.1,
    far: 10000,
    initialPos: { x: -260, y: 140, z: -90 },
    lookAt: { x: 0, y: 10, z: 0 },
    zoom: 1.0
};

export const LIGHTS_CONFIG = {
    hemiLight: {
        skyColor: 0xffa07a,
        groundColor: 0x444444,
        intensity: 0.6,
        pos: { x: 0, y: 200, z: 0 }
    },
    dirLight: {
        color: 0xffdcb4,
        intensity: 1.2,
        pos: { x: -100, y: 50, z: -200 },
        shadowMapSize: 2048,
        shadowNear: 10,
        shadowFar: 800,
        shadowFrustum: 250,
        shadowBias: -0.0005
    },
    ambientLight: {
        color: 0xffeedd,
        intensity: 0.4
    }
};

export const STADIUM_COLLIDER_CONFIG = {
    radiusTop: 140,
    radiusBottom: 140,
    height: 80,
    radialSegments: 16,
    pos: { x: 49, y: 40, z: 19 }
};

export const MAP_WORLD_SIZE = 800;
