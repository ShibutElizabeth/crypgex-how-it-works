import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    TextureLoader,
    PlaneGeometry,
    ShaderMaterial,
    Points,
    DoubleSide
} from 'three';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin';

import * as vertexShader from '../shaders/vertex.glsl'
import * as fragmentShader from '../shaders/fragment.glsl';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default class CryptocasePlayground {
    constructor() {
        this.container = document.querySelector('.how-it-works');
        this.RADIUS = 1400;

        this.initPlayground({
            fov: 45,
            near: 1,
            far: 2000
        });
        
        this.time = 0.0;
        this.changed = false;
        this.init();
    }

    async init() {
        await this.loadTextures();
        this.createMesh();
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.createTrigger();
    }

    async loadTextures(){
        const textureLoader = new TextureLoader();

        const loadTexture = (url) => {
            return new Promise((resolve, reject) => {
                textureLoader.load(
                    url,
                    (texture) => resolve(texture),
                    undefined,
                    (error) => reject(error)
                );
            });
        };

        try {
            this.first = await loadTexture('../../cryptocase.png');
            this.second = await loadTexture('../../cryptos.png');
        } catch (error) {
            console.error('Error loading textures:', error);
        }
    }

    createMesh(){
        this.geometry = new PlaneGeometry(600, 350, 600, 350);
        this.material = new ShaderMaterial({ 
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: DoubleSide,
            uniforms: {
                time: { value: 0.0 },
                coefficient: { value: 0.0 },
                tex1: { value: this.first },
                tex2: { value: this.second },
                mixFactor: { value: 0.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
        
        this.mesh = new Points(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    // triggers the animation start, can be adjusted
    createTrigger(){
        this.animation = gsap.timeline({
            paused: true,
        });
        
        this.animation.to(this.container, {
            duration: 1,
            onStart: () => this.startAnimation(),
        });
        
        ScrollTrigger.create({
            trigger: this.container,
            start: 'top bottom',
            end: 'bottom top',
            onEnter: () => this.animation.play(),
            onLeave: () => this.animation.pause(),
            onEnterBack: () => this.animation.play(),
            onLeaveBack: () => this.animation.pause(),
        });
    }

    changeTexture = () => {
        this.changed = !this.changed;
        gsap.to(this.material.uniforms.mixFactor, {
            value: this.changed ? 1.0 : 0.0,
            duration: 1,
            ease: "power2.inOut",
        });

        gsap.fromTo(this.material.uniforms.coefficient, {
            value: 1.5,
        }, {
            value: 0,
            delay: 0.5,
            duration: 0.5,
            onComplete: () => this.startAnimation()
        });
    }
      
    startAnimation = () => {
        gsap.fromTo(this.material.uniforms.coefficient, {
          value: 0,
        }, {
          value: 1.5,
          delay: 1.5,
          duration: 1,
          onComplete: () => this.changeTexture(),
          onStart: () => this.updateCameraPosition(),
        });
    }

    updateCameraPosition = () => {
        const fullRotationDuration = 2;
        const that = this;

        gsap.to({ angle: 0 }, {
            angle: Math.PI * 2,
            duration: fullRotationDuration,
            onUpdate: function () {
                const angle = this.targets()[0].angle; 
                that.camera.position.x = that.RADIUS * Math.sin(angle);
                that.camera.position.z = that.RADIUS * Math.cos(angle);
                that.camera.lookAt(0, 0, 0);
            }
        });
    }

    animate() {
        this.time += 0.01;
        this.material.uniforms.time.value = this.time;
      
        this.renderer.render(this.scene, this.camera);
    }

    initPlayground(cameraOptions){
        this.getSizes();
        this.scene = new Scene();
     
        this.camera = new PerspectiveCamera(cameraOptions.fov, this.width / this.height, cameraOptions.near, cameraOptions.far);
        this.camera.position.set(0, 0, this.RADIUS);
        this.camera.lookAt(0, 0, 0);
             
        this.renderer = new WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
     
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.shadowMap.enabled = false;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
             
        this.container.appendChild(this.renderer.domElement);
     
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
 
    getSizes(){
        const { width, height } = this.container.getBoundingClientRect();
        this.width = width;
        this.height = height;
    }

    onWindowResize(){
        this.getSizes();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
}
