import {
    TextureLoader,
    PlaneBufferGeometry,
    ShaderMaterial,
    Points,
    DoubleSide
} from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin';

import { initPlayground } from './utils';

import * as vertexShader from '../shaders/vertex.glsl';
import * as fragmentShader from '../shaders/fragment.glsl';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default class CryptocasePlayground {
    constructor() {
        this.container = document.querySelector('.how-it-works');
        this.RADIUS = 1500;

        initPlayground(this, {
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
        this.animate();
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
        this.geometry = new PlaneBufferGeometry(600, 350, 600, 350);
        this.material = new ShaderMaterial({ 
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: DoubleSide,
            uniforms: {
                time: { value: 0.0 },
                coefficient: { value: 1.6 },
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
        gsap.timeline().to(this.container, {
            onStart: () => this.startAnimation(),
            scrollTrigger: {
                trigger: this.container,
                start: 'top bottom',
            }
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
      
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}
