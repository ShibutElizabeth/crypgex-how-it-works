import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SRGBColorSpace, 
    AmbientLight,
    RectAreaLight,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    Color,
    FrontSide,
    DoubleSide,
    IcosahedronGeometry,
    Mesh,
    Vector3
} from 'three';

// CrystalPlayground.js
export const COLORS = {
    white: new Color('#FFFFFF'),
    pink: new Color('#FF00FF'),
    blue: new Color('#4535FF'),
    violet: new Color('#882AEB'),
    black: new Color('#000000')
};

export const rectAreaLightsData = [
    {
        color: COLORS.violet,
        intensity: 10,
        size: 10,
        position: new Vector3(0, 0, -3)
    },
    {
        color: COLORS.blue,
        intensity: 10,
        size: 10,
        position: new Vector3(5, 0, 3)
    },
    {
        color: COLORS.blue,
        intensity: 10,
        size: 10,
        position: new Vector3(0, -6, -7)
    },
    {
        color: COLORS.blue,
        intensity: 5,
        size: 10,
        position: new Vector3(-5, 0, 3)
    },
    {
        color: COLORS.white,
        intensity: 25,
        size: 5,
        position: new Vector3(0, 1, 0)
    },
    {
        color: COLORS.white,
        intensity: 25,
        size: 5,
        position: new Vector3(0, -2, 0)
    },
    {
        color: COLORS.pink,
        intensity: 10,
        size: 3,
        position: new Vector3(0, 0, -2)
    },
    {
        color: COLORS.blue,
        intensity: 10,
        size: 10,
        position: new Vector3(-5, 0, 1)
    },
];

// functions
const getSizes = (playground) => {
    const { width, height } = playground.container.getBoundingClientRect();
    playground.width = width;
    playground.height = height;
}

export const initPlayground = (playground, cameraOptions) => {
    console.log(playground);
    console.log(cameraOptions);
    getSizes(playground);
    playground.scene = new Scene();

    playground.camera = new PerspectiveCamera(cameraOptions.fov, playground.width / playground.height, cameraOptions.near, cameraOptions.far);
    playground.camera.position.set(0, 0, playground.RADIUS);
    playground.camera.lookAt(0, 0, 0);
        
    playground.renderer = new WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    playground.renderer.setSize(playground.width, playground.height);
    playground.renderer.setClearColor(0xffffff, 0);
    playground.renderer.outputColorSpace = SRGBColorSpace;
    playground.renderer.shadowMap.enabled = false;
    playground.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
    playground.container.appendChild(playground.renderer.domElement);

    window.addEventListener('resize', onWindowResize(playground));
    console.log(playground);
}

const onWindowResize = (playground) => {
    getSizes(playground);
    playground.camera.updateProjectionMatrix();
    playground.renderer.setSize(playground.width, playground.height);
}