import * as THREE from 'three';

export function createWorld(scene) {
    // Daytime Lighting - Desert Golden Hour
    const ambientLight = new THREE.AmbientLight(0xfdbf69, 0.8); 
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfde4a8, 2.2);
    dirLight.position.set(60, 80, 40);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 120;
    dirLight.shadow.camera.bottom = -120;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffd89b, 0x8b7e6a, 0.5);
    scene.add(hemiLight);

    // Ground Plane - Large desert floor
    const groundGeometry = new THREE.PlaneGeometry(300, 300);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xc9a86a });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    const objects = []; 
    const boundingBoxes = [];

    // Material colors for authenticity
    const wallColor = 0x9d7f56;
    const concreteColor = 0x8b8680;
    const woodColor = 0x8f5c38;
    const platformColor = 0xd4a574;
    const metalColor = 0x707070;
    const sandColor = 0xc9a86a;

    // ===== T SPAWN (Bottom-Left) =====
    const tSpawnMarker = new THREE.Mesh(
        new THREE.BoxGeometry(4, 8, 4),
        new THREE.MeshLambertMaterial({ color: 0x0066ff })
    );
    tSpawnMarker.position.set(-80, 4, -80);
    tSpawnMarker.castShadow = true;
    tSpawnMarker.receiveShadow = true;
    scene.add(tSpawnMarker);

    // T Spawn exit walls
    const tSpawnWall1 = new THREE.Mesh(new THREE.BoxGeometry(25, 8, 2), new THREE.MeshLambertMaterial({ color: wallColor }));
    tSpawnWall1.position.set(-80, 4, -65);
    tSpawnWall1.castShadow = true;
    tSpawnWall1.receiveShadow = true;
    scene.add(tSpawnWall1);
    objects.push(tSpawnWall1);
    tSpawnWall1.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(tSpawnWall1));

    // ===== OUTSIDE/APPS AREA (T-side mid connector) =====
    // Boxes in outside area for cover
    const outsideBoxes = [[-60, 0.5, -70], [-50, 0.5, -60], [-70, 0.5, -55]];
    outsideBoxes.forEach(pos => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshLambertMaterial({ color: woodColor }));
        box.position.set(...pos);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        objects.push(box);
        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    });

    // ===== CT SPAWN (Top-Right) =====
    const ctSpawnMarker = new THREE.Mesh(
        new THREE.BoxGeometry(4, 8, 4),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    ctSpawnMarker.position.set(80, 4, 80);
    ctSpawnMarker.castShadow = true;
    ctSpawnMarker.receiveShadow = true;
    scene.add(ctSpawnMarker);

    const ctSpawnWall = new THREE.Mesh(new THREE.BoxGeometry(25, 8, 2), new THREE.MeshLambertMaterial({ color: wallColor }));
    ctSpawnWall.position.set(80, 4, 65);
    ctSpawnWall.castShadow = true;
    ctSpawnWall.receiveShadow = true;
    scene.add(ctSpawnWall);
    objects.push(ctSpawnWall);
    ctSpawnWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(ctSpawnWall));

    // ===== TOP MID (Open sniper engagement area) =====
    // Open plaza - main T rotation from T-Spawn
    const topMidPlatform = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 40),
        new THREE.MeshLambertMaterial({ color: platformColor })
    );
    topMidPlatform.rotation.x = -Math.PI / 2;
    topMidPlatform.position.set(-10, 0.05, 30);
    topMidPlatform.receiveShadow = true;
    scene.add(topMidPlatform);

    // Mid walls containing top mid
    const topMidWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 40), new THREE.MeshLambertMaterial({ color: wallColor }));
    topMidWallLeft.position.set(-35, 4, 30);
    topMidWallLeft.castShadow = true;
    topMidWallLeft.receiveShadow = true;
    scene.add(topMidWallLeft);
    objects.push(topMidWallLeft);
    topMidWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(topMidWallLeft));

    // ===== SNIPER'S NEST / WINDOW (Elevated CT defensive position) =====
    // Sniper nest platform (elevated)
    const sniperNestPlatform = new THREE.Mesh(
        new THREE.BoxGeometry(15, 1, 15),
        new THREE.MeshLambertMaterial({ color: concreteColor })
    );
    sniperNestPlatform.position.set(30, 6, 35);
    sniperNestPlatform.castShadow = true;
    sniperNestPlatform.receiveShadow = true;
    scene.add(sniperNestPlatform);
    objects.push(sniperNestPlatform);
    sniperNestPlatform.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(sniperNestPlatform));

    // Sniper nest stairs/support
    const sniperStairs = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 12), new THREE.MeshLambertMaterial({ color: concreteColor }));
    sniperStairs.position.set(35, 3, 25);
    sniperStairs.castShadow = true;
    sniperStairs.receiveShadow = true;
    scene.add(sniperStairs);
    objects.push(sniperStairs);
    sniperStairs.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(sniperStairs));

    // Sniper nest ramp (smooth access)
    const sniperRamp = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 12), new THREE.MeshLambertMaterial({ color: concreteColor }));
    sniperRamp.rotation.z = 0.2; // Gentle ramp
    sniperRamp.position.set(33, 3.5, 30);
    sniperRamp.castShadow = true;
    sniperRamp.receiveShadow = true;
    scene.add(sniperRamp);
    objects.push(sniperRamp);
    sniperRamp.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(sniperRamp));

    // ===== UNDERPASS (Lower mid route) =====
    // Underpass corridor connecting bottom mid
    const underpassFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(35, 30),
        new THREE.MeshLambertMaterial({ color: 0x9a8f7e })
    );
    underpassFloor.rotation.x = -Math.PI / 2;
    underpassFloor.position.set(-5, 0.05, -15);
    underpassFloor.receiveShadow = true;
    scene.add(underpassFloor);

    // Underpass walls
    const underpassWallTop = new THREE.Mesh(new THREE.BoxGeometry(35, 6, 2), new THREE.MeshLambertMaterial({ color: wallColor }));
    underpassWallTop.position.set(-5, 3, 0);
    underpassWallTop.castShadow = true;
    underpassWallTop.receiveShadow = true;
    scene.add(underpassWallTop);
    objects.push(underpassWallTop);
    underpassWallTop.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(underpassWallTop));

    const underpassWallBottom = new THREE.Mesh(new THREE.BoxGeometry(35, 6, 2), new THREE.MeshLambertMaterial({ color: wallColor }));
    underpassWallBottom.position.set(-5, 3, -30);
    underpassWallBottom.castShadow = true;
    underpassWallBottom.receiveShadow = true;
    scene.add(underpassWallBottom);
    objects.push(underpassWallBottom);
    underpassWallBottom.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(underpassWallBottom));

    // ===== CONNECTOR (Mid to A-Site link) =====
    // Connector hallway narrow passage
    const connectorFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 25),
        new THREE.MeshLambertMaterial({ color: 0xa89070 })
    );
    connectorFloor.rotation.x = -Math.PI / 2;
    connectorFloor.position.set(-35, 0.05, -5);
    connectorFloor.receiveShadow = true;
    scene.add(connectorFloor);

    // Connector walls (narrow passage)
    const connectorWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 7, 25), new THREE.MeshLambertMaterial({ color: wallColor }));
    connectorWallLeft.position.set(-41, 3.5, -5);
    connectorWallLeft.castShadow = true;
    connectorWallLeft.receiveShadow = true;
    scene.add(connectorWallLeft);
    objects.push(connectorWallLeft);
    connectorWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(connectorWallLeft));

    const connectorWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 7, 25), new THREE.MeshLambertMaterial({ color: wallColor }));
    connectorWallRight.position.set(-29, 3.5, -5);
    connectorWallRight.castShadow = true;
    connectorWallRight.receiveShadow = true;
    scene.add(connectorWallRight);
    objects.push(connectorWallRight);
    connectorWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(connectorWallRight));

    // ===== A SITE AREA =====
    // A-Site marker
    const aSiteMarker = new THREE.Mesh(
        new THREE.BoxGeometry(4, 6, 4),
        new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
    aSiteMarker.position.set(-50, 3, -15);
    aSiteMarker.castShadow = true;
    aSiteMarker.receiveShadow = true;
    scene.add(aSiteMarker);

    // A-Site main platform
    const aSitePlatform = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 35),
        new THREE.MeshLambertMaterial({ color: platformColor })
    );
    aSitePlatform.rotation.x = -Math.PI / 2;
    aSitePlatform.position.set(-50, 0.05, -20);
    aSitePlatform.receiveShadow = true;
    scene.add(aSitePlatform);

    // A-Ramp (main T entry - tight choke)
    const aRampEntrance = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 20),
        new THREE.MeshLambertMaterial({ color: 0xa89070 })
    );
    aRampEntrance.rotation.x = -Math.PI / 2;
    aRampEntrance.position.set(-65, 0.05, -15);
    aRampEntrance.receiveShadow = true;
    scene.add(aRampEntrance);

    // A-Ramp walls (narrow corridor)
    const aRampWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 20), new THREE.MeshLambertMaterial({ color: wallColor }));
    aRampWallLeft.position.set(-71, 4, -15);
    aRampWallLeft.castShadow = true;
    aRampWallLeft.receiveShadow = true;
    scene.add(aRampWallLeft);
    objects.push(aRampWallLeft);
    aRampWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(aRampWallLeft));

    const aRampWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 20), new THREE.MeshLambertMaterial({ color: wallColor }));
    aRampWallRight.position.set(-59, 4, -15);
    aRampWallRight.castShadow = true;
    aRampWallRight.receiveShadow = true;
    scene.add(aRampWallRight);
    objects.push(aRampWallRight);
    aRampWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(aRampWallRight));

    // Palace (alternate elevated T entry to A)
    const palacePlatform = new THREE.Mesh(
        new THREE.BoxGeometry(20, 1, 15),
        new THREE.MeshLambertMaterial({ color: concreteColor })
    );
    palacePlatform.position.set(-45, 5, 5);
    palacePlatform.castShadow = true;
    palacePlatform.receiveShadow = true;
    scene.add(palacePlatform);
    objects.push(palacePlatform);
    palacePlatform.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(palacePlatform));

    // Palace stairs
    const palaceStairs = new THREE.Mesh(new THREE.BoxGeometry(18, 5, 12), new THREE.MeshLambertMaterial({ color: concreteColor }));
    palaceStairs.position.set(-48, 2.5, 10);
    palaceStairs.castShadow = true;
    palaceStairs.receiveShadow = true;
    scene.add(palaceStairs);
    objects.push(palaceStairs);
    palaceStairs.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(palaceStairs));

    // Ramp stairs connection (smoother than step stairs)
    const palaceRamp = new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 15), new THREE.MeshLambertMaterial({ color: concreteColor }));
    palaceRamp.rotation.z = 0.15; // Slight ramp angle
    palaceRamp.position.set(-48, 3.5, 5);
    palaceRamp.castShadow = true;
    palaceRamp.receiveShadow = true;
    scene.add(palaceRamp);
    objects.push(palaceRamp);
    palaceRamp.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(palaceRamp));

    // A-Site crates: Tetris, Firebox, Default plant
    const aSiteCrates = [
        { pos: [-45, 0.5, -30], name: 'Tetris' },
        { pos: [-55, 0.5, -10], name: 'Firebox' },
        { pos: [-50, 0.5, -35], name: 'Default' }
    ];
    aSiteCrates.forEach(crate => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshLambertMaterial({ color: woodColor }));
        box.position.set(...crate.pos);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        objects.push(box);
        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    });

    // Jungle (CT defensive position near A site)
    const jungleCover = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 12), new THREE.MeshLambertMaterial({ color: concreteColor }));
    jungleCover.position.set(-20, 0.5, -25);
    jungleCover.castShadow = true;
    jungleCover.receiveShadow = true;
    scene.add(jungleCover);
    objects.push(jungleCover);
    jungleCover.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(jungleCover));

    // Stairs (CT defensive elevated position)
    const aSiteStairs = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 10), new THREE.MeshLambertMaterial({ color: concreteColor }));
    aSiteStairs.position.set(-25, 4, 5);
    aSiteStairs.castShadow = true;
    aSiteStairs.receiveShadow = true;
    scene.add(aSiteStairs);
    objects.push(aSiteStairs);
    aSiteStairs.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(aSiteStairs));

    // ===== CATWALK / SHORT (Mid to B-Site link) =====
    const catwalkPlatform = new THREE.Mesh(
        new THREE.BoxGeometry(35, 1.5, 12),
        new THREE.MeshLambertMaterial({ color: metalColor })
    );
    catwalkPlatform.position.set(25, 6, -5);
    catwalkPlatform.castShadow = true;
    catwalkPlatform.receiveShadow = true;
    scene.add(catwalkPlatform);
    objects.push(catwalkPlatform);
    catwalkPlatform.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(catwalkPlatform));

    // Catwalk support pillars
    for (let i = -1; i <= 1; i++) {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), new THREE.MeshLambertMaterial({ color: metalColor }));
        pillar.position.set(10 + i * 15, 3, -5);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.add(pillar);
        objects.push(pillar);
        pillar.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(pillar));
    }

    // ===== B SITE AREA =====
    // B-Site marker
    const bSiteMarker = new THREE.Mesh(
        new THREE.BoxGeometry(4, 6, 4),
        new THREE.MeshLambertMaterial({ color: 0x00ff00 })
    );
    bSiteMarker.position.set(50, 3, -50);
    bSiteMarker.castShadow = true;
    bSiteMarker.receiveShadow = true;
    scene.add(bSiteMarker);

    // B-Site main platform
    const bSitePlatform = new THREE.Mesh(
        new THREE.PlaneGeometry(45, 40),
        new THREE.MeshLambertMaterial({ color: platformColor })
    );
    bSitePlatform.rotation.x = -Math.PI / 2;
    bSitePlatform.position.set(50, 0.05, -45);
    bSitePlatform.receiveShadow = true;
    scene.add(bSitePlatform);

    // B-Apartments (narrow T entry - tight choke)
    const bApartmentsFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 20),
        new THREE.MeshLambertMaterial({ color: 0xa89070 })
    );
    bApartmentsFloor.rotation.x = -Math.PI / 2;
    bApartmentsFloor.position.set(65, 0.05, -45);
    bApartmentsFloor.receiveShadow = true;
    scene.add(bApartmentsFloor);

    // B-Apartments walls (narrow corridor)
    const bApartWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 20), new THREE.MeshLambertMaterial({ color: wallColor }));
    bApartWallLeft.position.set(70, 4, -45);
    bApartWallLeft.castShadow = true;
    bApartWallLeft.receiveShadow = true;
    scene.add(bApartWallLeft);
    objects.push(bApartWallLeft);
    bApartWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bApartWallLeft));

    const bApartWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 20), new THREE.MeshLambertMaterial({ color: wallColor }));
    bApartWallRight.position.set(60, 4, -45);
    bApartWallRight.castShadow = true;
    bApartWallRight.receiveShadow = true;
    scene.add(bApartWallRight);
    objects.push(bApartWallRight);
    bApartWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bApartWallRight));

    // Van/Car at Apps exit
    const van = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 8), new THREE.MeshLambertMaterial({ color: 0x440000 }));
    van.position.set(45, 1.5, -60);
    van.castShadow = true;
    van.receiveShadow = true;
    scene.add(van);
    objects.push(van);
    van.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(van));

    // B-Site crates: Back Site, Default plant, B-Main
    const bSiteCrates = [
        { pos: [55, 0.5, -60], name: 'Back Site' },
        { pos: [45, 0.5, -40], name: 'Default' },
        { pos: [65, 0.5, -30], name: 'B-Main' }
    ];
    bSiteCrates.forEach(crate => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshLambertMaterial({ color: woodColor }));
        box.position.set(...crate.pos);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        objects.push(box);
        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    });

    // Market/Kitchen area (connection between sites)
    const marketFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 25),
        new THREE.MeshLambertMaterial({ color: 0xa89070 })
    );
    marketFloor.rotation.x = -Math.PI / 2;
    marketFloor.position.set(15, 0.05, -30);
    marketFloor.receiveShadow = true;
    scene.add(marketFloor);

    // Market stalls for cover
    const marketStalls = [
        [5, 0.5, -30], [15, 0.5, -20], [25, 0.5, -35]
    ];
    marketStalls.forEach(pos => {
        const stall = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshLambertMaterial({ color: woodColor }));
        stall.position.set(...pos);
        stall.castShadow = true;
        stall.receiveShadow = true;
        scene.add(stall);
        objects.push(stall);
        stall.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(stall));
    });

    // Ticket Booth (CT defensive position at A rotation)
    const ticketBooth = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 8), new THREE.MeshLambertMaterial({ color: concreteColor }));
    ticketBooth.position.set(-10, 0.5, 10);
    ticketBooth.castShadow = true;
    ticketBooth.receiveShadow = true;
    scene.add(ticketBooth);
    objects.push(ticketBooth);
    ticketBooth.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(ticketBooth));

    // Kitchen window (CT defensive position)
    const kitchenWindow = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 6), new THREE.MeshLambertMaterial({ color: concreteColor }));
    kitchenWindow.position.set(20, 4, 15);
    kitchenWindow.castShadow = true;
    kitchenWindow.receiveShadow = true;
    scene.add(kitchenWindow);
    objects.push(kitchenWindow);
    kitchenWindow.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(kitchenWindow));

    // ===== BORDER WALLS (Perimeter) =====
    // North wall
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(300, 12, 2), new THREE.MeshLambertMaterial({ color: 0x6b5d4f }));
    northWall.position.set(0, 6, 149);
    northWall.castShadow = true;
    northWall.receiveShadow = true;
    scene.add(northWall);
    objects.push(northWall);
    northWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(northWall));

    // South wall
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(300, 12, 2), new THREE.MeshLambertMaterial({ color: 0x6b5d4f }));
    southWall.position.set(0, 6, -149);
    southWall.castShadow = true;
    southWall.receiveShadow = true;
    scene.add(southWall);
    objects.push(southWall);
    southWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(southWall));

    // East wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 300), new THREE.MeshLambertMaterial({ color: 0x6b5d4f }));
    eastWall.position.set(149, 6, 0);
    eastWall.castShadow = true;
    eastWall.receiveShadow = true;
    scene.add(eastWall);
    objects.push(eastWall);
    eastWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(eastWall));

    // West wall
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 300), new THREE.MeshLambertMaterial({ color: 0x6b5d4f }));
    westWall.position.set(-149, 6, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    scene.add(westWall);
    objects.push(westWall);
    westWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(westWall));

    const shootableObjects = [ground, ...objects];

    return { ground, objects, shootableObjects, boundingBoxes };
}
