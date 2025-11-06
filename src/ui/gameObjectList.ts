import { DEFAULT_GAME_OBJECT_NAME } from "../other/constValues";

const OBJECT_LIST_ID = 'objects-list';
const OBJECT_ITEM_ID = 'object-item';
const UUID_ATTRIBUTE = 'uuid';

export class GameObjectList{
    private HTMLObjectList: HTMLElement | undefined;

    private objectItems: Map<string, ObjectItem> = new Map<string, ObjectItem>();

    constructor(){
        const element = document.getElementById(OBJECT_LIST_ID);

        if(element) this.HTMLObjectList = element;
        else console.error(`${OBJECT_LIST_ID} not found!`);
    }

    add(uuid: string, name: string, event: () => void) : void{
        if(this.HTMLObjectList){
            const objectItem: ObjectItem = new ObjectItem(uuid, name, event);

            this.HTMLObjectList.appendChild(objectItem.getElement());

            this.objectItems.set(uuid, objectItem);
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

        if(renameble) renameble.rename(newName);
    }

    dispose(): void{
        this.HTMLObjectList = undefined;

        Object.keys(this.objectItems).forEach((uuid) => this.remove(uuid));
    }
}

class ObjectItem{
    private objectItemElement: HTMLLIElement;

    private event?: () => void;

    constructor(uuid: string, name: string, event: () => void){
        this.objectItemElement = document.createElement('li');
        this.objectItemElement.textContent = name ? name : DEFAULT_GAME_OBJECT_NAME;
        this.objectItemElement.id = OBJECT_ITEM_ID;
        this.objectItemElement.setAttribute(UUID_ATTRIBUTE, uuid);

        this.event = event;
        this.objectItemElement.addEventListener('click', () => this.event?.());
    }

    getElement(): HTMLLIElement{
        return this.objectItemElement;
    }

    remove(): void{
        if(this.objectItemElement) {
            if(this.event) {
                this.objectItemElement.removeEventListener('click', () => this.event?.());
                this.event = undefined;
            }
            this.objectItemElement.remove();
        }
    }

    rename(newName: string): void{
        this.objectItemElement.textContent = newName;
    }
}