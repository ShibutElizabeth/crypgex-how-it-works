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
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const RADIUS = 4;

const COLORS = {
    white: new Color('#FFFFFF'),
    pink: new Color('#FF00FF'),
    blue: new Color('#4535FF'),
    violet: new Color('#882AEB'),
    black: new Color('#000000')
};

const rectAreaLightsData = [
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

RectAreaLightUniformsLib.init();

export default class CrystalScene {
    constructor() {
        this.container = document.querySelector('.crystal');
        this.getSizes();

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(5, this.width / this.height, 1, 100);
        this.camera.position.set(0, 0, 68.5);
        
        this.renderer = new WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
         });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.outputColorSpace = SRGBColorSpace;
        this.renderer.shadowMap.enabled = false;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.container.appendChild(this.renderer.domElement);

        this.rectAreaLights = [];
        this.objectGLB = {
            model: null,
            bitcoin: null,
            bitcoinLine: null,
            xPart: null,
            xPartLine: null,
            arrow: null
        };

        this.time = 0;
        this.modelLoaded = false;
        
        this.setLights();
        this.setMaterials();
        this.init();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    async init() {
        await this.loadModel();
        this.createCrystal();
        this.animate();
    }

    setLights(){
        const ambientLight = new AmbientLight(COLORS.white, 30);
        this.scene.add(ambientLight);

        rectAreaLightsData.forEach((lightData) => {
            const rectAreaLight = this.createRectAreaLight(lightData.color, lightData.intensity, lightData.size, lightData.position);
            this.rectAreaLights.push(rectAreaLight);
            this.scene.add(rectAreaLight);
        });
    }

    setMaterials() {
        this.pinkMaterial = new MeshPhysicalMaterial({ 
            color: COLORS.pink,
            metalness: 1,
            roughness: 1,
            depthTest: true,
            depthWrite: true,
            reflectivity: 1.0,
            flatShading: true,
            emissive: COLORS.pink,
        });
          
        this.glassMaterial = new MeshPhysicalMaterial({
            metalness: 0.0,
            roughness: 0.2,
            ior: 0.42,
            clearcoat: 0.2,
            clearcoatRoughness: 0.5,
            color: COLORS.black,
            opacity: 1,
            transparent: true,
            side: FrontSide,
            depthWrite: false
        });
          
        this.crystalMaterial = new MeshStandardMaterial({
            metalness: 1.,
            roughness: 0.0,
            color: COLORS.black,
            envMapIntensity: 3.3,
            opacity: 0.4,
            transparent: true,
            depthWrite: false,
            side: DoubleSide,
        });
    }

    async loadModel(){
        const loader = new GLTFLoader();
        const that = this;
        return new Promise((resolve, reject) => {
            loader.load(
                '../../crypgex-logo.glb',
                (gltf) => {
                    const model = gltf.scene;
                    that.objectGLB.model = model;
                    that.objectGLB.bitcoin = model.children[0];
                    that.objectGLB.xPart = model.children[1];
                    that.objectGLB.bitcoinLine = model.children[2];
                    that.objectGLB.arrow = model.children[3];
                    that.objectGLB.xPartLine = model.children[4];
                    that.objectGLB.bitcoin.scale.set(1.52, 1.52, 1);
                    that.objectGLB.bitcoinLine.scale.set(1.52, 1.52, 1);
                    that.objectGLB.xPart.scale.set(1.5, 1.5, 1);
                    that.objectGLB.xPartLine.scale.set(1.5, 1.5, 1);
                    that.objectGLB.arrow.scale.set(1.5, 1.5, 1);
  
                    that.pinkMaterial.side = FrontSide;
                    that.objectGLB.bitcoin.material = that.glassMaterial;
                    that.objectGLB.xPart.material = that.glassMaterial;
                    that.objectGLB.bitcoinLine.material = that.pinkMaterial;
                    that.objectGLB.xPartLine.material = that.pinkMaterial;
                    that.objectGLB.arrow.material = that.pinkMaterial;
  
                    that.objectGLB.model.castShadow = true;
                    that.scene.add(that.objectGLB.model);
                    that.objectGLB.model.renderOrder = 1;
                    resolve();
                },
                undefined,
                (error) => {
                    console.error('An error occurred while loading the model:', error);
                    reject(error);
                }
            );
        });
    }

    createCrystal() {
        const geometry = new IcosahedronGeometry(3, 0);
        this.crystal = new Mesh(geometry,this.crystalMaterial);
        this.crystal.rotation.x = 0.4;
        this.crystal.rotation.z = -0.1;
        this.crystal.receiveShadow = true;

        this.scene.add(this.crystal);
    }

    animate() {
        this.time += 0.01;

        this.crystalMaterial.needsUpdate = true;
        this.autoRotation();

        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    autoRotation = () => {
        if(this.objectGLB.model !== null){
            const epsilon = 0.0;
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const rotationSpeed = isMobile ? 1.0 : isSafari ? 2.0 : 0.5;

            this.objectGLB.model.rotation.y -= 0.005 * rotationSpeed;
          
            this.crystal.rotation.y += 0.008 * rotationSpeed;
      
            this.rectAreaLights[4].position.x = RADIUS * Math.cos(this.time * 2 * rotationSpeed);
            this.rectAreaLights[4].position.z = RADIUS * Math.sin(this.time * 2 * rotationSpeed);    
            this.rectAreaLights[4].lookAt(0, 0, 0);
      
            this.rectAreaLights[5].position.x = -RADIUS * Math.cos(this.time * 2 * rotationSpeed);
            this.rectAreaLights[5].position.z = -RADIUS * Math.sin(this.time * 2 * rotationSpeed);
            this.rectAreaLights[5].position.y = RADIUS * Math.sin(this.time * 4 * rotationSpeed);    
            this.rectAreaLights[5].lookAt(0, 0, 0);
      
            const rotationY = this.objectGLB.model.rotation.y % (Math.PI * 2);
      
            this.objectGLB.model.position.y = 0.15 * (Math.cos(this.time * 2 * rotationSpeed));
      
            // Первый объект (виден от 0 до π/2 и от 3π/2 до 2π)
            const isVisibleFirst = (Math.abs(rotationY) + epsilon < Math.PI / 2) || (Math.abs(rotationY) - epsilon < Math.PI / 2) 
                || (Math.abs(rotationY) + epsilon > 3 * Math.PI / 2) || (Math.abs(rotationY) - epsilon > 3 * Math.PI / 2);
      
            this.objectGLB.bitcoin.visible = isVisibleFirst;
            this.objectGLB.bitcoinLine.visible = isVisibleFirst;
            this.objectGLB.xPart.visible = !isVisibleFirst;
            this.objectGLB.xPartLine.visible = !isVisibleFirst;
            this.objectGLB.arrow.visible = !isVisibleFirst;
        }
    }

    createRectAreaLight(color = COLORS.white, intensity = 10, size = 10, position = new Vector3(0, 0, 0)) {
        const rectLight = new RectAreaLight(color, intensity, size, size); 
        rectLight.position.set(position.x, position.y, position.z);
        rectLight.lookAt(0, 0, 0);

        return rectLight;
    }

    getSizes(){
        const { width, height } = this.container.getBoundingClientRect();
        this.width = width;
        this.height = height;
    }

    onWindowResize() {
        this.getSizes();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
}
