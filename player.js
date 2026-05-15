import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
    constructor(scene, camera, domElement, shootableObjects, boundingBoxes) {
        this.scene = scene;
        this.camera = camera;
        this.shootableObjects = shootableObjects || [];
        this.boundingBoxes = boundingBoxes || [];
        
        // --- Player Hitbox / Physical Representation ---
        this.playerGroup = new THREE.Group();
        this.playerGroup.position.set(0, 0, 0); // Start at origin
        this.scene.add(this.playerGroup);

        // Attach camera to player's "head" height
        this.standHeight = 1.6;
        this.crouchHeight = 0.8;
        // The camera should stay at x=0, z=0 relative to the playerGroup
        this.camera.position.set(0, this.standHeight, 0);
        this.playerGroup.add(this.camera);

        // --- Controls Setup ---
        this.controls = new PointerLockControls(this.camera, domElement);
        
        // --- Viewmodel (AK-47 Placeholder) Setup ---
        this.createViewmodel();

        // --- Movement State ---
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.isWalking = false; // Shift to walk
        this.isCrouching = false; // Ctrl/C to crouch
        
        // --- Physics State ---
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.canJump = false;
        
        // Tuned for better game feel
        this.gravity = 9.8 * 2.5; // Reduced gravity for smoother arc
        // Reduced jump force to compensate for lower gravity, maintaining peak height but giving more hang time
        this.jumpForce = 8.0; 
        
        // --- Quake/Source Physics Parameters ---
        this.friction = 5.0; // Ground friction
        this.stopSpeed = 1.0; // Speed below which we stop completely
        this.maxSpeed = 15.0; // Maximum ground speed (increased for faster movement)
        this.accelerate = 40.0; // Ground acceleration (increased for responsiveness)
        this.airAccelerate = 2.0; // Air acceleration (allows strafing)
        this.airMaxSpeed = 20.0; // Maximum air speed
        this.airSpeedCap = 20.0; // Soft cap for air speed

        // --- Shooting & Weapon State ---
        this.raycaster = new THREE.Raycaster();
        this.lastFireTime = 0;
        this.fireRate = 100; // ms between shots
        this.rapidFirePenalty = 0;
        this.tracers = []; // Track active bullet tracers
        this.isShooting = false; // Track full auto state
        this.recoilPitch = 0;
        this.recoilYaw = 0;
        this.sprayIndex = 0;

        // --- Ammo State ---
        this.ammo = 30;
        this.maxAmmo = 30;
        this.isReloading = false;

        // --- Ammo Counter UI ---
        this.ammoCounterElement = document.getElementById('ammo-counter');
        this.updateAmmoCounter();

        this.setupEventListeners();
    }

    createViewmodel() {
        this.gunMesh = new THREE.Group();

        // Materials
        const metalMat = new THREE.MeshPhongMaterial({ color: 0x222222 }); // Dark grey metal
        const woodMat = new THREE.MeshPhongMaterial({ color: 0x5c3a21 }); // Brown wood

        // Receiver (Main Body)
        const receiverGeo = new THREE.BoxGeometry(0.1, 0.15, 0.4);
        const receiver = new THREE.Mesh(receiverGeo, metalMat);
        this.gunMesh.add(receiver);

        // Barrel
        const barrelGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8);
        const barrel = new THREE.Mesh(barrelGeo, metalMat);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set(0, 0.03, -0.45);
        this.gunMesh.add(barrel);

        // Gas tube (above barrel)
        const gasTubeGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8);
        const gasTube = new THREE.Mesh(gasTubeGeo, metalMat);
        gasTube.rotation.x = Math.PI / 2;
        gasTube.position.set(0, 0.06, -0.3);
        this.gunMesh.add(gasTube);

        // Wooden Handguard
        const handguardGeo = new THREE.BoxGeometry(0.06, 0.08, 0.25);
        const handguard = new THREE.Mesh(handguardGeo, woodMat);
        handguard.position.set(0, 0.03, -0.3);
        this.gunMesh.add(handguard);

        // Magazine (curved/angled)
        const magGeo = new THREE.BoxGeometry(0.05, 0.25, 0.12);
        const mag = new THREE.Mesh(magGeo, metalMat);
        mag.rotation.x = -0.2; // Angle forward slightly
        mag.position.set(0, -0.15, -0.1);
        this.gunMesh.add(mag);

        // Grip
        const gripGeo = new THREE.BoxGeometry(0.05, 0.15, 0.08);
        const grip = new THREE.Mesh(gripGeo, woodMat);
        grip.rotation.x = 0.2; // Angle back slightly
        grip.position.set(0, -0.1, 0.15);
        this.gunMesh.add(grip);

        // Stock
        const stockGeo = new THREE.BoxGeometry(0.06, 0.12, 0.3);
        const stock = new THREE.Mesh(stockGeo, woodMat);
        stock.position.set(0, -0.02, 0.35);
        this.gunMesh.add(stock);

        // Muzzle placeholder (for tracer spawn point)
        this.muzzlePoint = new THREE.Object3D();
        this.muzzlePoint.position.set(0, 0.03, -0.7); // Tip of the barrel
        this.gunMesh.add(this.muzzlePoint);

        // Muzzle Flash Light
        this.muzzleFlash = new THREE.PointLight(0xffddaa, 0, 10);
        this.muzzleFlash.position.set(0, 0.03, -0.75); // Slightly in front of barrel tip
        this.gunMesh.add(this.muzzleFlash);

        // Save rest positions for animations
        this.gunRestPos = new THREE.Vector3(0.3, -0.3, -0.5);
        
        // Position the entire gun group in the camera view
        this.gunMesh.position.copy(this.gunRestPos);
        this.camera.add(this.gunMesh);
    }

    setupEventListeners() {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
                case 'Space':
                    if (this.canJump === true) {
                        this.velocity.y += this.jumpForce;
                        this.canJump = false;
                    }
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.isWalking = true;
                    break;
                case 'ControlLeft':
                case 'ControlRight':
                case 'KeyC':
                    this.isCrouching = true;
                    break;
                case 'KeyR':
                    this.reload();
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.isWalking = false;
                    break;
                case 'ControlLeft':
                case 'ControlRight':
                case 'KeyC':
                    this.isCrouching = false;
                    break;
            }
        };

        const onMouseDown = (event) => {
            if (this.controls.isLocked && event.button === 0) {
                this.isShooting = true;
            }
        };

        const onMouseUp = (event) => {
            if (event.button === 0) {
                this.isShooting = false;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
    }

    updateAmmoCounter() {
        if (this.ammoCounterElement) {
            if (this.isReloading) {
                this.ammoCounterElement.innerText = "RELOADING...";
            } else {
                this.ammoCounterElement.innerText = `${this.ammo} / ${this.maxAmmo}`;
            }
        }
    }

    // --- Quake/Source Physics Helper Functions ---

    // Calculate wish direction based on WASD inputs and camera yaw
    getWishDirection() {
        const wishDir = new THREE.Vector3(0, 0, 0);
        
        // Get camera yaw (rotation around Y axis)
        const yaw = this.camera.rotation.y;
        
        // Calculate forward and right vectors in world space
        const forward = new THREE.Vector3(
            -Math.sin(yaw),
            0,
            -Math.cos(yaw)
        ).normalize();
        
        const right = new THREE.Vector3(
            Math.cos(yaw),
            0,
            -Math.sin(yaw)
        ).normalize();
        
        // Build wish direction from WASD inputs
        if (this.moveForward) wishDir.add(forward);
        if (this.moveBackward) wishDir.sub(forward);
        if (this.moveRight) wishDir.add(right);
        if (this.moveLeft) wishDir.sub(right);
        
        // Only normalize if we have input (avoid normalizing zero vector)
        if (wishDir.length() > 0) {
            return wishDir.normalize();
        }
        return wishDir;
    }

    // The famous Quake Accelerate function
    // Applies acceleration to velocity in the direction of wishDir
    accelerate(wishDir, wishSpeed, accel, delta) {
        // Project current velocity onto wish direction
        const currentSpeed = this.velocity.dot(wishDir);
        const addSpeed = wishSpeed - currentSpeed;
        
        // If we're already at or above wish speed, don't accelerate
        if (addSpeed <= 0) return;
        
        // Calculate how much we can accelerate this frame
        let accelSpeed = accel * wishSpeed * delta;
        
        // Cap at the amount needed to reach wish speed
        if (accelSpeed > addSpeed) accelSpeed = addSpeed;
        
        // Apply acceleration
        this.velocity.add(wishDir.clone().multiplyScalar(accelSpeed));
    }

    // Apply friction to slow down the player
    applyFriction(delta) {
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
        
        if (speed < 0.1) {
            this.velocity.x = 0;
            this.velocity.z = 0;
            return;
        }
        
        const drop = speed * this.friction * delta;
        const newSpeed = Math.max(speed - drop, 0);
        
        if (newSpeed < speed) {
            const scale = newSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.z *= scale;
        }
    }

    reload() {
        if (this.isReloading || this.ammo === this.maxAmmo) return;
        this.isReloading = true;
        this.isShooting = false; // Interrupt shooting
        
        console.log("Reloading...");
        this.updateAmmoCounter();
        
        // Wait 2 seconds for reload to complete
        setTimeout(() => {
            this.ammo = this.maxAmmo;
            this.isReloading = false;
            console.log("Reload complete! Ammo: 30/30");
            this.updateAmmoCounter();
        }, 2000);
    }

    shoot() {
        if (this.isReloading) return;
        
        if (this.ammo <= 0) {
            this.isShooting = false;
            this.reload(); // Auto-reload on empty
            return;
        }

        const time = performance.now();
        if (time - this.lastFireTime < this.fireRate) return;

        // Consume ammo
        this.ammo--;
        this.updateAmmoCounter();

        // --- Spray Pattern Tracking ---
        // If you stop shooting for 400ms, your recoil resets.
        if (time - this.lastFireTime > 400) {
            this.sprayIndex = 0;
        }
        
        this.sprayIndex = Math.min((this.sprayIndex || 0) + 1, 30);
        this.lastFireTime = time;

        // Trigger muzzle flash
        this.muzzleFlash.intensity = 5;

        // --- AK-47 Recoil Pattern Approximation ---
        let patternX = 0;
        let patternY = 0;
        const i = this.sprayIndex;

        // Vertical Kick (Climbs quickly for 9 shots, then plateaus)
        if (i <= 9) {
            patternY = i * 0.015; 
        } else {
            patternY = 9 * 0.015 + (i - 9) * 0.002;
        }

        // Horizontal Sweep (Right, then Left, then Right)
        if (i < 8) {
            patternX = (Math.random() - 0.5) * 0.005; // mostly straight
        } else if (i < 15) {
            patternX = (i - 8) * 0.015; // sweeps right
        } else if (i < 24) {
            patternX = 7 * 0.015 - (i - 15) * 0.02; // sweeps left
        } else {
            patternX = 7 * 0.015 - 9 * 0.02 + (i - 24) * 0.02; // sweeps right
        }

        // --- Balance View Punch vs Aim Punch ---
        // 25% of the recoil physically kicks the camera (View Punch)
        // 75% of the recoil makes the bullets shoot away from the crosshair (Aim Punch)
        const viewPunchFactor = 0.25;
        const aimPunchFactor = 0.75;

        // Apply View Punch
        const pitchDelta = (patternY * viewPunchFactor) - (this.recoilPitch || 0);
        const yawDelta = (patternX * viewPunchFactor) - (this.recoilYaw || 0);
        
        this.recoilPitch = patternY * viewPunchFactor;
        this.recoilYaw = patternX * viewPunchFactor;

        // In ThreeJS YXZ order: positive X pitches up, negative Y yaws right
        this.camera.rotation.x += pitchDelta; 
        this.camera.rotation.y -= yawDelta;

        // --- Random Spread (Inaccuracy / Bloom) ---
        let inaccuracy = 0.01; // Base inaccuracy
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
        
        // Movement penalty (massive spread if running)
        if (speed > 0.5) {
            inaccuracy += speed * 0.015; 
        }
        
        // Stance modifier
        if (this.isCrouching && speed < 0.5) {
            inaccuracy *= 0.3; // Very accurate when crouching
        } else if (!this.canJump) {
            inaccuracy *= 6.0; // Terribly inaccurate in the air
        }

        // Bloom penalty (random spread increases the longer you hold down the trigger)
        // REDUCED drastically to make horizontal spray sweeps controllable lasers!
        inaccuracy += (i * 0.001); 

        // Apply Aim Punch (bullets hit offset from the crosshair) + Random Spread
        const finalSpreadX = (patternX * aimPunchFactor) + (Math.random() - 0.5) * inaccuracy;
        const finalSpreadY = (patternY * aimPunchFactor) + (Math.random() - 0.5) * inaccuracy;

        // Setup raycaster using the NDC offset
        this.raycaster.setFromCamera(new THREE.Vector2(finalSpreadX, finalSpreadY), this.camera);

        const intersects = this.raycaster.intersectObjects(this.shootableObjects);

        let hitPoint;
        if (intersects.length > 0) {
            const hit = intersects[0];
            hitPoint = hit.point;
            
            // Transform the local face normal to world space so decals apply correctly to rotated objects
            const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
            const worldNormal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
            
            this.createBulletDecal(hit.point, worldNormal);
        } else {
            // If missed, pick a point far away along the ray to draw the tracer towards
            hitPoint = this.raycaster.ray.origin.clone().add(this.raycaster.ray.direction.clone().multiplyScalar(100));
        }

        // Get world position of the muzzle to start the tracer
        const muzzleWorldPos = new THREE.Vector3();
        this.muzzlePoint.getWorldPosition(muzzleWorldPos);
        this.createTracer(muzzleWorldPos, hitPoint);

        // Visual recoil kick on the weapon (purely visual, doesn't affect aim)
        // Kick it back and twist it slightly for more aggressive feel
        this.gunMesh.position.z += 0.15; 
        this.gunMesh.rotation.x += 0.2; // Group faces -Z, so positive X is pitch UP
        this.gunMesh.rotation.z += (Math.random() - 0.5) * 0.1;
    }

    createBulletDecal(point, normal) {
        // Create a simple dark square for the bullet hole
        const decalGeometry = new THREE.PlaneGeometry(0.15, 0.15);
        const decalMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x111111,
            polygonOffset: true,
            polygonOffsetFactor: -4, // Pull it towards the camera slightly to avoid Z-fighting
            polygonOffsetUnits: -4,
            transparent: true,
            opacity: 0.8
        });
        const decal = new THREE.Mesh(decalGeometry, decalMaterial);
        
        decal.position.copy(point);
        
        // Orient the decal to face away from the surface normal
        const lookTarget = point.clone().add(normal);
        decal.lookAt(lookTarget);
        
        this.scene.add(decal);
    }

    createTracer(start, end) {
        const distance = start.distanceTo(end);
        if (distance < 1.0) return; // Don't draw tracer if target is literally right in our face
        
        const tracerLength = Math.min(distance, 3.0); // Max length of 3 units
        
        const geometry = new THREE.CylinderGeometry(0.015, 0.015, tracerLength, 4);
        // Rotate so the cylinder aligns along the Z axis (default is Y)
        geometry.rotateX(Math.PI / 2);
        
        const material = new THREE.MeshBasicMaterial({
            color: 0xffddaa, // Bright yellowish white
            transparent: true,
            opacity: 0.8
        });
        
        const tracer = new THREE.Mesh(geometry, material);
        
        tracer.position.copy(start);
        tracer.lookAt(end);
        
        this.scene.add(tracer);
        
        this.tracers.push({
            mesh: tracer,
            start: start.clone(),
            end: end.clone(),
            direction: new THREE.Vector3().subVectors(end, start).normalize(),
            distanceTraveled: 0,
            totalDistance: distance,
            speed: 250.0 // Very fast (units per second)
        });
    }

    update(delta) {
        if (this.controls.isLocked === true) {
            // Smooth crouch camera height transition
            const targetHeight = this.isCrouching ? this.crouchHeight : this.standHeight;
            this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetHeight, delta * 15.0);

            // Apply friction/drag to horizontal movement
            this.velocity.x -= this.velocity.x * this.friction * delta;
            this.velocity.z -= this.velocity.z * this.friction * delta;

            // Snap completely to 0 if moving very slowly
            if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
            if (Math.abs(this.velocity.z) < 0.1) this.velocity.z = 0;

            // Apply gravity to vertical movement
            this.velocity.y -= this.gravity * delta;

            // Calculate movement direction based on inputs
            this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
            this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
            if (this.direction.length() > 0) {
                this.direction.normalize();
            }

            let baseAcceleration = this.accelerate;
            if (this.isCrouching) {
                baseAcceleration *= 0.5;
            } else if (this.isWalking) {
                baseAcceleration *= 0.6;
            }

            // --- CS:GO Counter-Strafing Logic ---
            let accelX = baseAcceleration;
            if (this.velocity.x * this.direction.x > 0) {
                accelX *= 4.5;
            }
            
            let accelZ = baseAcceleration;
            if (this.velocity.z * this.direction.z > 0) {
                accelZ *= 4.5;
            }

            if (this.moveForward || this.moveBackward) {
                const prevVz = this.velocity.z;
                this.velocity.z -= this.direction.z * accelZ * delta;
                if (prevVz * this.direction.z > 0 && this.velocity.z * this.direction.z <= 0) {
                    this.velocity.z = 0;
                }
            }
            
            if (this.moveLeft || this.moveRight) {
                const prevVx = this.velocity.x;
                this.velocity.x -= this.direction.x * accelX * delta;
                if (prevVx * this.direction.x > 0 && this.velocity.x * this.direction.x <= 0) {
                    this.velocity.x = 0;
                }
            }

            // Save camera position before move
            const prevX = this.camera.position.x;
            const prevZ = this.camera.position.z;

            // Move the controls (which moves the camera in its local space)
            this.controls.moveRight(-this.velocity.x * delta);
            this.controls.moveForward(-this.velocity.z * delta);

            // Extract the translation delta applied by PointerLockControls
            let dx = this.camera.position.x - prevX;
            let dz = this.camera.position.z - prevZ;

            // Player AABB dimensions for collision detection
            const size = 0.4;
            const playerBox = new THREE.Box3();
            const mapBounds = 95;
            
            // X Collision
            const nextX = this.playerGroup.position.x + dx;
            
            if (nextX < -mapBounds || nextX > mapBounds) {
                dx = 0;
                this.velocity.x = 0;
            } else {
                playerBox.min.set(nextX - size, this.playerGroup.position.y, this.playerGroup.position.z - size);
                playerBox.max.set(nextX + size, this.playerGroup.position.y + this.standHeight, this.playerGroup.position.z + size);
                
                let hitX = false;
                for (const box of this.boundingBoxes) {
                    if (playerBox.intersectsBox(box)) {
                        hitX = true; break;
                    }
                }
                if (hitX) {
                    dx = 0;
                    this.velocity.x = 0;
                }
            }

            // Z Collision
            const nextZ = this.playerGroup.position.z + dz;
            
            if (nextZ < -mapBounds || nextZ > mapBounds) {
                dz = 0;
                this.velocity.z = 0;
            } else {
                playerBox.min.set(this.playerGroup.position.x - size, this.playerGroup.position.y, nextZ - size);
                playerBox.max.set(this.playerGroup.position.x + size, this.playerGroup.position.y + this.standHeight, nextZ + size);
                
                let hitZ = false;
                for (const box of this.boundingBoxes) {
                    if (playerBox.intersectsBox(box)) {
                        hitZ = true; break;
                    }
                }
                if (hitZ) {
                    dz = 0;
                    this.velocity.z = 0;
                }
            }

            // Apply the actual movement to the playerGroup instead
            this.playerGroup.position.x += dx;
            this.playerGroup.position.z += dz;

            // Reset camera to stay perfectly centered on the playerGroup (X and Z)
            this.camera.position.x = 0;
            this.camera.position.z = 0;

            // Handle vertical position manually on the group
            this.playerGroup.position.y += (this.velocity.y * delta);

            // Basic floor collision
            if (this.playerGroup.position.y < 0) {
                this.velocity.y = 0;
                this.playerGroup.position.y = 0;
                this.canJump = true;
            }
            
            // Handle full auto firing
            if (this.isShooting) {
                this.shoot();
            }
        }
        
        // --- Recoil Recovery (View Punch Decay) ---
        if (!this.isShooting && (this.recoilPitch > 0 || this.recoilYaw !== 0)) {
            const decay = delta * 5.0; // recovery speed
            const oldPitch = this.recoilPitch;
            const oldYaw = this.recoilYaw;
            
            this.recoilPitch = THREE.MathUtils.lerp(this.recoilPitch, 0, decay);
            this.recoilYaw = THREE.MathUtils.lerp(this.recoilYaw, 0, decay);
            
            // Snap to 0 if very close
            if (this.recoilPitch < 0.001) this.recoilPitch = 0;
            if (Math.abs(this.recoilYaw) < 0.001) this.recoilYaw = 0;

            const pitchDecay = oldPitch - this.recoilPitch;
            const yawDecay = oldYaw - this.recoilYaw;

            // Apply recovery to camera (pull it back down to where it started)
            this.camera.rotation.x -= pitchDecay; 
            this.camera.rotation.y += yawDecay; 
        }

        // Fade muzzle flash
        if (this.muzzleFlash && this.muzzleFlash.intensity > 0) {
            this.muzzleFlash.intensity -= delta * 50;
            if (this.muzzleFlash.intensity < 0) this.muzzleFlash.intensity = 0;
        }

        // Decay rapid fire penalty slowly over time
        if (this.rapidFirePenalty > 0 && performance.now() - this.lastFireTime > 200) {
            this.rapidFirePenalty -= delta * 0.1;
            if (this.rapidFirePenalty < 0) this.rapidFirePenalty = 0;
        }

        // Update active tracers
        for (let i = this.tracers.length - 1; i >= 0; i--) {
            const tracer = this.tracers[i];
            tracer.distanceTraveled += tracer.speed * delta;
            
            if (tracer.distanceTraveled >= tracer.totalDistance) {
                // Remove tracer when it hits the end
                this.scene.remove(tracer.mesh);
                tracer.mesh.geometry.dispose();
                tracer.mesh.material.dispose();
                this.tracers.splice(i, 1);
            } else {
                // Move tracer along path
                tracer.mesh.position.copy(tracer.start).add(tracer.direction.clone().multiplyScalar(tracer.distanceTraveled));
            }
        }
        
        // View bobbing and recoil recovery effect
        this.updateViewmodelBob(delta);
    }

    updateViewmodelBob(delta) {
        if (!this.controls.isLocked) return;
        
        const time = performance.now() * 0.01;
        const isMoving = this.moveForward || this.moveBackward || this.moveLeft || this.moveRight;
        
        // Target rest positions
        let targetY = this.gunRestPos.y;
        let targetX = this.gunRestPos.x;
        let targetRotZ = 0;

        if (this.isReloading) {
            // Reload animation: dip gun down and right
            targetY -= 0.4;
            targetX += 0.2;
            targetRotZ = Math.PI / 4; // Twist sideways
        } else if (isMoving && this.canJump) { // Only bob if on ground and moving
            let bobSpeed = 1.5;
            let bobAmount = 0.02;

            if (this.isCrouching) {
                bobSpeed = 0.6;
                bobAmount = 0.005;
            } else if (this.isWalking) {
                bobSpeed = 0.8;
                bobAmount = 0.01;
            }
            
            targetY += Math.sin(time * bobSpeed) * bobAmount;
            targetX += Math.cos(time * bobSpeed * 0.5) * bobAmount;
        } 
        
        // Smoothly move towards target (handles bobbing, returning to rest, and reload dipping)
        this.gunMesh.position.y = THREE.MathUtils.lerp(this.gunMesh.position.y, targetY, delta * 8);
        this.gunMesh.position.x = THREE.MathUtils.lerp(this.gunMesh.position.x, targetX, delta * 8);
        this.gunMesh.rotation.z = THREE.MathUtils.lerp(this.gunMesh.rotation.z, targetRotZ, delta * 8);
        
        // Recoil visual recovery
        this.gunMesh.position.z = THREE.MathUtils.lerp(this.gunMesh.position.z, this.gunRestPos.z, delta * 15);
        this.gunMesh.rotation.x = THREE.MathUtils.lerp(this.gunMesh.rotation.x, 0, delta * 15);
    }
}
