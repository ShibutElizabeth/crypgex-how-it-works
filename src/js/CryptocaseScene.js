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

const RADIUS = 1500;
export default class CryptocaseScene{

}


const container = document.querySelector('.how-it-works');
const { width, height } = container.getBoundingClientRect();

const scene = new Scene();
const camera = new PerspectiveCamera(45, width / height, 1, 2000);
camera.position.set(0, 0, RADIUS);
camera.lookAt(0, 0, 0);

const renderer = new WebGLRenderer({ 
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setSize(width, height);
renderer.setClearColor(0x050000);
container.appendChild( renderer.domElement );

// renderer.autoClear = false;

let time = 0.0;
const textureLoader = new TextureLoader();

const first = textureLoader.load('../../crypgex-cryptocase.png');
const second = textureLoader.load('../../cryptos.png');

const geometry = new PlaneBufferGeometry(600, 350, 600, 350);
const material = new ShaderMaterial( { 
  extensions: {
    derivatives: "#extension GL_OES_standard_derivatives : enable"
  },
  side: DoubleSide,
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

const plane = new Points(geometry, material);
scene.add(plane);


function onWindowResize() {
  const {width, height} = container.getBoundingClientRect();
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

let changed = false;

const changeTex = () => {
  changed = !changed;
  gsap.to(material.uniforms.mixFactor, {
    value: changed ? 1.0 : 0.0,
    duration: 1,
    ease: "power2.inOut",
  })
  gsap.fromTo(material.uniforms.coefficient, {
    value: 1.5,
  }, {
    value: 0,
    delay: 0.5,
    duration: 0.5,
    onComplete: () => update()
  });
}

const update = () => {
  gsap.fromTo(material.uniforms.coefficient, {
    value: 0,
  }, {
    value: 1.5,
    delay: 1.5,
    duration: 1,
    onComplete: () => changeTex(),
    onStart: () => updateCameraPosition(),
  });
}

function updateCameraPosition() {
  const fullRotationDuration = 2;

  gsap.to({ angle: 0 }, {
    angle: Math.PI * 2,
    duration: fullRotationDuration,
    onUpdate: function () {
      const angle = this.targets()[0].angle; 
      camera.position.x = RADIUS * Math.sin(angle);
      camera.position.z = RADIUS * Math.cos(angle);
      camera.lookAt(0, 0, 0);
    }
  });
}

function animate() {
  time += 0.01;
  material.uniforms.time.value = time;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
update();

window.addEventListener('resize', onWindowResize);