import { GameObject } from "./gameObject";

//хранилище объектов, также для упрощения доступа к объектам выполняет действия при добавлении/удалении
export class ObjectStorage{
    private gameObjects: Map<string, GameObject> = new Map<string, GameObject>();

    private onObjectAddedCallbacks: ((gameObject: GameObject) => void)[] = [];
    private onObjectRemovedCallbacks: ((gameObject: GameObject) => void)[] = [];

    addObject(newObject: GameObject): void{
        this.gameObjects.set(newObject.uuid, newObject);
        this.onObjectAddedCallbacks.forEach((callback) => callback(newObject));
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
            this.onObjectRemovedCallbacks.forEach((callback) => callback(deletable));
            deletable.dispose();
            this.gameObjects.delete(uuid);
        }
    }

    onObjectAdded(action: (gameObject: GameObject) => void){
        this.onObjectAddedCallbacks.push(action);
    }

    onObjectRemoved(action: (gameObject: GameObject) => void){
        this.onObjectRemovedCallbacks.push(action);
    }

    dispose(): void{
        this.onObjectAddedCallbacks = [];
        this.onObjectRemovedCallbacks = [];
    }
}