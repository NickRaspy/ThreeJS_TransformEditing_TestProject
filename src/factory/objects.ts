import * as THREE from 'three';

//база объектов
export class Transform {
    private _position = new THREE.Vector3(0,0,0);
    private _rotation = new THREE.Quaternion(0,0,0,0);
    private _scale = new THREE.Vector3(1,1,1);
    
    private positionChangedCallbacks: ((position: THREE.Vector3) => void)[] = [];
    private rotationChangedCallbacks: ((rotation: THREE.Quaternion) => void)[] = [];
    private scaleChangedCallbacks: ((scale: THREE.Vector3) => void)[] = [];

    get position(): THREE.Vector3 { return this._position.clone(); }
    get rotation(): THREE.Quaternion { return this._rotation.clone(); }
    get scale(): THREE.Vector3 { return this._scale.clone(); }

    set position(value: THREE.Vector3) {
        this._position.copy(value);
        this.positionChangedCallbacks.forEach(callback => callback(this._position));
    }

    set rotation(value: THREE.Quaternion) {
        this._rotation.copy(value);
        this.rotationChangedCallbacks.forEach(callback => callback(this._rotation));
    }

    set scale(value: THREE.Vector3) {
        this._scale.copy(value);
        this.scaleChangedCallbacks.forEach(callback => callback(this._scale));
    }

    onPositionChanged(callback: (position: THREE.Vector3) => void) {
        this.positionChangedCallbacks.push(callback);
    }

    onRotationChanged(callback: (rotation: THREE.Quaternion) => void) {
        this.rotationChangedCallbacks.push(callback);
    }

    onScaleChanged(callback: (scale: THREE.Vector3) => void) {
        this.scaleChangedCallbacks.push(callback);
    }
}

export class Object{
    mesh : THREE.Mesh;
    name : string;
    transform = new Transform();

    constructor(mesh: THREE.Mesh, name: string){
        this.mesh = mesh;
        this.name = name;

        this.transform.onPositionChanged((position) => {
            this.mesh.position.copy(position);
        });
        
        this.transform.onRotationChanged((rotation) => {
            this.mesh.quaternion.copy(rotation);
        });
        
        this.transform.onScaleChanged((scale) => {
            this.mesh.scale.copy(scale);
        });
    }
}


//объекты
@Register
export class Box extends Object{
    constructor(){
        super(new THREE.Mesh(new THREE.BoxGeometry(1,1,1)), 'box');
    }
};

//регистрация объектов для получения объекта, интегрированный автоматически
export const ObjectRegistry = new class {
    private types = new Map<string, new () => Object>();
    
    register(constructor: new () => Object) {
        const instance = new constructor();
        this.types.set(instance.name, constructor);
    }
    
    get list(): string[] {
        return Array.from(this.types.keys());
    }
};

export function Register(constructor: new () => Object) {
    ObjectRegistry.register(constructor);
    return constructor;
}