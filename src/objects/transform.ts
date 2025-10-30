import * as THREE from 'three';
export class Transform {
    private _position = new THREE.Vector3(0, 0, 0);
    private _rotation = new THREE.Quaternion(0, 0, 0, 1);
    private _scale = new THREE.Vector3(1, 1, 1);

    private positionChangedCallbacks: ((position: THREE.Vector3) => void)[] = [];
    private rotationChangedCallbacks: ((rotation: THREE.Quaternion) => void)[] = [];
    private scaleChangedCallbacks: ((scale: THREE.Vector3) => void)[] = [];

    get position(): THREE.Vector3 { return this._position; }
    get rotation(): THREE.Quaternion { return this._rotation; }
    get scale(): THREE.Vector3 { return this._scale; }

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

    setPosition(x: number, y: number, z: number): void {
        this._position.set(x, y, z);
        this.positionChangedCallbacks.forEach(callback => callback(this._position));
    }

    setRotation(x: number, y: number, z: number, w: number = 1): void {
        this._rotation.set(x, y, z, w);
        this.rotationChangedCallbacks.forEach(callback => callback(this._rotation));
    }

    setScale(x: number, y: number, z: number): void {
        this._scale.set(x, y, z);
        this.scaleChangedCallbacks.forEach(callback => callback(this._scale));
    }

    onPositionChanged(callback: (position: THREE.Vector3) => void): void {
        this.positionChangedCallbacks.push(callback);
    }

    onRotationChanged(callback: (rotation: THREE.Quaternion) => void): void {
        this.rotationChangedCallbacks.push(callback);
    }

    onScaleChanged(callback: (scale: THREE.Vector3) => void): void {
        this.scaleChangedCallbacks.push(callback);
    }
}