import { ObjectRegistry } from "../objects/objectRegistry";

const CREATOR_OBJECT_ID = 'create-object';

export class GameObjectCreateMenu{
    private createGameObjectMenu : HTMLElement | undefined;
    private gameObjectSelect : HTMLSelectElement | undefined;
    private gameObjectCreateButton : HTMLButtonElement | undefined;

    constructor(onButtonClick: (value: string) => void){
        const element = document.getElementById(CREATOR_OBJECT_ID);

        if(!element){
            console.error(`${CREATOR_OBJECT_ID} wasn't found!`);
            return;
        }

        this.createGameObjectMenu = element;

        const select = element.querySelector('select');
        if(select) this.gameObjectSelect = select;

        const button = element.querySelector('button');
        if(button) {
            this.gameObjectCreateButton = button;
            button.addEventListener('click', () => onButtonClick(select?.value ?? ''));
        }

        this.fillSelect();
    }

    private fillSelect() : void{
        console.log(`obj reg amount: ${ObjectRegistry.availableObjects.length}`)
        ObjectRegistry.availableObjects.forEach(obj => {
            const option = document.createElement('option');
            option.value = obj;
            option.textContent = obj;

            this.gameObjectSelect?.appendChild(option);
        });
    }
}