import { GameObject } from "./gameObject";
import {Factory} from "./factory"
import { ObjectStorage} from "./objectsStorage"
import "./created/objectsCollection";

export class ObjectsManager{
    private objectStorage: ObjectStorage = new ObjectStorage();

    constructor(objectStorage: ObjectStorage){
        this.objectStorage = objectStorage;
    }

    instantiate(objectType: string): GameObject{
        const newObject = Factory.createObject(objectType);
        this.objectStorage.addObject(newObject);
        return newObject;
    }

    destroy(uuid: string){
        this.objectStorage.removeObject(uuid);
    }
}