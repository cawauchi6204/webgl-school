//three.jsをロードする
import * as THREE from '../lib/three.module.js'


function week2(){

    /**
     * =============================================================
     * Week2
     * =============================================================
     */
    const canvas = document.querySelector('#c-week2');
    const renderer = new THREE.WebGLRenderer({canvas}, {alpha:true});
    renderer.setClearColor(0xffffff, 0);//背景を透明にする
    //hint:https://discourse.threejs.org/t/how-to-get-my-scene-background-to-be-transparent/11702

    const fov = 40;//field of view
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 60;
    camera.position.y = 0;

    const scene =  new THREE.Scene();
    // scene.background = new THREE.Color(0xAAAAAA, 0.2);

    //照明
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1,2,4)
    scene.add(light)
    
    //BoxGeometry(パーツ1:プロペラ)
    const propellerBoxWidth = 1;
    const propellerBoxHeight = 10;
    const propellerBoxDepth = 1;
    let propellerGeometry = new THREE.BoxGeometry(propellerBoxWidth, propellerBoxHeight, propellerBoxDepth)
    const propellerMaterial = new THREE.MeshPhongMaterial({color, wireframe: true})
    const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial)
    propeller.position.set(-25,0,0)
    scene.add(propeller)

    //CylinderGeometry(パーツ2:Fan cover)
    const fanCoverGeometry =  new THREE.CylinderGeometry( 8, 8, 4, 32 );
    const fanCoverMaterial = new THREE.MeshPhongMaterial( {color:0xFFFFFF, wireframe:true} );
    // const fanCoverMaterial = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
    const fanCoverCylinder = new THREE.Mesh( fanCoverGeometry, fanCoverMaterial );
    fanCoverCylinder.rotation.set(1.57,0,0)
    scene.add( fanCoverCylinder );


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
    
    renderer.render(scene, camera)

    //フラグ
    let leftRotation = false;
    let rightRotation = false;
    let initRotation = false;

    /**
     * render関数
     */
    function render(){
        propeller.rotation.z += 0.1

        if(initRotation === true){
            console.log(initRotation)
            fanCoverCylinder.rotation.z -= 0.005
        }else if(leftRotation === true){
            fanCoverCylinder.rotation.z += 0.005
        }else if(rightRotation === true){
            fanCoverCylinder.rotation.z -= 0.005
        }
        // fanCoverCylinder.rotation.z += 0.005
        if(fanCoverCylinder.rotation.z >= 1 && fanCoverCylinder.rotation.z >= 1.1){
            // fanCoverCylinder.rotation.z += 0.005
            leftRotation = false;
            rightRotation = true;
            initRotation = false;
            console.log("1より大きい")
        }else if(fanCoverCylinder.rotation.z <= -1 && fanCoverCylinder.rotation.z <= -1.1){
            leftRotation = true;
            rightRotation = false;
            initRotation = false;
            console.log("-1より小さい")
        }else{
            if(leftRotation === false){
                initRotation = true;
                console.log("どちらでもないleft")
            }
        }
        
        if(resizeRendererToDisplaySize(renderer)){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth/canvas.clientHeight
            camera.updateProjectionMatrix()
        }
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render);

}

week2()

