//three.jsをロードする
import * as THREE from '../lib/three.module.js'

const TRANSPARENT = "0xFFFFFF"

function week2() {

  /**
   * =============================================================
   * Week2
   * =============================================================
   */
  const canvas = document.querySelector('#c-week2');
  const renderer = new THREE.WebGLRenderer({ canvas }, { alpha: true });
  renderer.setClearColor(TRANSPARENT, 0);//背景を透明にする

  //hint:https://discourse.threejs.org/t/how-to-get-my-scene-background-to-be-transparent/11702

  const scene = new THREE.Scene();

  setLight(scene);

  const propeller = getPropeller()
  scene.add(propeller)

  //CylinderGeometry(パーツ2:Fan cover)
  const fanCoverGeometry = new THREE.CylinderGeometry(8, 8, 4, 32);
  const fanCoverMaterial = new THREE.MeshPhongMaterial({ color: TRANSPARENT, wireframe: true });
  const fanCoverCylinder = new THREE.Mesh(fanCoverGeometry, fanCoverMaterial);
  fanCoverCylinder.rotation.set(1.57, 0, 0)
  scene.add(fanCoverCylinder);


  function resizeRendererToDisplaySize(render) {
    const canvas = render.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;

    const needResize = canvas.width !== width || canvas.height !== height;
    if (!needResize) return needResize;

    renderer.setSize(width, height, false);
    return needResize;
  }

  const camera = getCamera();
  renderer.render(scene, camera)

  //フラグ
  let leftRotation = false;
  let rightRotation = false;
  let initRotation = false;

  /**
   * render関数
   */
  function render() {
    propeller.rotation.z += 0.1

    if (initRotation) {
      fanCoverCylinder.rotation.z -= 0.005
    } else if (leftRotation) {
      fanCoverCylinder.rotation.z += 0.005
    } else if (rightRotation) {
      fanCoverCylinder.rotation.z -= 0.005
    }

    const AAA = fanCoverCylinder.rotation.z >= 1 && fanCoverCylinder.rotation.z >= 1.1
    const BBB = fanCoverCylinder.rotation.z <= -1 && fanCoverCylinder.rotation.z <= -1.1
    if (AAA) {
      leftRotation = false;
      rightRotation = true;
      initRotation = false;
    } else if (BBB) {
      leftRotation = true;
      rightRotation = false;
      initRotation = false;
    } else {
      if (!leftRotation) {
        initRotation = true;
      }
    }

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render);

}

//BoxGeometry(パーツ1:プロペラ)
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

//照明
function setLight(scene) {
  const INTENSITY = 1;
  const light = new THREE.DirectionalLight(TRANSPARENT, INTENSITY)
  light.position.set(-1, 2, 4)
  scene.add(light)
}

function getPropeller() {
  const propellerMaterial = new THREE.MeshPhongMaterial({ TRANSPARENT, wireframe: true })
  const propeller = new THREE.Mesh(getPropellerParts(), propellerMaterial)
  propeller.position.set(-25, 0, 0)
  return propeller
}
week2()
