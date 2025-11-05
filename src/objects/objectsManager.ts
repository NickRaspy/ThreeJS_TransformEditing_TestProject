import { GameObject } from "./gameObject";
import {Factory} from "./factory"
import { ObjectStorage} from "./objectsStorage"
import "./created/objectsCollection";

export class ObjectsManager{
    private _objectStorage: ObjectStorage = new ObjectStorage();

    get objectStorage(): ObjectStorage {
        return this._objectStorage;
    }

    instantiate(objectType: string): GameObject{
        const newObject = Factory.createObject(objectType);
        this._objectStorage.addObject(newObject);
        return newObject;
    }

    destroy(uuid: string){
        this._objectStorage.removeObject(uuid);
    }
}