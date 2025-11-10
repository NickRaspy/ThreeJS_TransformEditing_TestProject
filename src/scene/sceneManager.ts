import * as THREE from 'three';
import { ObjectsManager } from '../objects/objectsManager';
import { resourceTracker } from '../tools/resourceTracker';
import { IDisposable } from '../dispose';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {Vector3Arrows} from "../tools/arrows";

export class SceneManager implements IDisposable{
    private objectsManager: ObjectsManager;

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private controls: OrbitControls | undefined;

    private onDispose : (() => void)[] = [];

    constructor(objectsManager: ObjectsManager){
        this.objectsManager = objectsManager;

        //автодобавление сцену при создании
        this.objectsManager.objectStorage.onObjectAdded((gameObject) => {
            this.scene.add(gameObject.mesh);
        });

        //и автоудаление
        this.objectsManager.objectStorage.onObjectRemoved((gameObject) => {
            this.scene.remove(gameObject.mesh);
        });

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222); 
    
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight,
            0.1, 
            1000 
        );
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        resourceTracker.track(this.renderer);

        //вращалка камеры
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        Vector3Arrows.getArrows().forEach((arrow) => {
            this.scene.add( arrow );
            this.onDispose.push(() => this.scene.remove(arrow));
        });
        this.camera.position.z = 10;
    }

    update(): void{
        this.render();
        this.controls?.update();
    }

    render(): void{
        this.renderer.render(this.scene, this.camera);
    }

    dispose(): void{
        this.renderer.dispose();
        this.controls?.dispose();
        if(this.onDispose){
            this.onDispose.forEach((action) => action());
            this.onDispose = [];
        }
    }
    onWindowResize(): void {
        if (this.camera && this.renderer){
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}