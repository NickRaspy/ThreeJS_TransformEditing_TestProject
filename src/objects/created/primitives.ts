import { RegisterObject } from "../objectRegistry";
import { GameObject } from "../gameObject";
import * as THREE from 'three';

@RegisterObject('box')
export class Box extends GameObject {
    mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    name = 'Box';
}

@RegisterObject('sphere')
export class Sphere extends GameObject{
    mesh = new THREE.Mesh(new THREE.SphereGeometry(1,32,16));
    name = 'Sphere';
}

@RegisterObject('plane')
export class Plane extends GameObject{
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1))
    name = 'Plane';
}