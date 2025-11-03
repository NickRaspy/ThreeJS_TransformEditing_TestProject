import { GameObject } from "../objects/gameObject";

export class GameObjectValueEditor{
    private editBox : HTMLElement | undefined;

    constructor(){
        const element = document.getElementById('editBox');

        if(!element) {
            console.error('editBox not found!');
            return;
        }

        this.editBox = element;
        this.editBox.style.display = 'none';
    }

    
}