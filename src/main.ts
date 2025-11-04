import * as THREE from 'three';
import {ObjectsManager} from './objects/objectsManager'
import { ObjectUIManager } from './ui/objectUIManager';
import { ObjectStorage } from './objects/objectsStorage';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;
let objectStorage: ObjectStorage;
let objectsManager: ObjectsManager;
let uiManager: ObjectUIManager;

function init(): void {
    objectStorage = new ObjectStorage();
    objectsManager = new ObjectsManager(objectStorage);
    uiManager = new ObjectUIManager(objectStorage);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); 

    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight,
        0.1, 
        1000 
    );
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 10;

    const test = objectsManager.instantiate('box');

    scene.add(test.mesh);
    uiManager.addObject(test.uuid);

    test.transform.setPosition(5, 0, 0);
    animate();
}


function animate(): void {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}


function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('DOMContentLoaded', init);