import { GameObject } from "../objects/gameObject";
import { ObjectsManager } from "../objects/objectsManager";
import { GameObjectCreateMenu } from "./gameObjectCreateMenu";
import { GameObjectList } from "./gameObjectList";
import { GameObjectValueEditor } from "./gameObjectValueEditor";

//P.S: прихожу к выводу, что, наверное, best practice - это создавать UI прям в коде
//ибо во всех реализациях UI элементов (список, редактор, меню создания) жесткая зависимость от имеющихся элементов в html
//но все же пока решил не запариваться с этим
//и все же могу быть не прав
export class ObjectUIManager{
    private objectsManager : ObjectsManager;

    private gameObjectList: GameObjectList = new GameObjectList();

    private gameObjectValueEditor: GameObjectValueEditor = new GameObjectValueEditor();

    private gameObjectCreateMenu: GameObjectCreateMenu = new GameObjectCreateMenu((value) =>{
        if(value.length === 0) return;
        
        try{
            this.objectsManager.instantiate(value);
        }
        catch(e){
            console.error(e);
        }
    });

    constructor(objectsManager: ObjectsManager){
        this.objectsManager = objectsManager;

        objectsManager.objectStorage.onObjectAdded((gameObject) =>{
            this.addObject(gameObject);
        });
        objectsManager.objectStorage.onObjectRemoved((gameObject) =>{
            this.removeObject(gameObject.uuid);
        });
    }

    addObject(gameObject: GameObject) : void{
        this.gameObjectList.add(gameObject.uuid, gameObject.name, () => this.gameObjectValueEditor.setCurrentTransform(gameObject.name, gameObject.transform));
    }

    removeObject(uuid: string): void {
        this.gameObjectList.remove(uuid);
    }

    renameObject(uuid: string, newName: string): void{
        this.gameObjectList.rename(uuid, newName);
    }

    dispose(): void{
        this.gameObjectList.dispose();
        this.gameObjectValueEditor.dispose();
        this.gameObjectCreateMenu.dispose();
    }
}