import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as vertexShader from '../shaders/vertex.glsl';
import * as fragmentShader from '../shaders/fragment.glsl';

const container = document.querySelector('.how-it-works');
const {width, height} = container.getBoundingClientRect();
const RADIUS = 1500;
const rotationSpeed = 1;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3000);
camera.position.z = 1000;
// camera.position.x = -100;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setSize(width, height);
// renderer.setClearColor(0x050011);
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
// composer.addPass(bloomPass);

composer.renderToScreen = true;
renderer.autoClear = false;

let time = 0.0;
const textureLoader = new THREE.TextureLoader();

const first = textureLoader.load('../../crypgex-cryptocase.png');
const second = textureLoader.load('../../ethh.png');
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
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const plane = new THREE.Points(geometry, material);
scene.add(plane);

onWindowResize();

animate();

function onWindowResize() {
  const {width, height} = container.getBoundingClientRect();
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
}
const tl1 = gsap.timeline();
const tl2 = gsap.timeline();

let f = false;
const changeTex = () => {
  f = !f;
  tl2.to(material.uniforms.mixFactor, {
    value: f ? 1.0 : 0.0,
    duration: 2,
    ease: "power2.inOut",
  }).fromTo(camera.position, {
    z: 2100,
  }, {
    z: 1000,
    duration: 2,
    // delay: 1
  })
  
  // .fromTo(bloomPass, {
  //   strength: 0.5
  // }, {
  //   strength: 0,
  //   duration: 2,
  //   delay: 1,
  // })
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
    delay: 3,
    duration: 2,
    onComplete: () => changeTex(),
  })
  gsap.fromTo(camera.position, {
    z: 1000,
  }, {
    z: 2100,
    delay: 3, 
    duration: 2
  })
  // .fromTo(bloomPass, {
  //   strength: 0,
  // }, {
  //   strength: 0.5,
  //   duration: 2,
  //   onComplete: () => changeTex(),
  // })
}

update();

function animate() {
  time += 0.01;
  material.uniforms.time.value = time;

  camera.lookAt(0, 0, 0);

  // camera.position.x = -RADIUS * Math.cos(time * 2 * rotationSpeed);
  // camera.position.z = -RADIUS * Math.sin(time * 2 * rotationSpeed);
  // camera.position.y = RADIUS * Math.sin(this.time * 4 * rotationSpeed);    

  requestAnimationFrame(animate);
  composer.render();
}