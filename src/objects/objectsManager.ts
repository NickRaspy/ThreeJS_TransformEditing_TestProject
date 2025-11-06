import { GameObject } from "./gameObject";
import {Factory} from "./factory"
import { ObjectStorage} from "./objectsStorage"
import "./created/objectsCollection";
import * as THREE from 'three';
import { ResourceTracker } from "../tools/resourceTracker";

export class ObjectsManager{
    private _objectStorage: ObjectStorage = new ObjectStorage();

    private resourceTracker: ResourceTracker = new ResourceTracker();

    get objectStorage(): ObjectStorage {
        return this._objectStorage;
    }

    constructor(){
        this._objectStorage.onObjectAdded((gameObject) => {
            this.resourceTracker.track(gameObject.mesh.geometry);
            this.resourceTracker.track(gameObject.mesh.material);
        });
        this._objectStorage.onObjectAdded((gameObject) => {
            this.resourceTracker.untrack(gameObject.mesh.geometry);
            this.resourceTracker.untrack(gameObject.mesh.material);
        });
    }

    instantiate(objectType: string): GameObject{
        const newObject = Factory.createObject(objectType);
        const material = new THREE.MeshBasicMaterial();
        material.color.setRGB(Math.random(), Math.random(), Math.random());

        var wiresGeometry = new THREE.EdgesGeometry( newObject.mesh.geometry );
        var wiresMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
        var wires = new THREE.LineSegments( wiresGeometry, wiresMaterial );
        newObject.mesh.add(wires);

        newObject.mesh.material = material;
        this._objectStorage.addObject(newObject);

        return newObject;
    }

    destroy(uuid: string){
        this._objectStorage.removeObject(uuid);
    }

    dispose(): void{
        this.resourceTracker.dispose();
        this._objectStorage.dispose();
    }
}