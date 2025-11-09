import { GameObject } from "./gameObject";
import { IFactory } from "./factory"
import { IObjectStorage, ObjectStorage} from "./objectsStorage"
import "./created/objectsCollection";
import * as THREE from 'three';
import { resourceTracker } from "../tools/resourceTracker";
import { IDisposable } from "../dispose";

//менеджер объектов (отчасти фабрика, но при этом пользуется отдельной)
export class ObjectsManager implements IDisposable{
    
    get objectStorage(): IObjectStorage {
        return this._objectStorage;
    }

    constructor(private factory: IFactory, private _objectStorage: IObjectStorage ){
        this._objectStorage.onObjectAdded((gameObject) => {
            resourceTracker.track(gameObject.mesh.geometry);
            resourceTracker.track(gameObject.mesh.material);
        });
        this._objectStorage.onObjectRemoved((gameObject) => {
            resourceTracker.untrack(gameObject.mesh.geometry);
            resourceTracker.untrack(gameObject.mesh.material);
        });
    }

    instantiate(objectType: string): GameObject{
        const newObject = this.factory.createObject(objectType);

        //я не видел смысла сейчас запариваться с UI для материала, поэтому тупо рандомный цвет + линии, чтобы отличать
        newObject.mesh.add(this.setWires(newObject.mesh.geometry));
        newObject.mesh.material = this.setMaterial();

        this._objectStorage.addObject(newObject);

        return newObject;
    }

    setMaterial(): THREE.Material{
        const material = new THREE.MeshBasicMaterial();
        material.color.setRGB(Math.random(), Math.random(), Math.random());
        return material;
    }

    setWires(geometry: THREE.BufferGeometry): THREE.LineSegments{
        var wiresGeometry = new THREE.EdgesGeometry( geometry );
        var wiresMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
        var wires = new THREE.LineSegments( wiresGeometry, wiresMaterial );
        return wires;
    }

    destroy(uuid: string){
        this._objectStorage.removeObject(uuid);
    }

    dispose(): void{
        this._objectStorage.dispose();
    }
}