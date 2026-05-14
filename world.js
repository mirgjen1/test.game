import * as THREE from 'three';

export function createWorld(scene) {
    // 1. Lighting
    // Ambient light provides a base level of illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); 
    scene.add(ambientLight);

    // Directional light acts like a sun
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    scene.add(dirLight);

    // 2. Ground Plane
    // We use a grid texture to make movement more visible
    const gridHelper = new THREE.GridHelper(200, 100, 0x444444, 0x888888);
    scene.add(gridHelper);

    // Actual physical ground plane for collision/visuals
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to lie flat
    ground.receiveShadow = true;
    scene.add(ground);

    // 3. Obstacles (Crates)
    const objects = []; 
    const boundingBoxes = []; // For collision detection
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x8f5c38 }); // Brownish wood color

    // Spawn 50 random boxes around the map
    for (let i = 0; i < 50; i++) {
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        
        // Random position between -40 and 40
        box.position.x = Math.random() * 80 - 40;
        // Boxes rest on the ground (Y = 1 because height is 2)
        box.position.y = 1; 
        box.position.z = Math.random() * 80 - 40;
        
        box.rotation.y = Math.random() * Math.PI;
        
        box.castShadow = true;
        box.receiveShadow = true;
        
        scene.add(box);
        objects.push(box);
        
        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    }

    // Spawn some taller boxes
    const tallBoxGeometry = new THREE.BoxGeometry(2, 6, 2);
    for (let i = 0; i < 20; i++) {
        const box = new THREE.Mesh(tallBoxGeometry, boxMaterial);
        box.position.x = Math.random() * 80 - 40;
        box.position.y = 3; 
        box.position.z = Math.random() * 80 - 40;
        box.rotation.y = Math.random() * Math.PI;
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        objects.push(box);

        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    }

    const shootableObjects = [ground, ...objects];

    return { ground, objects, shootableObjects, boundingBoxes };
}
