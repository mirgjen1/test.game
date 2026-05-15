import * as THREE from 'three';

export class Bot {
    constructor(scene, position, team, boundingBoxes) {
        this.scene = scene;
        this.team = team; // 'T' or 'CT'
        this.boundingBoxes = boundingBoxes || [];
        this.isAlive = true;
        this.health = 100;

        // Create bot visual representation
        const teamColor = team === 'T' ? 0x8b4513 : 0x1e90ff; // Brown for T, Blue for CT
        const botGeo = new THREE.BoxGeometry(0.6, 1.6, 0.6);
        const botMat = new THREE.MeshLambertMaterial({ color: teamColor });
        this.mesh = new THREE.Mesh(botGeo, botMat);
        
        this.mesh.position.copy(position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Add bot to scene
        this.scene.add(this.mesh);

        // Physics
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 8.0;
        this.canJump = false;
        this.gravity = 24.5;
        this.friction = 8.0;

        // AI waypoints for patrol
        this.waypoints = this.getWaypoints(team);
        this.currentWaypointIndex = 0;
        this.targetWaypoint = this.waypoints[0];

        // Bot bounding box for collision
        this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
    }

    getWaypoints(team) {
        if (team === 'T') {
            // T-Side patrol: T Spawn -> Outside -> Top Mid -> A-Ramp or Market
            return [
                new THREE.Vector3(-80, 0, -80),   // T Spawn
                new THREE.Vector3(-60, 0, -70),   // Outside
                new THREE.Vector3(-10, 0, 30),    // Top Mid
                new THREE.Vector3(-50, 0, -20),   // A Site
                new THREE.Vector3(50, 0, -45),    // B Site
            ];
        } else {
            // CT-Side patrol: CT Spawn -> Market -> Mid -> A Rotation
            return [
                new THREE.Vector3(80, 0, 80),     // CT Spawn
                new THREE.Vector3(15, 0, -30),    // Market/Kitchen
                new THREE.Vector3(0, 0, 0),       // Mid
                new THREE.Vector3(-35, 0, 10),    // Connector to A
                new THREE.Vector3(-20, 0, -25),   // Jungle (A site defense)
            ];
        }
    }

    update(delta, shootableObjects) {
        if (!this.isAlive) return;

        // Apply gravity
        this.velocity.y -= this.gravity * delta;

        // Move towards current waypoint
        const dirToWaypoint = new THREE.Vector3().subVectors(this.targetWaypoint, this.mesh.position);
        dirToWaypoint.y = 0; // Ignore Y for pathfinding
        const distToWaypoint = dirToWaypoint.length();

        // If reached waypoint, move to next
        if (distToWaypoint < 3.0) {
            this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.waypoints.length;
            this.targetWaypoint = this.waypoints[this.currentWaypointIndex];
        }

        // Calculate movement direction
        if (distToWaypoint > 0.1) {
            dirToWaypoint.normalize();
            this.direction.copy(dirToWaypoint);
        }

        // Apply friction
        this.velocity.x -= this.velocity.x * this.friction * delta;
        this.velocity.z -= this.velocity.z * this.friction * delta;

        if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
        if (Math.abs(this.velocity.z) < 0.1) this.velocity.z = 0;

        // Accelerate towards target
        const targetSpeed = this.speed;
        const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
        
        if (currentSpeed < targetSpeed) {
            const accel = 30.0 * delta;
            this.velocity.x += this.direction.x * accel;
            this.velocity.z += this.direction.z * accel;
        }

        // Store old position for collision rollback
        const oldX = this.mesh.position.x;
        const oldZ = this.mesh.position.z;

        // Apply movement
        this.mesh.position.x += this.velocity.x * delta;
        this.mesh.position.z += this.velocity.z * delta;
        this.mesh.position.y += this.velocity.y * delta;

        // Collision detection
        const size = 0.3;
        const botBox = new THREE.Box3();
        let hasCollision = false;

        // Check collision with boundaries and obstacles
        if (this.mesh.position.x < -145 || this.mesh.position.x > 145 ||
            this.mesh.position.z < -145 || this.mesh.position.z > 145) {
            hasCollision = true;
        }

        // Check collision with world geometry
        if (!hasCollision) {
            botBox.min.set(this.mesh.position.x - size, this.mesh.position.y, this.mesh.position.z - size);
            botBox.max.set(this.mesh.position.x + size, this.mesh.position.y + 1.6, this.mesh.position.z + size);
            
            for (const box of this.boundingBoxes) {
                if (botBox.intersectsBox(box)) {
                    hasCollision = true;
                    break;
                }
            }
        }

        if (hasCollision) {
            this.mesh.position.x = oldX;
            this.mesh.position.z = oldZ;
            this.velocity.x = 0;
            this.velocity.z = 0;
        }

        // Ground collision
        if (this.mesh.position.y < 0) {
            this.velocity.y = 0;
            this.mesh.position.y = 0;
            this.canJump = true;

            // Random jump occasionally for more natural movement
            if (Math.random() < 0.02) {
                this.velocity.y = 8.0;
                this.canJump = false;
            }
        }

        // Update bounding box for external collision checks
        this.boundingBox.setFromObject(this.mesh);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.isAlive = false;
        this.mesh.material.color.set(0x404040); // Gray out dead bot
        // Could add death animation here
    }

    remove() {
        this.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

export class BotManager {
    constructor(scene, boundingBoxes) {
        this.scene = scene;
        this.boundingBoxes = boundingBoxes;
        this.bots = [];
    }

    spawnBots(count = 5) {
        // Spawn T-side bots
        for (let i = 0; i < Math.floor(count / 2); i++) {
            const spawnPos = new THREE.Vector3(
                -80 + (Math.random() - 0.5) * 20,
                0,
                -80 + (Math.random() - 0.5) * 20
            );
            this.bots.push(new Bot(this.scene, spawnPos, 'T', this.boundingBoxes));
        }

        // Spawn CT-side bots
        for (let i = 0; i < Math.ceil(count / 2); i++) {
            const spawnPos = new THREE.Vector3(
                80 + (Math.random() - 0.5) * 20,
                0,
                80 + (Math.random() - 0.5) * 20
            );
            this.bots.push(new Bot(this.scene, spawnPos, 'CT', this.boundingBoxes));
        }
    }

    update(delta, shootableObjects) {
        for (let i = this.bots.length - 1; i >= 0; i--) {
            const bot = this.bots[i];
            if (!bot.isAlive) {
                bot.remove();
                this.bots.splice(i, 1);
            } else {
                bot.update(delta, shootableObjects);
            }
        }
    }

    getBotBoundingBoxes() {
        return this.bots.map(bot => bot.boundingBox);
    }
}
