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
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;
    dirLight.shadow.camera.left = -200;
    dirLight.shadow.camera.right = 200;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Additional warm hemisphere light for balanced daytime feel
    const hemiLight = new THREE.HemisphereLight(0xffd89b, 0x8b7e6a, 0.5);
    scene.add(hemiLight);

    // 2. Ground Plane - Desert Sand Color
    const groundGeometry = new THREE.PlaneGeometry(400, 400);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xc9a86a }); // Sandy beige
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const objects = []; 
    const boundingBoxes = [];

    // Colors for Mirage
    const sandColor = 0xc9a86a;
    const brickColor = 0x9d7f56;
    const concreteColor = 0x8b8680;
    const woodColor = 0x8f5c38;
    const tileColor = 0xd4a574;

    // --- T SPAWN (Bottom Left) ---
    const tSpawnGround = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshLambertMaterial({ color: 0xa89070 })
    );
    tSpawnGround.position.set(-100, 0.05, -100);
    tSpawnGround.receiveShadow = true;
    scene.add(tSpawnGround);

    // T spawn walls
    const tWall1 = new THREE.Mesh(
        new THREE.BoxGeometry(40, 12, 2),
        new THREE.MeshLambertMaterial({ color: brickColor })
    );
    tWall1.position.set(-100, 6, -120);
    tWall1.castShadow = true;
    tWall1.receiveShadow = true;
    scene.add(tWall1);
    objects.push(tWall1);
    tWall1.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(tWall1));

    const tWall2 = new THREE.Mesh(
        new THREE.BoxGeometry(2, 12, 40),
        new THREE.MeshLambertMaterial({ color: brickColor })
    );
    tWall2.position.set(-120, 6, -100);
    tWall2.castShadow = true;
    tWall2.receiveShadow = true;
    scene.add(tWall2);
    objects.push(tWall2);
    tWall2.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(tWall2));

    // --- CT SPAWN (Top Right) ---
    const ctSpawnGround = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshLambertMaterial({ color: 0xa89070 })
    );
    ctSpawnGround.position.set(100, 0.05, 100);
    ctSpawnGround.receiveShadow = true;
    scene.add(ctSpawnGround);

    // CT spawn walls
    const ctWall1 = new THREE.Mesh(
        new THREE.BoxGeometry(40, 12, 2),
        new THREE.MeshLambertMaterial({ color: brickColor })
    );
    ctWall1.position.set(100, 6, 120);
    ctWall1.castShadow = true;
    ctWall1.receiveShadow = true;
    scene.add(ctWall1);
    objects.push(ctWall1);
    ctWall1.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(ctWall1));

    const ctWall2 = new THREE.Mesh(
        new THREE.BoxGeometry(2, 12, 40),
        new THREE.MeshLambertMaterial({ color: brickColor })
    );
    ctWall2.position.set(120, 6, 100);
    ctWall2.castShadow = true;
    ctWall2.receiveShadow = true;
    scene.add(ctWall2);
    objects.push(ctWall2);
    ctWall2.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(ctWall2));

    // --- A SITE (Left Side) ---
    // A site main platform
    const aSitePlatform = new THREE.Mesh(
        new THREE.BoxGeometry(50, 1, 50),
        new THREE.MeshLambertMaterial({ color: tileColor })
    );
    aSitePlatform.position.set(-60, 0.5, 0);
    aSitePlatform.castShadow = true;
    aSitePlatform.receiveShadow = true;
    scene.add(aSitePlatform);
    objects.push(aSitePlatform);
    aSitePlatform.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(aSitePlatform));

    // A site building (main structure)
    const aBuilding = new THREE.Mesh(
        new THREE.BoxGeometry(40, 15, 20),
        new THREE.MeshLambertMaterial({ color: brickColor })
    );
    aBuilding.position.set(-80, 7.5, 0);
    aBuilding.castShadow = true;
    aBuilding.receiveShadow = true;
    scene.add(aBuilding);
    objects.push(aBuilding);
    aBuilding.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(aBuilding));

    // A site stairs (ascending)
    const stairStep1 = new THREE.Mesh(
        new THREE.BoxGeometry(20, 2, 15),
        new THREE.MeshLambertMaterial({ color: concreteColor })
    );
    stairStep1.position.set(-50, 1, -25);
    stairStep1.castShadow = true;
    stairStep1.receiveShadow = true;
    scene.add(stairStep1);
    objects.push(stairStep1);
    stairStep1.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(stairStep1));

    const stairStep2 = new THREE.Mesh(
        new THREE.BoxGeometry(20, 2, 15),
        new THREE.MeshLambertMaterial({ color: concreteColor })
    );
    stairStep2.position.set(-50, 3, -42);
    stairStep2.castShadow = true;
    stairStep2.receiveShadow = true;
    scene.add(stairStep2);
    objects.push(stairStep2);
    stairStep2.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(stairStep2));

    // A site boxes for cover
    const aBoxes = [[-45, 0.7, 15], [-70, 0.7, 20], [-40, 0.7, -15], [-85, 0.7, -10]];
    aBoxes.forEach(pos => {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 4),
            new THREE.MeshLambertMaterial({ color: woodColor })
        );
        box.position.set(...pos);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        objects.push(box);
        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    });

    // --- B SITE (Right Side) ---
    // B site palace main area
    const bSitePlatform = new THREE.Mesh(
        new THREE.BoxGeometry(60, 1, 40),
        new THREE.MeshLambertMaterial({ color: tileColor })
    );
    bSitePlatform.position.set(60, 0.5, -40);
    bSitePlatform.castShadow = true;
    bSitePlatform.receiveShadow = true;
    scene.add(bSitePlatform);
    objects.push(bSitePlatform);
    bSitePlatform.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bSitePlatform));

    // B site building (palace structure)
    const bBuilding = new THREE.Mesh(
        new THREE.BoxGeometry(50, 12, 35),
        new THREE.MeshLambertMaterial({ color: 0xa0845c })
    );
    bBuilding.position.set(90, 6, -60);
    bBuilding.castShadow = true;
    bBuilding.receiveShadow = true;
    scene.add(bBuilding);
    objects.push(bBuilding);
    bBuilding.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bBuilding));

    // B site elevated platform
    const bElevated = new THREE.Mesh(
        new THREE.BoxGeometry(25, 2, 20),
        new THREE.MeshLambertMaterial({ color: concreteColor })
    );
    bElevated.position.set(40, 5, -55);
    bElevated.castShadow = true;
    bElevated.receiveShadow = true;
    scene.add(bElevated);
    objects.push(bElevated);
    bElevated.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bElevated));

    // B site stairs
    const bStair = new THREE.Mesh(
        new THREE.BoxGeometry(18, 2, 12),
        new THREE.MeshLambertMaterial({ color: concreteColor })
    );
    bStair.position.set(25, 2.5, -35);
    bStair.castShadow = true;
    bStair.receiveShadow = true;
    scene.add(bStair);
    objects.push(bStair);
    bStair.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bStair));

    // B site boxes for cover
    const bBoxes = [[50, 0.7, -25], [80, 0.7, -40], [35, 0.7, -60]];
    bBoxes.forEach(pos => {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 4),
            new THREE.MeshLambertMaterial({ color: woodColor })
        );
        box.position.set(...pos);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        objects.push(box);
        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    });

    // --- MIDDLE AREA ---
    // Main middle corridor
    const middleFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 100),
        new THREE.MeshLambertMaterial({ color: 0xb8956a })
    );
    middleFloor.position.set(0, 0.05, 0);
    middleFloor.receiveShadow = true;
    scene.add(middleFloor);

    // Market stalls in middle
    const stallMat = new THREE.MeshLambertMaterial({ color: 0xa0845c });
    const stallPositions = [[-20, 3, 10], [0, 3, 15], [20, 3, 10]];
    
    stallPositions.forEach(pos => {
        const stall = new THREE.Mesh(
            new THREE.BoxGeometry(8, 6, 8),
            stallMat
        );
        stall.position.set(...pos);
        stall.castShadow = true;
        stall.receiveShadow = true;
        scene.add(stall);
        objects.push(stall);
        stall.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(stall));
    });

    // Catwalk (upper middle structure)
    const catwalk = new THREE.Mesh(
        new THREE.BoxGeometry(50, 2, 15),
        new THREE.MeshLambertMaterial({ color: 0x6b5d4f })
    );
    catwalk.position.set(0, 8, 30);
    catwalk.castShadow = true;
    catwalk.receiveShadow = true;
    scene.add(catwalk);
    objects.push(catwalk);
    catwalk.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(catwalk));

    // Catwalk support pillars
    for (let i = -1; i <= 1; i++) {
        const pillar = new THREE.Mesh(
            new THREE.BoxGeometry(2, 8, 2),
            new THREE.MeshLambertMaterial({ color: 0x6b5d4f })
        );
        pillar.position.set(i * 20, 4, 30);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.add(pillar);
        objects.push(pillar);
        pillar.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(pillar));
    }

    // Barrels scattered throughout middle
    const barrelMat = new THREE.MeshLambertMaterial({ color: 0x6b4423 });
    const barrelGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 8);
    const barrelPositions = [[-30, 1.5, 20], [30, 1.5, -15], [-10, 1.5, -30], [20, 1.5, 40]];
    
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

    // --- SIDE STRUCTURES ---
    // Archway connecting areas
    const archway = new THREE.Mesh(
        new THREE.BoxGeometry(25, 12, 2),
        new THREE.MeshLambertMaterial({ color: 0xa89968 })
    );
    archway.position.set(-25, 6, -50);
    archway.castShadow = true;
    archway.receiveShadow = true;
    scene.add(archway);
    objects.push(archway);
    archway.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(archway));

    // Connector walls
    const connectorWall = new THREE.Mesh(
        new THREE.BoxGeometry(2, 10, 40),
        new THREE.MeshLambertMaterial({ color: brickColor })
    );
    connectorWall.position.set(-70, 5, 40);
    connectorWall.castShadow = true;
    connectorWall.receiveShadow = true;
    scene.add(connectorWall);
    objects.push(connectorWall);
    connectorWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(connectorWall));

    // Additional cover structures
    const coverStructures = [
        { pos: [-15, 2.5, -30], size: [10, 5, 10], color: concreteColor },
        { pos: [15, 2.5, 40], size: [10, 5, 10], color: concreteColor },
        { pos: [70, 2.5, 20], size: [8, 5, 8], color: woodColor }
    ];

    coverStructures.forEach(struct => {
        const cover = new THREE.Mesh(
            new THREE.BoxGeometry(...struct.size),
            new THREE.MeshLambertMaterial({ color: struct.color })
        );
        cover.position.set(...struct.pos);
        cover.castShadow = true;
        cover.receiveShadow = true;
        scene.add(cover);
        objects.push(cover);
        cover.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(cover));
    });

    const shootableObjects = [ground, ...objects];

    return { ground, objects, shootableObjects, boundingBoxes };
}
