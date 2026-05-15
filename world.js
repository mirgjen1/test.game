import * as THREE from 'three';

export function createWorld(scene) {
    // 1. Daytime Lighting - Enhanced Golden Hour for Mirage
    // Warm ambient light simulating daytime
    const ambientLight = new THREE.AmbientLight(0xfdbf69, 0.8); 
    scene.add(ambientLight);

    // Directional light acts like a warm sun at a lower angle (late afternoon)
    const dirLight = new THREE.DirectionalLight(0xfde4a8, 2.2);
    dirLight.position.set(60, 80, 40);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 150;
    dirLight.shadow.camera.bottom = -150;
    dirLight.shadow.camera.left = -150;
    dirLight.shadow.camera.right = 150;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Additional warm hemisphere light for balanced daytime feel
    const hemiLight = new THREE.HemisphereLight(0xffd89b, 0x8b7e6a, 0.5);
    scene.add(hemiLight);

    // 2. Ground Plane - Desert Sand Color
    const groundGeometry = new THREE.PlaneGeometry(300, 300);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xc9a86a }); // Sandy beige
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const objects = []; 
    const boundingBoxes = [];

    // --- MIRAGE MAP STRUCTURE ---

    // Middle courtyard area - create a sunken central plaza
    const platinumMaterial = new THREE.MeshLambertMaterial({ color: 0xd4a574 });
    const courtyard = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 60),
        platinumMaterial
    );
    courtyard.position.y = 0.1;
    courtyard.receiveShadow = true;
    scene.add(courtyard);

    // Building A - Left structure (tan/beige color)
    const buildingAMat = new THREE.MeshLambertMaterial({ color: 0xb8956a });
    const buildingA = new THREE.Mesh(
        new THREE.BoxGeometry(30, 15, 20),
        buildingAMat
    );
    buildingA.position.set(-50, 7.5, 0);
    buildingA.castShadow = true;
    buildingA.receiveShadow = true;
    scene.add(buildingA);
    objects.push(buildingA);
    buildingA.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(buildingA));

    // Building B - Right structure (darker brown)
    const buildingBMat = new THREE.MeshLambertMaterial({ color: 0x9d7f56 });
    const buildingB = new THREE.Mesh(
        new THREE.BoxGeometry(35, 18, 25),
        buildingBMat
    );
    buildingB.position.set(55, 9, -20);
    buildingB.castShadow = true;
    buildingB.receiveShadow = true;
    scene.add(buildingB);
    objects.push(buildingB);
    buildingB.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(buildingB));

    // Market Stalls - Central structures
    const stallMat = new THREE.MeshLambertMaterial({ color: 0xa0845c });
    for (let i = 0; i < 4; i++) {
        const stall = new THREE.Mesh(
            new THREE.BoxGeometry(8, 6, 8),
            stallMat
        );
        stall.position.set(-15 + i * 12, 3, 5);
        stall.castShadow = true;
        stall.receiveShadow = true;
        scene.add(stall);
        objects.push(stall);
        stall.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(stall));
    }

    // Stairs - A site stairs (ascending platform)
    const stairMat = new THREE.MeshLambertMaterial({ color: 0xc9a86a });
    const stairStep = new THREE.Mesh(
        new THREE.BoxGeometry(15, 2, 12),
        stairMat
    );
    stairStep.position.set(-40, 1, -35);
    stairStep.castShadow = true;
    stairStep.receiveShadow = true;
    scene.add(stairStep);
    objects.push(stairStep);
    stairStep.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(stairStep));

    const stairStep2 = new THREE.Mesh(
        new THREE.BoxGeometry(15, 2, 12),
        stairMat
    );
    stairStep2.position.set(-40, 3.5, -50);
    stairStep2.castShadow = true;
    stairStep2.receiveShadow = true;
    scene.add(stairStep2);
    objects.push(stairStep2);
    stairStep2.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(stairStep2));

    // Catwalk - Elevated walkway
    const catwalkMat = new THREE.MeshLambertMaterial({ color: 0x8f7a5e });
    const catwalk = new THREE.Mesh(
        new THREE.BoxGeometry(12, 1.5, 40),
        catwalkMat
    );
    catwalk.position.set(35, 8, 5);
    catwalk.castShadow = true;
    catwalk.receiveShadow = true;
    scene.add(catwalk);
    objects.push(catwalk);
    catwalk.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(catwalk));

    // Support pillar under catwalk
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0x6b5d4f });
    const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(2, 8, 2),
        pillarMat
    );
    pillar.position.set(35, 4, -5);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    scene.add(pillar);
    objects.push(pillar);
    pillar.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(pillar));

    // B site platform - Elevated bomb site
    const bSiteMat = new THREE.MeshLambertMaterial({ color: 0xb8956a });
    const bSite = new THREE.Mesh(
        new THREE.BoxGeometry(25, 1, 25),
        bSiteMat
    );
    bSite.position.set(20, 5, -55);
    bSite.castShadow = true;
    bSite.receiveShadow = true;
    scene.add(bSite);
    objects.push(bSite);
    bSite.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bSite));

    // Crates and boxes for cover and detail
    const crateMat = new THREE.MeshLambertMaterial({ color: 0x8f5c38 });
    const smallBoxGeo = new THREE.BoxGeometry(3, 3, 3);
    
    const cratePositions = [
        [-25, 1.5, 20], [10, 1.5, 30], [50, 1.5, 20],
        [-60, 1.5, -40], [40, 1.5, -45], [-45, 1.5, 10],
        [15, 6, 5], [65, 9, -30], [-50, 6, -20]
    ];

    cratePositions.forEach(pos => {
        const crate = new THREE.Mesh(smallBoxGeo, crateMat);
        crate.position.set(...pos);
        crate.castShadow = true;
        crate.receiveShadow = true;
        scene.add(crate);
        objects.push(crate);
        crate.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(crate));
    });

    // Decorative barrels (cylinders)
    const barrelMat = new THREE.MeshLambertMaterial({ color: 0x6b4423 });
    const barrelGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 8);
    
    const barrelPositions = [
        [-20, 1.5, 35], [30, 1.5, 15], [-70, 1.5, -30],
        [70, 10, -25], [-35, 1.5, -45]
    ];

    barrelPositions.forEach(pos => {
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.position.set(...pos);
        barrel.castShadow = true;
        barrel.receiveShadow = true;
        scene.add(barrel);
        objects.push(barrel);
        barrel.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(barrel));
    });

    // Architectural archway - Mirage signature element
    const archMat = new THREE.MeshLambertMaterial({ color: 0xa89968 });
    const arch = new THREE.Mesh(
        new THREE.BoxGeometry(20, 12, 2),
        archMat
    );
    arch.position.set(-5, 6, 50);
    arch.castShadow = true;
    arch.receiveShadow = true;
    scene.add(arch);
    objects.push(arch);
    arch.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(arch));

    const shootableObjects = [ground, ...objects];

    return { ground, objects, shootableObjects, boundingBoxes };
}
