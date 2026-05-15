import * as THREE from 'three';

export function createWorld(scene) {
    // Daytime Lighting - Desert Golden Hour
    const ambientLight = new THREE.AmbientLight(0xfdbf69, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfde4a8, 2.2);
    dirLight.position.set(80, 100, 60);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 150;
    dirLight.shadow.camera.bottom = -150;
    dirLight.shadow.camera.left = -150;
    dirLight.shadow.camera.right = 150;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffd89b, 0x8b7e6a, 0.5);
    scene.add(hemiLight);

    // Ground Plane - Large desert floor
    const groundGeometry = new THREE.PlaneGeometry(350, 350);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xd9a76a });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    const objects = [];
    const boundingBoxes = [];

    // Material colors for authenticity
    const wallColor = 0xa08060;
    const brickColor = 0x9d7f56;
    const concreteColor = 0x8b8680;
    const woodColor = 0x6b4423;
    const platformColor = 0xd4a574;
    const metalColor = 0x5a5a5a;
    const sandColor = 0xd9a76a;
    const darkWallColor = 0x7a6b56;

    // ===== T SPAWN - Underground (Lower elevation) =====
    const tSpawnMarker = new THREE.Mesh(
        new THREE.BoxGeometry(5, 4, 5),
        new THREE.MeshLambertMaterial({ color: 0x0066ff })
    );
    tSpawnMarker.position.set(-100, -1.5, -95);
    tSpawnMarker.castShadow = true;
    tSpawnMarker.receiveShadow = true;
    scene.add(tSpawnMarker);

    // T Spawn room - concrete bunker
    const tSpawnFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(35, 30),
        new THREE.MeshLambertMaterial({ color: 0x7a7a7a })
    );
    tSpawnFloor.rotation.x = -Math.PI / 2;
    tSpawnFloor.position.set(-100, -1.5, -95);
    tSpawnFloor.receiveShadow = true;
    scene.add(tSpawnFloor);

    // T Spawn walls (concrete bunker)
    const tSpawnWallFront = new THREE.Mesh(new THREE.BoxGeometry(35, 6, 2), new THREE.MeshLambertMaterial({ color: concreteColor }));
    tSpawnWallFront.position.set(-100, 1.5, -80);
    tSpawnWallFront.castShadow = true;
    tSpawnWallFront.receiveShadow = true;
    scene.add(tSpawnWallFront);
    objects.push(tSpawnWallFront);
    tSpawnWallFront.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(tSpawnWallFront));

    const tSpawnWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 30), new THREE.MeshLambertMaterial({ color: concreteColor }));
    tSpawnWallLeft.position.set(-117.5, 1.5, -95);
    tSpawnWallLeft.castShadow = true;
    tSpawnWallLeft.receiveShadow = true;
    scene.add(tSpawnWallLeft);
    objects.push(tSpawnWallLeft);
    tSpawnWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(tSpawnWallLeft));

    const tSpawnWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 30), new THREE.MeshLambertMaterial({ color: concreteColor }));
    tSpawnWallRight.position.set(-82.5, 1.5, -95);
    tSpawnWallRight.castShadow = true;
    tSpawnWallRight.receiveShadow = true;
    scene.add(tSpawnWallRight);
    objects.push(tSpawnWallRight);
    tSpawnWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(tSpawnWallRight));

    // T Spawn exit ramp (leading upward to Outside/Yard)
    const tSpawnRamp = new THREE.Mesh(new THREE.BoxGeometry(20, 0.5, 18), new THREE.MeshLambertMaterial({ color: 0xa89070 }));
    tSpawnRamp.rotation.z = -0.25;
    tSpawnRamp.position.set(-90, 1.5, -68);
    tSpawnRamp.castShadow = true;
    tSpawnRamp.receiveShadow = true;
    scene.add(tSpawnRamp);
    objects.push(tSpawnRamp);
    tSpawnRamp.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(tSpawnRamp));

    // ===== OUTSIDE/YARD (T-side open area leading to Upper Tunnels and Main Mid) =====
    const outsideFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 40),
        new THREE.MeshLambertMaterial({ color: sandColor })
    );
    outsideFloor.rotation.x = -Math.PI / 2;
    outsideFloor.position.set(-80, 0, -55);
    outsideFloor.receiveShadow = true;
    scene.add(outsideFloor);

    // Outside/Yard walls
    const outsideWallBack = new THREE.Mesh(new THREE.BoxGeometry(50, 8, 2), new THREE.MeshLambertMaterial({ color: brickColor }));
    outsideWallBack.position.set(-80, 4, -75);
    outsideWallBack.castShadow = true;
    outsideWallBack.receiveShadow = true;
    scene.add(outsideWallBack);
    objects.push(outsideWallBack);
    outsideWallBack.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(outsideWallBack));

    const outsideWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 40), new THREE.MeshLambertMaterial({ color: brickColor }));
    outsideWallRight.position.set(-55, 4, -55);
    outsideWallRight.castShadow = true;
    outsideWallRight.receiveShadow = true;
    scene.add(outsideWallRight);
    objects.push(outsideWallRight);
    outsideWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(outsideWallRight));

    // Boxes/crates in Outside area for cover
    const outsideBoxes = [[-95, 0.5, -45], [-65, 0.5, -55], [-70, 0.5, -65]];
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

    // ===== CT SPAWN - Underground (Directly beneath A-Site) =====
    const ctSpawnMarker = new THREE.Mesh(
        new THREE.BoxGeometry(5, 4, 5),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    ctSpawnMarker.position.set(-50, -2, -5);
    ctSpawnMarker.castShadow = true;
    ctSpawnMarker.receiveShadow = true;
    scene.add(ctSpawnMarker);

    // CT Spawn room - concrete bunker
    const ctSpawnFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 25),
        new THREE.MeshLambertMaterial({ color: 0x7a7a7a })
    );
    ctSpawnFloor.rotation.x = -Math.PI / 2;
    ctSpawnFloor.position.set(-50, -2, -5);
    ctSpawnFloor.receiveShadow = true;
    scene.add(ctSpawnFloor);

    // CT Spawn walls
    const ctSpawnWallFront = new THREE.Mesh(new THREE.BoxGeometry(30, 5, 2), new THREE.MeshLambertMaterial({ color: concreteColor }));
    ctSpawnWallFront.position.set(-50, 0.5, 8);
    ctSpawnWallFront.castShadow = true;
    ctSpawnWallFront.receiveShadow = true;
    scene.add(ctSpawnWallFront);
    objects.push(ctSpawnWallFront);
    ctSpawnWallFront.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(ctSpawnWallFront));

    const ctSpawnWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 25), new THREE.MeshLambertMaterial({ color: concreteColor }));
    ctSpawnWallLeft.position.set(-65, 0.5, -5);
    ctSpawnWallLeft.castShadow = true;
    ctSpawnWallLeft.receiveShadow = true;
    scene.add(ctSpawnWallLeft);
    objects.push(ctSpawnWallLeft);
    ctSpawnWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(ctSpawnWallLeft));

    const ctSpawnWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 25), new THREE.MeshLambertMaterial({ color: concreteColor }));
    ctSpawnWallRight.position.set(-35, 0.5, -5);
    ctSpawnWallRight.castShadow = true;
    ctSpawnWallRight.receiveShadow = true;
    scene.add(ctSpawnWallRight);
    objects.push(ctSpawnWallRight);
    ctSpawnWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(ctSpawnWallRight));

    // ===== MID - Central Hub (Main choke point and sightline nexus) =====
    const midFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 50),
        new THREE.MeshLambertMaterial({ color: 0xb8936b })
    );
    midFloor.rotation.x = -Math.PI / 2;
    midFloor.position.set(-20, 0, 20);
    midFloor.receiveShadow = true;
    scene.add(midFloor);

    // Mid Doors (CT-side, double door chokepoint)
    const midDoorsWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 9, 15), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    midDoorsWallLeft.position.set(-45, 4.5, 18);
    midDoorsWallLeft.castShadow = true;
    midDoorsWallLeft.receiveShadow = true;
    scene.add(midDoorsWallLeft);
    objects.push(midDoorsWallLeft);
    midDoorsWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(midDoorsWallLeft));

    const midDoorsWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 9, 15), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    midDoorsWallRight.position.set(-35, 4.5, 18);
    midDoorsWallRight.castShadow = true;
    midDoorsWallRight.receiveShadow = true;
    scene.add(midDoorsWallRight);
    objects.push(midDoorsWallRight);
    midDoorsWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(midDoorsWallRight));

    const midDoorsTop = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 15), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    midDoorsTop.position.set(-40, 8.8, 18);
    midDoorsTop.castShadow = true;
    midDoorsTop.receiveShadow = true;
    scene.add(midDoorsTop);
    objects.push(midDoorsTop);
    midDoorsTop.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(midDoorsTop));

    // Xbox (central cube structure at Mid - jump spot to Catwalk)
    const xbox = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 8), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
    xbox.position.set(-10, 2.5, 10);
    xbox.castShadow = true;
    xbox.receiveShadow = true;
    scene.add(xbox);
    objects.push(xbox);
    xbox.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(xbox));

    // Upper Tunnels entrance (T-side, leading from Outside to Mid)
    const upperTunnelsFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 20),
        new THREE.MeshLambertMaterial({ color: 0x9a8f7e })
    );
    upperTunnelsFloor.rotation.x = -Math.PI / 2;
    upperTunnelsFloor.position.set(-85, 0.5, -20);
    upperTunnelsFloor.receiveShadow = true;
    scene.add(upperTunnelsFloor);

    // Upper Tunnels walls
    const upperTunnelsWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 20), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    upperTunnelsWallLeft.position.set(-97.5, 4, -20);
    upperTunnelsWallLeft.castShadow = true;
    upperTunnelsWallLeft.receiveShadow = true;
    scene.add(upperTunnelsWallLeft);
    objects.push(upperTunnelsWallLeft);
    upperTunnelsWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(upperTunnelsWallLeft));

    const upperTunnelsWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 20), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    upperTunnelsWallRight.position.set(-72.5, 4, -20);
    upperTunnelsWallRight.castShadow = true;
    upperTunnelsWallRight.receiveShadow = true;
    scene.add(upperTunnelsWallRight);
    objects.push(upperTunnelsWallRight);
    upperTunnelsWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(upperTunnelsWallRight));

    // Humvee/Car at Upper Tunnels entrance to B-Site
    const humvee = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 9), new THREE.MeshLambertMaterial({ color: 0x4a4a2a }));
    humvee.position.set(-95, 1.75, -35);
    humvee.castShadow = true;
    humvee.receiveShadow = true;
    scene.add(humvee);
    objects.push(humvee);
    humvee.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(humvee));

    // ===== A-SITE AREA (Bombsite A) =====
    const aSiteMarker = new THREE.Mesh(
        new THREE.BoxGeometry(5, 3, 5),
        new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
    aSiteMarker.position.set(-60, 3.5, -30);
    aSiteMarker.castShadow = true;
    aSiteMarker.receiveShadow = true;
    scene.add(aSiteMarker);

    // A-Site platform (elevated bombsite)
    const aSitePlatform = new THREE.Mesh(
        new THREE.PlaneGeometry(45, 40),
        new THREE.MeshLambertMaterial({ color: platformColor })
    );
    aSitePlatform.rotation.x = -Math.PI / 2;
    aSitePlatform.position.set(-60, 3.5, -30);
    aSitePlatform.receiveShadow = true;
    scene.add(aSitePlatform);

    // Long A - Wide open approach to A-Site
    const longAFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 50),
        new THREE.MeshLambertMaterial({ color: sandColor })
    );
    longAFloor.rotation.x = -Math.PI / 2;
    longAFloor.position.set(-80, 0, -40);
    longAFloor.receiveShadow = true;
    scene.add(longAFloor);

    // Long Doors (T-side chokepoint entry to Long A)
    const longDoorsWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 9, 12), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    longDoorsWallLeft.position.set(-92, 4.5, -60);
    longDoorsWallLeft.castShadow = true;
    longDoorsWallLeft.receiveShadow = true;
    scene.add(longDoorsWallLeft);
    objects.push(longDoorsWallLeft);
    longDoorsWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(longDoorsWallLeft));

    const longDoorsWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 9, 12), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    longDoorsWallRight.position.set(-82, 4.5, -60);
    longDoorsWallRight.castShadow = true;
    longDoorsWallRight.receiveShadow = true;
    scene.add(longDoorsWallRight);
    objects.push(longDoorsWallRight);
    longDoorsWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(longDoorsWallRight));

    const longDoorsTop = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 12), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    longDoorsTop.position.set(-87, 8.8, -60);
    longDoorsTop.castShadow = true;
    longDoorsTop.receiveShadow = true;
    scene.add(longDoorsTop);
    objects.push(longDoorsTop);
    longDoorsTop.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(longDoorsTop));

    // Blue Box (cover in Long A)
    const blueBox = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 5), new THREE.MeshLambertMaterial({ color: 0x3366cc }));
    blueBox.position.set(-95, 1.5, -35);
    blueBox.castShadow = true;
    blueBox.receiveShadow = true;
    scene.add(blueBox);
    objects.push(blueBox);
    blueBox.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(blueBox));

    // Pit (lower elevation at far end of Long A)
    const pitFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 15),
        new THREE.MeshLambertMaterial({ color: 0xa0804a })
    );
    pitFloor.rotation.x = -Math.PI / 2;
    pitFloor.position.set(-90, -2, -55);
    pitFloor.receiveShadow = true;
    scene.add(pitFloor);

    // Pit walls
    const pitWallFront = new THREE.Mesh(new THREE.BoxGeometry(20, 3, 2), new THREE.MeshLambertMaterial({ color: brickColor }));
    pitWallFront.position.set(-90, -0.5, -48);
    pitWallFront.castShadow = true;
    pitWallFront.receiveShadow = true;
    scene.add(pitWallFront);
    objects.push(pitWallFront);
    pitWallFront.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(pitWallFront));

    // A-Ramp (main T entry - incline from Long to A-Platform)
    const aRampFloor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 22), new THREE.MeshLambertMaterial({ color: 0xa89070 }));
    aRampFloor.rotation.z = -0.3;
    aRampFloor.position.set(-70, 1.8, -25);
    aRampFloor.castShadow = true;
    aRampFloor.receiveShadow = true;
    scene.add(aRampFloor);
    objects.push(aRampFloor);
    aRampFloor.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(aRampFloor));

    // A-Ramp side walls
    const aRampWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 22), new THREE.MeshLambertMaterial({ color: wallColor }));
    aRampWallLeft.position.set(-77, 1.5, -25);
    aRampWallLeft.castShadow = true;
    aRampWallLeft.receiveShadow = true;
    scene.add(aRampWallLeft);
    objects.push(aRampWallLeft);
    aRampWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(aRampWallLeft));

    const aRampWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 22), new THREE.MeshLambertMaterial({ color: wallColor }));
    aRampWallRight.position.set(-63, 1.5, -25);
    aRampWallRight.castShadow = true;
    aRampWallRight.receiveShadow = true;
    scene.add(aRampWallRight);
    objects.push(aRampWallRight);
    aRampWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(aRampWallRight));

    // A-Site crates/cover (Tetris, Firebox, Default plant area)
    const aSiteCrates = [
        { pos: [-55, 3.5, -22], name: 'Tetris' },
        { pos: [-68, 3.5, -38], name: 'Firebox' },
        { pos: [-60, 3.5, -42], name: 'Default' }
    ];
    aSiteCrates.forEach(crate => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 5), new THREE.MeshLambertMaterial({ color: woodColor }));
        box.position.set(...crate.pos);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        objects.push(box);
        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    });

    // Goose (corner recess at back of A-Platform)
    const gooseCover = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 6), new THREE.MeshLambertMaterial({ color: concreteColor }));
    gooseCover.position.set(-35, 3.5, -50);
    gooseCover.castShadow = true;
    gooseCover.receiveShadow = true;
    scene.add(gooseCover);
    objects.push(gooseCover);
    gooseCover.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(gooseCover));

    // ===== CATWALK / SHORT A (Elevated mid-tier pathway T to A rotation) =====
    const catwalkPlatform = new THREE.Mesh(
        new THREE.BoxGeometry(50, 1.5, 10),
        new THREE.MeshLambertMaterial({ color: metalColor })
    );
    catwalkPlatform.position.set(-30, 5.5, 5);
    catwalkPlatform.castShadow = true;
    catwalkPlatform.receiveShadow = true;
    scene.add(catwalkPlatform);
    objects.push(catwalkPlatform);
    catwalkPlatform.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(catwalkPlatform));

    // Catwalk support pillars
    for (let i = -2; i <= 1; i++) {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(2, 5.5, 2), new THREE.MeshLambertMaterial({ color: metalColor }));
        pillar.position.set(-50 + i * 25, 2.75, 5);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.add(pillar);
        objects.push(pillar);
        pillar.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(pillar));
    }

    // Catwalk outer wall
    const catwalkWallOuter = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 2), new THREE.MeshLambertMaterial({ color: wallColor }));
    catwalkWallOuter.position.set(-30, 5.5, 10);
    catwalkWallOuter.castShadow = true;
    catwalkWallOuter.receiveShadow = true;
    scene.add(catwalkWallOuter);
    objects.push(catwalkWallOuter);
    catwalkWallOuter.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(catwalkWallOuter));

    // ===== B-SITE AREA (Bombsite B) =====
    const bSiteMarker = new THREE.Mesh(
        new THREE.BoxGeometry(5, 3, 5),
        new THREE.MeshLambertMaterial({ color: 0x00ff00 })
    );
    bSiteMarker.position.set(50, 3.5, -50);
    bSiteMarker.castShadow = true;
    bSiteMarker.receiveShadow = true;
    scene.add(bSiteMarker);

    // B-Site platform (elevated bombsite)
    const bSitePlatform = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 45),
        new THREE.MeshLambertMaterial({ color: platformColor })
    );
    bSitePlatform.rotation.x = -Math.PI / 2;
    bSitePlatform.position.set(50, 3.5, -50);
    bSitePlatform.receiveShadow = true;
    scene.add(bSitePlatform);

    // B-Site crates/cover (Back Site, Default plant, B-Main areas)
    const bSiteCrates = [
        { pos: [35, 3.5, -65], name: 'Back Site' },
        { pos: [50, 3.5, -42], name: 'Default' },
        { pos: [65, 3.5, -35], name: 'B-Main' }
    ];
    bSiteCrates.forEach(crate => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 5), new THREE.MeshLambertMaterial({ color: woodColor }));
        box.position.set(...crate.pos);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
        objects.push(box);
        box.updateMatrixWorld();
        boundingBoxes.push(new THREE.Box3().setFromObject(box));
    });

    // Lower Tunnels (connector from Upper Tunnels to B-Site, with stairs)
    const lowerTunnelsFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 30),
        new THREE.MeshLambertMaterial({ color: 0x8a7f6e })
    );
    lowerTunnelsFloor.rotation.x = -Math.PI / 2;
    lowerTunnelsFloor.position.set(-50, -0.5, -40);
    lowerTunnelsFloor.receiveShadow = true;
    scene.add(lowerTunnelsFloor);

    // Lower Tunnels walls
    const lowerTunnelsWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 7, 30), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    lowerTunnelsWallLeft.position.set(-61, 3, -40);
    lowerTunnelsWallLeft.castShadow = true;
    lowerTunnelsWallLeft.receiveShadow = true;
    scene.add(lowerTunnelsWallLeft);
    objects.push(lowerTunnelsWallLeft);
    lowerTunnelsWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(lowerTunnelsWallLeft));

    const lowerTunnelsWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 7, 30), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    lowerTunnelsWallRight.position.set(-39, 3, -40);
    lowerTunnelsWallRight.castShadow = true;
    lowerTunnelsWallRight.receiveShadow = true;
    scene.add(lowerTunnelsWallRight);
    objects.push(lowerTunnelsWallRight);
    lowerTunnelsWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(lowerTunnelsWallRight));

    // Stairs from Lower Tunnels/Mid to B-Site entrance
    const tunnelStairs = new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 20), new THREE.MeshLambertMaterial({ color: 0xa89070 }));
    tunnelStairs.rotation.z = 0.25;
    tunnelStairs.position.set(-5, 2.2, -35);
    tunnelStairs.castShadow = true;
    tunnelStairs.receiveShadow = true;
    scene.add(tunnelStairs);
    objects.push(tunnelStairs);
    tunnelStairs.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(tunnelStairs));

    // B-Doors (CT-side exit from B-Site to Mid courtyard)
    const bDoorsWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 9, 14), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    bDoorsWallLeft.position.set(35, 4.5, -20);
    bDoorsWallLeft.castShadow = true;
    bDoorsWallLeft.receiveShadow = true;
    scene.add(bDoorsWallLeft);
    objects.push(bDoorsWallLeft);
    bDoorsWallLeft.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bDoorsWallLeft));

    const bDoorsWallRight = new THREE.Mesh(new THREE.BoxGeometry(2, 9, 14), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    bDoorsWallRight.position.set(45, 4.5, -20);
    bDoorsWallRight.castShadow = true;
    bDoorsWallRight.receiveShadow = true;
    scene.add(bDoorsWallRight);
    objects.push(bDoorsWallRight);
    bDoorsWallRight.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bDoorsWallRight));

    const bDoorsTop = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 14), new THREE.MeshLambertMaterial({ color: darkWallColor }));
    bDoorsTop.position.set(40, 8.8, -20);
    bDoorsTop.castShadow = true;
    bDoorsTop.receiveShadow = true;
    scene.add(bDoorsTop);
    objects.push(bDoorsTop);
    bDoorsTop.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bDoorsTop));

    // B-Window (hole opening from B-Site to exterior)
    const bWindowHole = new THREE.Mesh(new THREE.BoxGeometry(10, 7, 2), new THREE.MeshLambertMaterial({ color: 0x3a3a3a }));
    bWindowHole.position.set(75, 4, -60);
    bWindowHole.castShadow = true;
    bWindowHole.receiveShadow = true;
    scene.add(bWindowHole);
    objects.push(bWindowHole);
    bWindowHole.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(bWindowHole));

    // Mid courtyard (central connecting area)
    const courtyard = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 40),
        new THREE.MeshLambertMaterial({ color: 0xb8936b })
    );
    courtyard.rotation.x = -Math.PI / 2;
    courtyard.position.set(20, 0, -10);
    courtyard.receiveShadow = true;
    scene.add(courtyard);

    // ===== PERIMETER WALLS =====
    // North wall
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(350, 12, 2), new THREE.MeshLambertMaterial({ color: 0x6b5d4f }));
    northWall.position.set(0, 6, 149);
    northWall.castShadow = true;
    northWall.receiveShadow = true;
    scene.add(northWall);
    objects.push(northWall);
    northWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(northWall));

    // South wall
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(350, 12, 2), new THREE.MeshLambertMaterial({ color: 0x6b5d4f }));
    southWall.position.set(0, 6, -149);
    southWall.castShadow = true;
    southWall.receiveShadow = true;
    scene.add(southWall);
    objects.push(southWall);
    southWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(southWall));

    // East wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 350), new THREE.MeshLambertMaterial({ color: 0x6b5d4f }));
    eastWall.position.set(174, 6, 0);
    eastWall.castShadow = true;
    eastWall.receiveShadow = true;
    scene.add(eastWall);
    objects.push(eastWall);
    eastWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(eastWall));

    // West wall
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 350), new THREE.MeshLambertMaterial({ color: 0x6b5d4f }));
    westWall.position.set(-174, 6, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    scene.add(westWall);
    objects.push(westWall);
    westWall.updateMatrixWorld();
    boundingBoxes.push(new THREE.Box3().setFromObject(westWall));

    const shootableObjects = [ground, ...objects];

    return { ground, objects, shootableObjects, boundingBoxes };
}
