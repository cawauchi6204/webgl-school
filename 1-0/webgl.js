//three.jsをロードする
import * as THREE from '../lib/three.module.js'


function main(){

  /**
   * =============================================================
   * Week1
   * =============================================================
   */
  const canvas = document.querySelector('#c-week1');
  const renderer = new THREE.WebGLRenderer({canvas}, {alpha:true});
  renderer.setClearColor(0xffffff, 0);//背景を透明にする
  //hint:https://discourse.threejs.org/t/how-to-get-my-scene-background-to-be-transparent/11702

  const fov = 40;//field of view
  // const fov = 70;//field of view
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 60;
  camera.position.y = 0;

  const scene =  new THREE.Scene();
  // scene.background = new THREE.Color(0xAAAAAA, 0.2);

  //照明
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1,2,4)
    scene.add(light)
  }
  
  //BoxGeometry
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  let geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
  
  function makeInstance(geometry, color, x, y){
    const material = new THREE.MeshPhongMaterial({color, wireframe: true})
    // const material = new THREE.MeshPhongMaterial({color})
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    cube.position.x = x;
    cube.position.y = y;
    return cube;
  }
  const cubes = [];
  for(let i = -90; i < 100;i = i+3){
    for(let j = -60; j < 100; j = j+3){
      cubes.push(makeInstance(geometry, 0xFFFFFF, i, j));
      // cubes.push(makeInstance(geometry, 0x44aa88, i, j));
    }
  }

  function resizeRendererToDisplaySize(render){
    const canvas = render.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if(needResize){
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time){
    time *= 0.0005;//時間を秒に変換する

    if(resizeRendererToDisplaySize(renderer)){
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth/canvas.clientHeight;
      camera.updateProjectionMatrix();
    }    
    cubes.forEach((cube, ndx)=>{
      const speed = 1+ndx*0.00005;
      const rot = time*speed;
      cube.rotation.y = rot;
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main()

