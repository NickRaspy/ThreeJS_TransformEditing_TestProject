const OBJECT_LIST_ID = 'objects-list';

export class GameObjectList{
    private HTMLObjectList: HTMLElement | undefined;

    private objectItems: Map<string, HTMLElement> = new Map<string, HTMLElement>();

    constructor(){
        const element = document.getElementById(OBJECT_LIST_ID);

        if(element) this.HTMLObjectList = element;
        else console.error(`${OBJECT_LIST_ID} not found!`);
    }

    add(uuid: string, name: string, event: () => void) : void{
        if(this.HTMLObjectList){
            const li = document.createElement('li');
            li.textContent = name ? name : "Game Object";
            li.id = 'object-item';
            li.setAttribute('uuid', uuid);
            this.HTMLObjectList.appendChild(li);

            li.addEventListener('click', () => event());

            this.objectItems.set(uuid, li);
        }
    }

    remove(uuid: string): void{
        const removable = this.objectItems.get(uuid);

        if(removable){
            removable.remove();
            this.objectItems.delete(uuid);
        }
    }

    rename(uuid: string, newName: string): void{
        const renameble = this.objectItems.get(uuid);

        if(renameble) renameble.textContent = newName;
    }
}