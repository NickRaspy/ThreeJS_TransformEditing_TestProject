import * as THREE from 'three';
import {ObjectsManager} from './objects/objectsManager'
import { ObjectUIManager } from './ui/objectUIManager';
import { SceneManager } from './scene/sceneManager';

let objectsManager: ObjectsManager;
let uiManager: ObjectUIManager;
let sceneManager: SceneManager;

function init(): void {
    objectsManager = new ObjectsManager();
    uiManager = new ObjectUIManager(objectsManager);
    sceneManager = new SceneManager(objectsManager);
    
    window.addEventListener('resize', sceneManager.onWindowResize, false);
    window.addEventListener('beforeunload', () =>{
        sceneManager.dispose();
    });

    animate();
}




function animate(): void {
    requestAnimationFrame(animate);

    sceneManager.render();
}

window.addEventListener('DOMContentLoaded', init);