import * as THREE from "three";
import { Axises } from "../other/types";

export const Vector3Arrows = new class{
    
    private arrows: Record<Axises, THREE.ArrowHelper> = {
        x: new THREE.ArrowHelper(
            new THREE.Vector3( 1, 0, 0 ), 
            new THREE.Vector3( -1, 0, 0 ), 
            2, 
            0xFF0000
        ),
        y: new THREE.ArrowHelper(
            new THREE.Vector3( 0, 1, 0 ), 
            new THREE.Vector3( 0, -1, 0 ), 
            2, 
            0x00FF00
        ),
        z: new THREE.ArrowHelper(
            new THREE.Vector3( 0, 0, 1 ), 
            new THREE.Vector3( 0, 0, -1 ), 
            2, 
            0x0000FF
        )
    }
    getArrows(): Array<THREE.ArrowHelper>{
        return Object.values(this.arrows);
    }
}
