import { GameObject } from "./gameObject";
export class ObjectStorage{
    private gameObjects: Map<string, GameObject> = new Map<string, GameObject>();

    addObject(newObject: GameObject): void{
        this.gameObjects.set(newObject.uuid, newObject);
    }

    getObject(uuid: string): GameObject | null{
        const gameObject = this.gameObjects.get(uuid);

        if (gameObject === undefined){
            console.log("Object ${uuid} not found")
            return null;
        }

        return gameObject;
    }

    getObjects(): Array<GameObject>{
        return Array.from(this.gameObjects.values());
    }

    removeObject(uuid: string): void{
        const deletable = this.gameObjects.get(uuid);
        if(deletable){
            deletable.dispose();
            this.gameObjects.delete(uuid);
        }
    }
}