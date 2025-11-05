import { Transform } from "../objects/transform";

const EDITBOX_ID: string = 'edit-box';
const OBJECT_NAME_HEADER_ID: string = 'object-name';

export class GameObjectValueEditor {
    private editBox: HTMLElement | undefined;
    private objectNameHeader: HTMLElement | undefined;

    private currentTransform: Transform | undefined;

    constructor() {
        const element = document.getElementById(EDITBOX_ID);
        if (!element) {
            console.error(`${EDITBOX_ID} not found!`);
            return;
        }
        this.editBox = element;

        const header = document.getElementById(OBJECT_NAME_HEADER_ID);
        if(header) this.objectNameHeader = header;

        this.editBox.style.display = 'none';
        this.registerListeners();
    }

    setCurrentTransform(objectName: string, transform: Transform): void {
        if (!this.editBox) return;

        const vector3Inputs : Record<string, [x: number, y: number, z: number]> = {
            position: [transform.position.x, transform.position.y, transform.position.z],
            rotation: [transform.eulerRotation.x, transform.eulerRotation.y, transform.eulerRotation.z],
            scale: [transform.scale.x, transform.scale.y, transform.scale.z],
        };

        this.currentTransform = transform;

        this.editBox.style.display = 'block';
        
        if (this.objectNameHeader) {
            this.objectNameHeader.textContent = objectName || 'Game Object';
        }

        Object.entries(vector3Inputs).forEach(([key, value]) => {
            this.setVector3Inputs(key, value);
        });
    }

    private registerListeners(): void {
        if (!this.editBox) return;

        const actions: Record<string, (x: number, y: number, z: number) => void> = {
            position: (x: number, y: number, z: number) => this.currentTransform?.setPosition(x, y, z),
            rotation:  (x: number, y: number, z: number) => this.currentTransform?.setRotation(x, y, z),
            scale:  (x: number, y: number, z: number) => this.currentTransform?.setScale(x, y, z),
        };
        
        this.editBox.querySelectorAll(`[valueType] input`).forEach(input => {
            input.addEventListener('input', () => {
                const vectorContainer = input.closest('[valueType]');
                const attribute = vectorContainer?.getAttribute('valueType');

                if (attribute && this.currentTransform) {
                    console.log('test');
                    const [x, y, z] = this.inputToVector3(attribute);
                    actions[attribute]?.(x, y, z);
                }
            });
        });
    }

    private inputToVector3(valueType: string): [x: number, y: number, z: number] {
        const input = this.editBox?.querySelector(`[valueType="${valueType}"]`);
        if (!input) return [0, 0, 0];

        const [xInput, yInput, zInput] = ['x', 'y', 'z'].map(axis => 
            input.querySelector(`[axis='${axis}']`) as HTMLInputElement
        );

        return [
            parseFloat(xInput?.value) || 0,
            parseFloat(yInput?.value) || 0,
            parseFloat(zInput?.value) || 0,
        ];
    }

    private setVector3Inputs(valueType: string, [x, y, z]: [x: number, y: number, z: number]): void {
        const input = this.editBox?.querySelector(`[valueType="${valueType}"]`);
        if (!input) return;
        
        const [xInput, yInput, zInput] = ['x', 'y', 'z'].map(axis =>
            input.querySelector(`[axis='${axis}']`) as HTMLInputElement
        );
        
        if (xInput) xInput.value = x.toString();
        if (yInput) yInput.value = y.toString();
        if (zInput) zInput.value = z.toString();
    }
}