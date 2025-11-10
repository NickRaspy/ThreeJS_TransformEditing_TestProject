import * as THREE from 'three';
import { IDisposable } from '../dispose';
export class Transform implements IDisposable{
    private _position = new THREE.Vector3(0, 0, 0);
    private _rotation = new THREE.Quaternion(0, 0, 0, 1);
    private _scale = new THREE.Vector3(1, 1, 1);

    private onPositionChanged?: (position: THREE.Vector3) => void;
    private onRotationChanged?: (rotation: THREE.Quaternion) => void;
    private onScaleChanged?: (scale: THREE.Vector3) => void;

    get position(): THREE.Vector3 { return this._position; }
    get rotation(): THREE.Quaternion { return this._rotation; }
    //это было добавлено сугубо для UI
    get eulerRotation(): THREE.Euler { return new THREE.Euler().setFromQuaternion(this._rotation); }
    get scale(): THREE.Vector3 { return this._scale; }

    set position(value: THREE.Vector3) {
        this._position.copy(value);
        if (this.onPositionChanged) {
            this.onPositionChanged(this._position);
        }
    }

    set rotation(value: THREE.Quaternion) {
        this._rotation.copy(value);
        if (this.onRotationChanged) {
            this.onRotationChanged(this._rotation);
        }
    }

    set scale(value: THREE.Vector3) {
        this._scale.copy(value);
        if (this.onScaleChanged) {
            this.onScaleChanged(this._scale);
        }
    }

    setPosition(x: number, y: number, z: number): void {
        this._position.set(x, y, z);
        if (this.onPositionChanged) {
            this.onPositionChanged(this._position);
        }
    }

    setRotation(x: number, y: number, z: number): void {
        const euler = new THREE.Euler(
            THREE.MathUtils.degToRad(x),
            THREE.MathUtils.degToRad(y),
            THREE.MathUtils.degToRad(z)
        );

        this._rotation.setFromEuler(euler);

        if (this.onRotationChanged) {
            this.onRotationChanged(this._rotation);
        }
    }

    setScale(x: number, y: number, z: number): void {
        this._scale.set(x, y, z);
        if (this.onScaleChanged) {
            this.onScaleChanged(this._scale);
        }
    }

    setOnPositionChanged(action: (position: THREE.Vector3) => void): void {
        this.onPositionChanged = action;
    }

    setOnRotationChanged(action: (rotation: THREE.Quaternion) => void): void {
        this.onRotationChanged = action;
    }

    setOnScaleChanged(action: (scale: THREE.Vector3) => void): void {
        this.onScaleChanged = action;
    }

    dispose(): void {
        this.onPositionChanged = undefined;
        this.onRotationChanged = undefined;
        this.onScaleChanged = undefined;
    }
}