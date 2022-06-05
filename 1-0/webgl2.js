import * as THREE from '../lib/three.module.js'

const TRANSPARENT = "0xFFFFFF"

function week2() {
  const canvas = document.querySelector('#c-week2');

  const light = getLight();
  const propeller = getPropeller();
  const fanCoverCylinder = getFanCoverCylinder();

  const scene = new THREE.Scene();
  scene.add(light)
  scene.add(propeller)
  scene.add(fanCoverCylinder);

  const camera = getCamera();

  let leftRotation = false;
  let rightRotation = false;
  let initRotation = false;

  function render() {
    propeller.rotation.z += 0.1

    if (initRotation) {
      fanCoverCylinder.rotation.z -= 0.005
    } else if (leftRotation) {
      fanCoverCylinder.rotation.z += 0.005
    } else if (rightRotation) {
      fanCoverCylinder.rotation.z -= 0.005
    }

    const renderer = new THREE.WebGLRenderer({ canvas }, { alpha: true });
    renderer.setClearColor(TRANSPARENT, 0);
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    const AAA = fanCoverCylinder.rotation.z >= 1 && fanCoverCylinder.rotation.z >= 1.1;
    const BBB = fanCoverCylinder.rotation.z <= -1 && fanCoverCylinder.rotation.z <= -1.1;
    if (AAA) {
      leftRotation = false;
      rightRotation = true;
      initRotation = false;
      return
    }
    if (BBB) {
      leftRotation = true;
      rightRotation = false;
      initRotation = false;
      return
    }
    if (!leftRotation) {
      initRotation = true;
      return
    }
  }
  requestAnimationFrame(render);
}

function getPropellerParts() {
  const PROPELLER_BOX_WIDTH = 1;
  const PROPELLER_BOX_HEIGHT = 10;
  const PROPELLER_BOX_DEPTH = 1;

  return new THREE.BoxGeometry(
    PROPELLER_BOX_WIDTH,
    PROPELLER_BOX_HEIGHT,
    PROPELLER_BOX_DEPTH
  )
}
function getFanCoverCylinder() {
  const fanCoverGeometry = new THREE.CylinderGeometry(8, 8, 4, 32);
  const fanCoverMaterial = new THREE.MeshPhongMaterial({ color: TRANSPARENT, wireframe: true });
  const fanCoverCylinder = new THREE.Mesh(fanCoverGeometry, fanCoverMaterial);
  fanCoverCylinder.rotation.set(1.57, 0, 0);
  return fanCoverCylinder;
}
function getCamera() {
  const FOV = 40;
  const ASPECT = 2;
  const NEAR = 0.1;
  const FAR = 1000;
  const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
  camera.position.z = 60;
  camera.position.y = 0;
  return camera
}
function getLight() {
  const INTENSITY = 1;
  const light = new THREE.DirectionalLight(TRANSPARENT, INTENSITY)
  light.position.set(-1, 2, 4)
  return light
}
function getPropeller() {
  const propellerMaterial = new THREE.MeshPhongMaterial({ TRANSPARENT, wireframe: true })
  const propeller = new THREE.Mesh(getPropellerParts(), propellerMaterial)
  propeller.position.set(-25, 0, 0)
  return propeller
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;

  const shouldResize = canvas.width !== width || canvas.height !== height;
  if (!shouldResize) return shouldResize;

  renderer.setSize(width, height, false);
  return shouldResize;
}
week2()
