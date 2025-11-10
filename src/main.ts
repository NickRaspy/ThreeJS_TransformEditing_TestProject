import * as THREE from 'three';
import {ObjectsManager} from './objects/objectsManager'
import { ObjectUIManager } from './ui/objectUIManager';
import { SceneManager } from './scene/sceneManager';
import { Factory } from './objects/factory';
import { ObjectRegistry } from './objects/objectRegistry';
import { resourceTracker } from './tools/resourceTracker';
import { ObjectStorage } from './objects/objectsStorage';

let objectsManager: ObjectsManager;
let uiManager: ObjectUIManager;
let sceneManager: SceneManager;

function init(): void {
    objectsManager = new ObjectsManager(new Factory(), new ObjectStorage());
    uiManager = new ObjectUIManager(objectsManager);
    sceneManager = new SceneManager(objectsManager);
    
    window.addEventListener('resize', () => sceneManager.onWindowResize(), false);

    //отгрузка перед выходом из приложения
    window.addEventListener('beforeunload', () =>{
        resourceTracker.dispose();
        ObjectRegistry.dispose();
        sceneManager.dispose();
        objectsManager.dispose();
        uiManager.dispose();
    });

    animate();
}

function animate(): void {
    requestAnimationFrame(animate);

    sceneManager.update();
}

window.addEventListener('DOMContentLoaded', init);