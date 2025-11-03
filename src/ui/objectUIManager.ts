import { GameObject } from "../objects/gameObject";

export class ObjectUIManager{
    private gameObjectsList: Map<string, string> = new Map<string, string>();

    private HTMLObjectList: HTMLElement | undefined;

    

    constructor(){
        const element = document.getElementById('objects-list');

        if(element) this.HTMLObjectList = element;
        else console.error("object-list not found!");
    }

    private createObjectItem(uuid: string, name: string): void{
        if(this.HTMLObjectList){
            const li = document.createElement('li');
            li.textContent = name;
            li.id = 'object-item';
            li.setAttribute('uuid', uuid);
            this.HTMLObjectList.appendChild(li);
        }
    }

    private removeObjectItem(uuid: string): void{
        const removable = this.HTMLObjectList?.querySelector(`[uuid="${uuid}"]`);

        if(removable) removable.remove();
    }

    private renameObjectItem(uuid: string, newName: string){
        const element = this.HTMLObjectList?.querySelector(`[uuid="${uuid}"]`);
        if(element) element.textContent = newName;
    }

    addObject(uuid: string, gameObjectName: string) : void{
        this.gameObjectsList.set(uuid, gameObjectName);
        this.createObjectItem(uuid, gameObjectName);
    }

    removeObject(uuid: string): void{
        this.removeObjectItem(uuid);
        this.gameObjectsList.delete(uuid);
    }

    renameObject(uuid: string, newName: string): void{
        if(!this.gameObjectsList.has(uuid)) return;

        this.gameObjectsList.set(uuid, newName);
        this.renameObjectItem(uuid, newName);
    }
}