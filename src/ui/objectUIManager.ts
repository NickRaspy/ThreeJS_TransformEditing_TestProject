import { GameObject } from "../objects/gameObject";
import { ObjectStorage } from "../objects/objectsStorage";
import { GameObjectValueEditor } from "./gameObjectValueEditor";

export class ObjectUIManager{
    private objectStorage : ObjectStorage;

    private gameObjectValueEditor: GameObjectValueEditor = new GameObjectValueEditor();

    private HTMLObjectList: HTMLElement | undefined;

    constructor(objectStorage: ObjectStorage){
        this.objectStorage = objectStorage;

        const element = document.getElementById('objects-list');

        if(element) this.HTMLObjectList = element;
        else console.error("object-list not found!");
    }

    addObject(uuid: string) : void{
        if(this.HTMLObjectList){
            const currentGameObject = this.objectStorage.getObject(uuid);

            if(!currentGameObject) return;

            const li = document.createElement('li');
            const name = currentGameObject.name;
            li.textContent = name ? name : "Game Object";
            li.id = 'object-item';
            li.setAttribute('uuid', uuid);
            this.HTMLObjectList.appendChild(li);

            li.addEventListener('click', () => this.gameObjectValueEditor.setCurrentTransform(currentGameObject.name, currentGameObject.transform));
        }
    }

    removeObject(uuid: string): void{
        const removable = this.HTMLObjectList?.querySelector(`[uuid="${uuid}"]`);

        if(removable) removable.remove();
    }

    renameObject(uuid: string, newName: string): void{
        const element = this.HTMLObjectList?.querySelector(`[uuid="${uuid}"]`);

        if(element) element.textContent = newName;
    }

}