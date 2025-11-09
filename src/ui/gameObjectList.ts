import { IDisposable } from "../dispose";
import { DEFAULT_GAME_OBJECT_NAME } from "../other/constValues";

const OBJECT_LIST_ID = 'objects-list';
const OBJECT_ITEM_ID = 'object-item';
const OBJECT_ITEM_TEXT_ID = 'object-item-text';
const OBJECT_DELETE_BUTTON_ID = 'object-delete-button';

//перестраховка на случай, если у ul не будет дефолтного элемента, ибо проверять на наличие первого элемента уже маразм
//даже если какой-то элемент уже будет - он тупо будет скопипасчен и изменен
const DEFAULT_LI_GAMEOBJECT_ITEM_ELEMENT = `
    <li id="${OBJECT_ITEM_ID}" style="display: none;">
        <div id="${OBJECT_ITEM_TEXT_ID}">${DEFAULT_GAME_OBJECT_NAME}</div>
        <div id="${OBJECT_DELETE_BUTTON_ID}">X</div>
    </li>
`;
const DEFAULT_DIV_GAMEOBJECT_ITEM_ELEMENT = `
    <div id="${OBJECT_ITEM_ID}" style="display: none;">
        <div id="${OBJECT_ITEM_TEXT_ID}">${DEFAULT_GAME_OBJECT_NAME}</div>
        <div id="${OBJECT_DELETE_BUTTON_ID}">X</div>
    </div>
`;

export class GameObjectList implements IDisposable{

    //undefined поскольку неизвестно, есть ли объект с OBJECT_LIST_ID
    private HTMLObjectList: HTMLElement | undefined;

    private defaultObjectItemElement: HTMLElement | undefined;

    //была мысль все же вынести удаление отдельно, но решил, что пока и так норм, тем более опционально
    private onRemove?: (uuid: string) => void;

    private objectItems: Map<string, ObjectItem> = new Map<string, ObjectItem>();

    constructor(onRemove?: (uuid: string) => void){
        const element = document.getElementById(OBJECT_LIST_ID);

        if(!element){
            console.error(`${OBJECT_LIST_ID} not found!`);
            return;
        }

        this.HTMLObjectList = element;

        const firstElement = this.HTMLObjectList.querySelector(`[id="object-item"]`) as HTMLElement;

        if(firstElement){
            this.defaultObjectItemElement = firstElement;
        }
        else{
            if(this.HTMLObjectList instanceof HTMLUListElement){
                this.defaultObjectItemElement = document.createElement('li');
                this.defaultObjectItemElement.innerHTML = DEFAULT_LI_GAMEOBJECT_ITEM_ELEMENT;
            }
            else{
                this.defaultObjectItemElement = document.createElement('div');
                this.defaultObjectItemElement.innerHTML = DEFAULT_DIV_GAMEOBJECT_ITEM_ELEMENT;
            }
        }

        if(onRemove) this.onRemove = onRemove;
    }

    add(uuid: string, name: string, objectItemClickAction: () => void) : void{
        if(this.HTMLObjectList && this.defaultObjectItemElement){
            const objectItem: ObjectItem = new ObjectItem(this.defaultObjectItemElement, name, objectItemClickAction, () => this.onRemove?.(uuid));
            
            const objectItemElement = objectItem.getElement();
            if(objectItemElement) this.HTMLObjectList.appendChild(objectItemElement);

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

    dispose(): void{
        this.HTMLObjectList = undefined;

        Object.keys(this.objectItems).forEach((uuid) => this.remove(uuid));
    }
}

//выделил отдельно, чтобы проще управлять ивентом и вынести создание li
class ObjectItem{
    private objectItemElement: HTMLElement | undefined;

    private textElement: HTMLElement | undefined;

    private deleteButtonElement: HTMLElement | undefined;

    private objectItemClickAction?: () => void;

    private deleteClickAction?: () => void;

    constructor(objectItemElement: HTMLElement, name: string, objectItemClickAction?: () => void, deleteClickAction?: () => void){
        this.objectItemElement = objectItemElement.cloneNode(true) as HTMLElement;

        this.objectItemClickAction = objectItemClickAction;

        this.deleteClickAction = deleteClickAction;

        const text = this.objectItemElement.querySelector(`[id="${OBJECT_ITEM_TEXT_ID}"]`) as HTMLElement;

        if(text){
            console.log(text);
            this.textElement = text;
            this.textElement.textContent = name;
            if(this.objectItemClickAction) text.addEventListener('click', this.objectItemClickAction);
        }
        else
            if(this.objectItemClickAction) this.objectItemElement.addEventListener('click', this.objectItemClickAction);

        const deleteButton = this.objectItemElement.querySelector(`[id="${OBJECT_DELETE_BUTTON_ID}"]`) as HTMLElement

        if(deleteButton){
            this.deleteButtonElement = deleteButton;
            if(this.deleteClickAction) this.deleteButtonElement.addEventListener('click', this.deleteClickAction);
        }

        this.objectItemElement.removeAttribute('style');
    }

    getElement(): HTMLElement | undefined{
        return this.objectItemElement;
    }

    remove(): void{
        if(this.objectItemElement) {
            if(this.objectItemClickAction) {
                if(this.textElement)
                    this.textElement.removeEventListener('click', this.objectItemClickAction);
                else
                    this.objectItemElement.removeEventListener('click', this.objectItemClickAction);

                this.objectItemClickAction = undefined;
            }
            if(this.deleteButtonElement && this.deleteClickAction) this.deleteButtonElement.removeEventListener('click', this.deleteClickAction);

            this.deleteButtonElement = undefined;

            this.textElement = undefined;

            this.objectItemElement.remove();
        }
    }
}