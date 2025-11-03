import * as THREE from 'three';
import { Transform } from './transform';

export abstract class GameObject{
    abstract mesh : THREE.Mesh;
    abstract readonly name : string;
    transform = new Transform();

    get uuid(){
        return this.mesh.uuid;
    }

    constructor(){
        this.transform.setOnPositionChanged((position) => {
            this.mesh.position.copy(position);
        });

        this.transform.setOnRotationChanged((rotation) => {
            this.mesh.quaternion.copy(rotation);
        });

        this.transform.setOnScaleChanged((scale) => {
            this.mesh.scale.copy(scale);
        });
    }

    dispose():void{
        this.transform.dispose();

        this.mesh.geometry.dispose();
        if (this.mesh.material) {
            if (Array.isArray(this.mesh.material)) 
                this.mesh.material.forEach(mat => mat.dispose());
            else
                this.mesh.material.dispose();
        }
    }
}