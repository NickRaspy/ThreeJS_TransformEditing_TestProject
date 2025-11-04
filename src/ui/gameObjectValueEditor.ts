import { Transform } from "../objects/transform";

const EDITBOX_ID: string = 'editBox';

export class GameObjectValueEditor {
    private editBox: HTMLElement | undefined;
    private currentTransform: Transform | undefined;

    constructor() {
        const element = document.getElementById(EDITBOX_ID);
        if (!element) {
            console.error(`${EDITBOX_ID} not found!`);
            return;
        }
        this.editBox = element;
        this.editBox.style.display = 'none';
        this.registerListeners();
    }

    setCurrentTransform(objectName: string, transform: Transform): void {
        if (!this.editBox) return;

        this.currentTransform = transform;

        this.editBox.style.display = 'block';
        
        const objectNameElement = this.editBox.querySelector('#objectName');
        if (objectNameElement) {
            objectNameElement.textContent = objectName || 'Game Object';
        }

        this.setVector3Inputs('position', [transform.position.x, transform.position.y, transform.position.z]);
        this.setVector3Inputs('rotation', [transform.eulerRotation.x, transform.eulerRotation.y, transform.eulerRotation.z]);
        this.setVector3Inputs('scale', [transform.scale.x, transform.scale.y, transform.scale.z]);
    }

    private registerListeners(): void {
        if (!this.editBox) return;
        this.editBox.querySelectorAll(`[valueType] input`).forEach((input) => {
            const inputElement = input as HTMLInputElement;
            inputElement.addEventListener('input', () => {
                const vectorContainer = inputElement.closest('[valueType]');
                const attribute = vectorContainer?.getAttribute('valueType');

                if (attribute && this.currentTransform) {
                    const [x, y, z] = this.inputToVector3(attribute);
                    switch (attribute) {
                        case 'position':
                            this.currentTransform.setPosition(x, y, z);
                            break;
                        case 'rotation':
                            this.currentTransform.setRotation(x, y, z);
                            break;
                        case 'scale':
                            this.currentTransform.setScale(x, y, z);
                            break;
                    }
                }
            });
        });
    }

    private inputToVector3(valueType: string): [x: number, y: number, z: number] {
        const input = this.editBox?.querySelector(`[valueType="${valueType}"]`);
        if (!input) return [0, 0, 0];

        const [x, y, z] = ['x', 'y', 'z'].map(axis => 
            input.querySelector(`[axis='${axis}']`) as HTMLInputElement
        );

        return [
            parseFloat(x?.value || '0') || 0,
            parseFloat(y?.value || '0') || 0,
            parseFloat(z?.value || '0') || 0,
        ];
    }

    private setVector3Inputs(valueType: string, [x, y, z]: [x: number, y: number, z: number]): void {
        const input = this.editBox?.querySelector(`[valueType="${valueType}"]`);
        if (!input) return;

        const inputs = input.querySelectorAll('input');
        const values = [x, y, z];

        inputs.forEach((input, index) => {
            input.value = values[index].toString();
        });
    }
}