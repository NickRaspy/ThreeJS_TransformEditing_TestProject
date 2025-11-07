import * as THREE from 'three';
import { ObjectsManager } from '../objects/objectsManager';
import { ResourceTracker } from '../tools/resourceTracker';

export class SceneManager {
    private objectsManager: ObjectsManager;

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private resourceTracker: ResourceTracker = new ResourceTracker();

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

        this.resourceTracker.track(this.renderer);
    
        this.camera.position.z = 10;
    }

    render(): void{
        this.renderer.render(this.scene, this.camera);
    }

    dispose(): void{
        this.renderer.dispose();
    }
    onWindowResize(): void {
        if (this.camera && this.renderer){
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}