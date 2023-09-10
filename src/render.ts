import * as Three from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

const degToRad = (val: number) => val * (Math.PI / 180);

export default class Renderer {
    screen: HTMLElement;
    renderer: Three.WebGLRenderer;
    cubeLoader: Three.CubeTextureLoader;
    scene: Three.Scene;
    camera: Three.Camera;

    lightDir: Three.Light;
    lightAmb: Three.Light;
    cubeMap: Three.CubeTexture;

    meshLoader: GLTFLoader;
    box: Three.Mesh;

    constructor(parent: HTMLElement) {
        this.start = this.start.bind(this);
        this.draw = this.draw.bind(this);
        this.update = this.update.bind(this);

        this.screen = parent;
        this.renderer = new Three.WebGLRenderer({
            antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = Three.PCFSoftShadowMap;
        this.renderer.toneMapping = Three.ReinhardToneMapping;

        const bounds = this.screen.getBoundingClientRect();
        this.renderer.setSize(bounds.width, bounds.height, true);
        this.screen.appendChild(this.renderer.domElement);

        this.cubeLoader = new Three.CubeTextureLoader();
        this.cubeMap = this.cubeLoader.load([
            '/assets/hdri/lythwood/px.png',
            '/assets/hdri/lythwood/nx.png',
            '/assets/hdri/lythwood/py.png',
            '/assets/hdri/lythwood/ny.png',
            '/assets/hdri/lythwood/pz.png',
            '/assets/hdri/lythwood/nz.png',
        ]);

        this.scene = new Three.Scene();
        //this.scene.environment = this.cubeMap;

        this.camera = new Three.PerspectiveCamera(90, 16 / 9, 0.01, 10000.0);
        this.camera.position.z = 1.6;

        this.meshLoader = new GLTFLoader();
        this.meshLoader.load(
            '/assets/meshes/trinitron-1998.glb',
            (gltf: any) => {
                this.box = gltf.scene;
                this.box.rotation.y = degToRad(-90);
                this.box.castShadow = true;
                this.box.receiveShadow = true;
                console.log(gltf);
                this.scene.add(this.box);
            },
            undefined,
            (err: unknown) => {
                console.error(`Failed to load mesh`, err);
            },
        );

        this.lightDir = new Three.DirectionalLight('white', 3);
        this.lightDir.castShadow = true;
        this.lightDir.position.y = 5;
        this.lightDir.position.z = 10;
        this.scene.add(this.lightDir);

        this.lightAmb = new Three.AmbientLight('#1020FF', 5);
        //this.scene.add(this.lightAmb);
    }

    start() {
        requestAnimationFrame(this.draw);
    }

    draw() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.draw);
    }

    update() {}
}
