import gsap from 'gsap';
import {
  TextureLoader,
  PlaneBufferGeometry,
  ShaderMaterial,
  Points,
  DoubleSide
} from 'three';
import * as vertexShader from '../shaders/vertex.glsl';
import * as fragmentShader from '../shaders/fragment.glsl';
import { initPlayground } from './utils';

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
    }

    async init() {
        await this.loadTextures();
        this.createMesh();
        this.animate();
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
            this.first = await loadTexture('../../crypgex-cryptocase.png');
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
        
        this.mesh = new Points(geometry, material);
        this.scene.add(this.mesh);
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
        gsap.fromTo(material.uniforms.coefficient, {
          value: 0,
        }, {
          value: 1.5,
          delay: 1.5,
          duration: 1,
          onComplete: () => this.changeTexture(),
          onStart: () => this.updateCameraPosition(),
        });
    }

    updateCameraPosition() {
        const fullRotationDuration = 2;
      
        gsap.to({ angle: 0 }, {
            angle: Math.PI * 2,
            duration: fullRotationDuration,
            onUpdate: function () {
                const angle = this.targets()[0].angle; 
                this.camera.position.x = this.RADIUS * Math.sin(angle);
                this.camera.position.z = this.RADIUS * Math.cos(angle);
                this.camera.lookAt(0, 0, 0);
            }
        });
    }

    animate() {
        this.time += 0.01;
        this.material.uniforms.time.value = time;
      
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}
