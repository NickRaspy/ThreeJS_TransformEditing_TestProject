import { ObjectRegistry } from "../objects/objectRegistry";

const CREATOR_OBJECT_ID = 'create-object';

export class GameObjectCreateMenu{

    //undefined поскольку неизвестно, есть ли объект с CREATOR_OBJECT_ID
    private createGameObjectMenu : HTMLElement | undefined;
    private gameObjectSelect : HTMLSelectElement | undefined;
    private gameObjectCreateButton : HTMLButtonElement | undefined;

    private onButtonClick?: () => void;

    constructor(onButtonClick: (value: string) => void){
        const element = document.getElementById(CREATOR_OBJECT_ID);

        if(!element){
            console.error(`${CREATOR_OBJECT_ID} wasn't found!`);
            return;
        }

        this.createGameObjectMenu = element;

        const select = this.createGameObjectMenu.querySelector('select');
        if(select) this.gameObjectSelect = select;

        this.onButtonClick = () => onButtonClick(select?.value ?? '');

        const button = this.createGameObjectMenu.querySelector('button');
        if(button) {
            this.gameObjectCreateButton = button;
            button.addEventListener('click', () => {
                this.onButtonClick?.();
            });
        }

        this.fillSelect();
    }

    private fillSelect() : void{
        if(!this.gameObjectSelect) return;
        //для упрощения берет сразу же из реестра
        ObjectRegistry.availableObjects.forEach(obj => {
            const option = document.createElement('option');
            option.value = obj;
            option.textContent = obj;

            this.gameObjectSelect?.appendChild(option);
        });
    }

    private clearSelect() : void{
        if(!this.gameObjectSelect) return;

        const childs = this.gameObjectSelect?.querySelectorAll('option');
        if (childs){
            for(let i: number = 1; i < childs.length; i++){
                childs[i].remove();
            }
        }
    }

    dispose(){
        this.createGameObjectMenu = undefined;

        this.clearSelect();
        this.gameObjectSelect = undefined;

        this.gameObjectCreateButton?.removeEventListener('click', () => this.onButtonClick?.());
        this.gameObjectCreateButton = undefined;
    }
}