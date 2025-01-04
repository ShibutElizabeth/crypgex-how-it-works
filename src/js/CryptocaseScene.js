import gsap from 'gsap';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  PlaneBufferGeometry,
  ShaderMaterial,
  Points,
  DoubleSide
} from 'three';
import * as vertexShader from '../shaders/vertex.glsl';
import * as fragmentShader from '../shaders/fragment.glsl';

const CAMERA_RADIUS = 1500;
export default class CryptocaseScene{
    constructor() {
        this.container = document.querySelector('.how-it-works');
        this.getSizes();

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 2000);
        this.camera.position.set(0, 0, CAMERA_RADIUS);
        this.camera.lookAt(0, 0, 0);
        
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

        this.time = 0.0;
        this.changed = false;

        window.addEventListener('resize', this.onWindowResize.bind(this));
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
                    (texture) => resolve(texture), // Успешная загрузка
                    undefined, // Опционально: прогресс-коллбэк
                    (error) => reject(error) // Ошибка загрузки
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
                this.camera.position.x = CAMERA_RADIUS * Math.sin(angle);
                this.camera.position.z = CAMERA_RADIUS * Math.cos(angle);
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
