import { IDisposable } from "../dispose";
import { GameObject } from "../objects/gameObject";
import { ObjectsManager } from "../objects/objectsManager";
import { GameObjectCreateMenu } from "./gameObjectCreateMenu";
import { GameObjectList } from "./gameObjectList";
import { GameObjectValueEditor } from "./gameObjectValueEditor";

//P.S: прихожу к выводу, что, наверное, best practice - это создавать HTML UI прям в коде (а то и на React положиться)
//ибо во всех реализациях UI элементов (список, редактор, меню создания) жесткая зависимость от имеющихся элементов в HTML
//но все же пока решил не запариваться с этим
//и все же могу быть не прав
//P.S.S: хотя еще лучше найти библиотеку, которая позволяет создавать UI чисто в three.js
//но я решил устроить для себя испытание
export class ObjectUIManager implements IDisposable{
    private objectsManager : ObjectsManager;

    private gameObjectList: GameObjectList = new GameObjectList((uuid) => {
        if(!uuid || uuid.trim().length === 0) return;

        try{
            this.objectsManager.destroy(uuid);
        }
        catch(e){
            console.error(e);
        }
    });

    private gameObjectValueEditor: GameObjectValueEditor = new GameObjectValueEditor();

    private gameObjectCreateMenu: GameObjectCreateMenu = new GameObjectCreateMenu((objectType) =>{
        if(!objectType || objectType.trim() === '') return;
        
        try{
            this.objectsManager.instantiate(objectType);
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
            
            const currentGameObject = this.gameObjectValueEditor.getCurrentGameObject();

            if(currentGameObject){
                if(currentGameObject.uuid === gameObject.uuid)
                    this.gameObjectValueEditor.clearCurrentGameObject();
            }
        });
    }

    addObject(gameObject: GameObject) : void{
        this.gameObjectList.add(gameObject.uuid, gameObject.name, () => this.gameObjectValueEditor.setCurrentTransform(gameObject.name, gameObject));
    }

    removeObject(uuid: string): void {
        this.gameObjectList.remove(uuid);
    }

    dispose(): void{
        this.gameObjectList.dispose();
        this.gameObjectValueEditor.dispose();
        this.gameObjectCreateMenu.dispose();
    }
}