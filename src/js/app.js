import gsap from 'gsap';
import * as THREE from 'three';
import * as vertexShader from '../shaders/vertex.glsl';
import * as fragmentShader from '../shaders/fragment.glsl';

const container = document.querySelector('.how-it-works');
const { width, height } = container.getBoundingClientRect();

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
camera.position.set(0, 0, 1500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setSize(width, height);
renderer.setClearColor(0xffffff, 0);
container.appendChild( renderer.domElement );

// const controls = new OrbitControls(camera, renderer.domElement);

renderer.autoClear = false;


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
    mixFactor: { value: 0.0 }
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
  renderer.render(scene, camera);
}