import * as THREE from 'three';

export function createObjects(objectsData) {
    const createdObjects = []; 

    for (const data of objectsData) {
        let geometry;
        let material = new THREE.MeshBasicMaterial({ 
            color: Math.random() * 0xffffff 
        });

        switch (data.type) {
            case 'box':
                geometry = new THREE.BoxGeometry(1, 1, 1); 
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.5, 32, 16); 
                break;
            case 'plane':
                geometry = new THREE.PlaneGeometry(1, 1); 
                break;
            default:
                console.warn(`Unknown object type: ${data.type}`);
                continue; 
        }

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(data.transform.position);
        mesh.quaternion.copy(data.transform.rotation); 
        mesh.scale.copy(data.transform.scale);

        if (data.type === 'plane') {
            
            const initialRotation = new THREE.Quaternion();
            initialRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            
            mesh.quaternion.multiply(initialRotation);
        }
        createdObjects.push(mesh);
    }
    return createdObjects; 
}