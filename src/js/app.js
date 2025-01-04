import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as vertexShader from '../shaders/vertex.glsl';
import * as fragmentShader from '../shaders/fragment.glsl';

const container = document.querySelector('.how-it-works');
// const { width, height } = container.getBoundingClientRect();
const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 1500;
// camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setSize(width, height);
renderer.setClearColor(0xffffff, 0);
container.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

const renderScene = new RenderPass(scene, camera);

const params = {
  threshold: 0,
  strength: 0,
  radius: 0
};

const bloomPass = new UnrealBloomPass( new THREE.Vector2(width/2, height/2), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;
bloomPass.renderToScreen = true;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

composer.renderToScreen = true;
renderer.autoClear = false;

const mouse = {
  x: 0.,
  y: 0.
};

let time = 0.0;
const textureLoader = new THREE.TextureLoader();

const first = textureLoader.load('../../crypgex-cryptocase.png');
const second = textureLoader.load('../../cryptos.png');
const geometry = new THREE.PlaneBufferGeometry(600, 350, 600, 350);
const material = new THREE.ShaderMaterial( { 
  extensions: {
    derivatives: "#extension GL_OES_standard_derivatives : enable"
  },
  side: THREE.DoubleSide,
  uniforms: {
    time: { value: 0.0 },
    coefficient: { value: 1.6 },
    tex1: { value: first },
    tex2: { value: second },
    mixFactor: { value: 0.0 },
    uMouse: {value: new THREE.Vector2(mouse.x, mouse.y)}
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const plane = new THREE.Points(geometry, material);
scene.add(plane);

window.addEventListener('resize', onWindowResize);

animate();

function onWindowResize() {
  const {width, height} = container.getBoundingClientRect();
  // const {width, height} = document.body.getBoundingClientRect();
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
}

const tl1 = gsap.timeline();
const tl2 = gsap.timeline();
let changed = false;

const changeTex = () => {
  changed = !changed;
  tl2.to(material.uniforms.mixFactor, {
    value: changed ? 1.0 : 0.0,
    duration: 2,
    ease: "power2.inOut",
  })
  gsap.fromTo(material.uniforms.coefficient, {
    value: 1.2,
  }, {
    value: 0,
    delay: 1,
    duration: 3,
    ease: "power2.inOut",
    onComplete: () => update()
  });
}

const update = () => {
  tl1.fromTo(material.uniforms.coefficient, {
    value: 0,
  }, {
    value: 1.2,
    // delay: 3,
    duration: 2,
    onComplete: () => changeTex(),
  })
}

update();

function animate() {
  time += 0.01;
  material.uniforms.time.value = time;

  requestAnimationFrame(animate);
  composer.render();
}