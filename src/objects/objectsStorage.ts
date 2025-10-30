import { GameObject } from "./gameObject";
import { Factory } from "../factory/factory";
export class ObjectStorage{
    private gameObjects: Array<GameObject> = [];

    addObject(type: string): void{
        try{
            const newObject = Factory.createObject(type);
            this.gameObjects.push(newObject);
        }
        catch(error){

        }
    }
}