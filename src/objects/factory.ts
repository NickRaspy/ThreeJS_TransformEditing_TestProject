import { GameObject } from "./gameObject";
import { ObjectRegistry } from "./objectRegistry";

//фабрика
export class Factory {
    static createObject(objectType: string): GameObject {
        const NewObject = ObjectRegistry.getObject(objectType);
        
        if (!NewObject) {
            throw new Error(`'${objectType}' doesn't exist`);
        }
        
        return new NewObject();
    }
}
