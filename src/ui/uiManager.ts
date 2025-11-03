import { GameObject } from "../objects/gameObject";

export class UIManager{
    private gameObjectsList: Map<string, string> = new Map<string, string>();

    private onObjectAdded(uuid: string, name: string): void{
        const list = document.getElementById('objects-list');

        if(list){
            const li = document.createElement('li');
            li.textContent = name;
            li.id = 'object-item';
            li.setAttribute('uuid', uuid);
            list.appendChild(li);
        }
    }
    addObject(uuid: string, gameObjectName: string) : void{
        this.gameObjectsList.set(uuid, gameObjectName);
        this.onObjectAdded(uuid, gameObjectName);
    }
}