import * as THREE from 'three';
import { Transform } from './transform';

export abstract class GameObject{
    abstract mesh : THREE.Mesh;
    abstract name : string;
    transform = new Transform();

    constructor(){
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