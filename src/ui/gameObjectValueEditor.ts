import { Transform } from "../objects/transform";
import { DEFAULT_GAME_OBJECT_NAME } from "../other/constValues";

const EDITBOX_ID: string = 'edit-box';
const OBJECT_NAME_HEADER_ID: string = 'object-name';
const TRANSFORM_VALUE_ATTRIBUTE : string = 'transformValue';
const AXIS_ATTRIBUTE : string = 'axis';
type TransformValues = 'position' | 'rotation' | 'scale';
type Axises = 'x' | 'y' | 'z';

export class GameObjectValueEditor {
    private editBox: HTMLElement | undefined;
    private objectNameHeader: HTMLElement | undefined;

    private transformInputs: Record<TransformValues, Vector3Input> = {
        position: new Vector3Input(),
        rotation: new Vector3Input(),
        scale: new Vector3Input()
    };

    private currentTransform: Transform | undefined;

    constructor() {
        const element = document.getElementById(EDITBOX_ID);
        if (!element) {
            console.error(`${EDITBOX_ID} not found!`);
            return;
        }
        this.editBox = element;

        const transformInputs = this.editBox.querySelectorAll(`div[${TRANSFORM_VALUE_ATTRIBUTE}]`);
        console.log(transformInputs);

        transformInputs.forEach(input => {
            const transformValue = input.getAttribute(TRANSFORM_VALUE_ATTRIBUTE) as TransformValues;
            if(transformValue) this.transformInputs[transformValue].init(input as HTMLElement);
        });

        const header = document.getElementById(OBJECT_NAME_HEADER_ID);
        if(header) this.objectNameHeader = header;

        this.editBox.style.display = 'none';
        this.registerListeners();
    }

    setCurrentTransform(objectName: string, transform: Transform): void {
        if (!this.editBox) return;

        const vector3Inputs : Record<TransformValues, [number, number, number]> = {
            position: [transform.position.x, transform.position.y, transform.position.z],
            rotation: [transform.eulerRotation.x, transform.eulerRotation.y, transform.eulerRotation.z],
            scale: [transform.scale.x, transform.scale.y, transform.scale.z],
        };

        this.currentTransform = transform;

        this.editBox.style.display = 'block';
        
        if (this.objectNameHeader) {
            this.objectNameHeader.textContent = objectName || DEFAULT_GAME_OBJECT_NAME;
        }

        Object.entries(vector3Inputs).forEach(([transformValue, vector3]) => {
            this.setVector3Inputs(transformValue as TransformValues, vector3);
        });
    }

    private registerListeners(): void {
        if (!this.editBox) return;

        const actions: Record<TransformValues, (x: number, y: number, z: number) => void> = {
            position: (x: number, y: number, z: number) => this.currentTransform?.setPosition(x, y, z),
            rotation:  (x: number, y: number, z: number) => this.currentTransform?.setRotation(x, y, z),
            scale:  (x: number, y: number, z: number) => this.currentTransform?.setScale(x, y, z),
        };

        Object.entries(this.transformInputs).forEach(([transformValue, vector3Input]) => {
            vector3Input.registerEventsToInputs(() => {
                const [x, y, z] = this.inputToVector3(transformValue as TransformValues);
                actions[transformValue as TransformValues]?.(x, y, z);
            });
        });
    }

    private inputToVector3(transformValue: TransformValues): [number, number, number] {
        return this.transformInputs[transformValue].getValues();
    }

    private setVector3Inputs(transformValue: TransformValues, [x, y, z]: [number, number, number]): void {
        this.transformInputs[transformValue].setValues([x, y, z]);
    }

    dispose(): void{
        this.editBox = undefined;
        this.objectNameHeader = undefined;
        this.currentTransform = undefined;

        Object.values(this.transformInputs).forEach((vector3Input) =>{
            vector3Input.dispose();
        });
    }
}

class AxisInput {
    private inputField: HTMLInputElement | undefined;

    private inputAction?: () => void;
    
    init(inputField: HTMLInputElement): void{
        this.inputField = inputField;
    }

    registerEventToInput(inputAction: () => void){
        if(this.inputField) {
            this.inputAction = inputAction;
            this.inputField.addEventListener('input', () => this.inputAction?.());
        }
    }

    setValue(value: number): void{
        if(this.inputField) this.inputField.value = (value ?? 0).toString(); 
    }
    getValue(): number {
        if(this.inputField) return parseFloat(this.inputField.value) || 0;
        else return 0;
    }

    dispose(): void{
        if(this.inputField){
            this.inputField.value = '';
            if(this.inputAction) {
                this.inputField.removeEventListener('input', () => this.inputAction?.());
                this.inputAction = undefined;
            }
        }

        this.inputField = undefined;
    }
}

class Vector3Input {
    private vector3Inputs : Record<Axises, AxisInput> ={
        x: new AxisInput(),
        y: new AxisInput(),
        z: new AxisInput()
    };

    init(vector3InputsContainer: HTMLElement){
        const inputs = vector3InputsContainer.querySelectorAll(`input[${AXIS_ATTRIBUTE}]`);

        inputs.forEach(input => {
            const axis = input.getAttribute(AXIS_ATTRIBUTE) as Axises;
            if(axis) {
                this.vector3Inputs[axis].init(input as HTMLInputElement);
            }
        });
    }

    registerEventsToInputs(inputEvent: () => void){
        Object.values(this.vector3Inputs).forEach((axisInput) =>{
            if(axisInput) axisInput.registerEventToInput(inputEvent);
        });
    }

    setValues([x, y, z]: [number, number, number]): void{
        this.vector3Inputs.x?.setValue(x);
        this.vector3Inputs.y?.setValue(y);
        this.vector3Inputs.z?.setValue(z);
    }

    getValues(): [number, number, number] {
        return[
            this.vector3Inputs.x?.getValue() || 0,
            this.vector3Inputs.y?.getValue() || 0,
            this.vector3Inputs.z?.getValue() || 0,
        ];
    }

    dispose(): void{
        Object.values(this.vector3Inputs).forEach((axisInput) =>{
            axisInput.dispose();
        });
    }
}