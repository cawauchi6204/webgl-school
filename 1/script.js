import * as THREE from '../lib/three.module.js';
import {OrbitControls} from '../lib/OrbitControls.js';

window.addEventListener('DOMContentLoaded', () => {
  // 制御クラスのインスタンスを生成
  const app = new App3();
  // 初期化
  app.init();
  // 描画
  app.render();
}, false);

/**
 * three.js を効率よく扱うために自家製の制御クラスを定義
 */
class App3 {
    //カメラのパラメータを定義
    static get CAMERA_PARAM() {
        return {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 40.0,
        // カメラの位置
        x: 0.0,
        y: 2.0,
        z: 16.0,
        // カメラの中止点
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
        };
    }
    //レンダラーのパラメータを定義
    static get RENDERER_PARAM() {
        return {
        clearColor: 0xe6df1c,
        // clearColor: 0x666666,
        width: window.innerWidth,
        height: window.innerHeight,
        };
    }
    //ディレクショナルライトのパラメータを定義
    static get DIRECTIONAL_LIGHT_PARAM() {
        return {
        color: 0xffffff, // 光の色
        intensity: 0.1,  // 光の強度
        x: 1.0,          // 光の向きを表すベクトルの X 要素
        y: 1.0,          // 光の向きを表すベクトルの Y 要素
        z: 1.0           // 光の向きを表すベクトルの Z 要素
        };
    }
    //アンビエントライトのパラメータを定義
    static get AMBIENT_LIGHT_PARAM() {
        return {
        color: 0xffffff, // 光の色
        intensity: 0.5,  // 光の強度
        };
    }
    // マテリアルのパラメータ定義
    static get MATERIAL_PARAM() {
        return {
        color: 0xffffff, // マテリアルの基本色
        // color: 0x3399ff, // マテリアルの基本色
        };
    }

    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        this.renderer;         // レンダラ
        this.scene;            // シーン
        this.camera;           // カメラ
        this.directionalLight; // ディレクショナルライト
        this.ambientLight;     // アンビエントライト
        this.material;         // マテリアル
        this.torusGeometry;    // トーラスジオメトリ
        this.torusArray;       // トーラスメッシュの配列 @@@
        this.controls;         // オービットコントロール
        this.axesHelper;       // 軸ヘルパー
        this.isDown = false; // キーの押下状態を保持するフラグ

        // 再帰呼び出しのための this 固定
        this.render = this.render.bind(this);

        // キーの押下や離す操作を検出できるようにする
        window.addEventListener('keydown', (keyEvent) => {
        switch (keyEvent.key) {
            case ' ':
            this.isDown = true;
            break;
            default:
        }
        }, false);
        window.addEventListener('keyup', (keyEvent) => {
        this.isDown = false;
        }, false);

        // リサイズイベント
        window.addEventListener('resize', () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        }, false);
    }

    /**
     * 初期化処理
     */
    init() {
        // レンダラー
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(App3.RENDERER_PARAM.clearColor));
        this.renderer.setSize(App3.RENDERER_PARAM.width, App3.RENDERER_PARAM.height);
        const wrapper = document.querySelector('#webgl');
        wrapper.appendChild(this.renderer.domElement);

        // シーン
        this.scene = new THREE.Scene();

        // カメラ
        this.camera = new THREE.PerspectiveCamera(
        App3.CAMERA_PARAM.fovy,
        App3.CAMERA_PARAM.aspect,
        App3.CAMERA_PARAM.near,
        App3.CAMERA_PARAM.far,
        );
        this.camera.position.set(
        App3.CAMERA_PARAM.x,
        App3.CAMERA_PARAM.y,
        App3.CAMERA_PARAM.z,
        );
        this.camera.lookAt(App3.CAMERA_PARAM.lookAt);

        // ディレクショナルライト（平行光源）
        this.directionalLight = new THREE.DirectionalLight(
        App3.DIRECTIONAL_LIGHT_PARAM.color,
        App3.DIRECTIONAL_LIGHT_PARAM.intensity
        );
        this.directionalLight.position.set(
        App3.DIRECTIONAL_LIGHT_PARAM.x,
        App3.DIRECTIONAL_LIGHT_PARAM.y,
        App3.DIRECTIONAL_LIGHT_PARAM.z,
        );
        this.scene.add(this.directionalLight);

        // アンビエントライト（環境光）
        this.ambientLight = new THREE.AmbientLight(
        App3.AMBIENT_LIGHT_PARAM.color,
        App3.AMBIENT_LIGHT_PARAM.intensity,
        );
        this.scene.add(this.ambientLight);

        // マテリアル
        // this.material = new THREE.MeshPhongMaterial(App3.MATERIAL_PARAM);

        // 共通のジオメトリ、マテリアルから、複数のメッシュインスタンスを作成する @@@
        const BOX_COUNT = 100;
        const TRANSFORM_SCALE = 5.0;
        this.boxGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        this.boxArray = [];

        for (let i = 0; i < BOX_COUNT; ++i) {
        // ボックスメッシュのインスタンスを生成
        const box = new THREE.Mesh(this.boxGeometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ));
        // 座標をランダムに散らす
        box.position.x = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;
        box.position.y = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;
        box.position.z = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;
        // シーンに追加する
        this.scene.add(box);
        // 配列に入れておく
        this.boxArray.push(box);
        console.log(this.boxArray)
        }


        // コントロール
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // ヘルパー
        const axesBarLength = 5.0;
        this.axesHelper = new THREE.AxesHelper(axesBarLength);
        this.scene.add(this.axesHelper);
    }

    /**
     * 描画処理
     */
    render() {
        // 恒常ループの設定
        requestAnimationFrame(this.render);

        // コントロールを更新
        this.controls.update();

        // フラグに応じてオブジェクトの状態を変化させる
        if (this.isDown === true) {
        // Y 軸回転 @@@
        this.torusArray.forEach((torus) => {
            torus.rotation.y += 0.05;
        });
        }

        // レンダラーで描画
        this.renderer.render(this.scene, this.camera);
    }
}

