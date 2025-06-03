class Enemy {
    constructor(strength, speed, nodes, maxHealth, type) {
        this.strength = Math.round(strength);
        this.speed = speed;
        this.nodes = nodes;
        this.x = nodes[0].x;
        this.y = nodes[0].y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.size = 30;
        this.targetNode = 0;
        this.finished = false;
        this.maxHealth = Math.round(maxHealth);
        this.strength = this.maxHealth;
        this.gameSpeed = gameSpeed;
        this.type = type;
        this.isExploding = false;
        this.explosionDuration = 500; 
        this.isSpawned = false; 
        this.spawnTime = 0; 
        this.spawnEffectDuration = 500; 
        this.spawnScale = 1.0; 
        this.isSlowed = false;
        this.slowEndTime = 0;
        this.slowFactor = 1;
        this.isStunned = false;
        this.stunEndTime = 0;
        this.healedAt = 0;  

        switch (type) {
            case 'heavy':
                this.frontFrames = heavyFrontFrames;
                this.rightFrames = heavyRightFrames;
                this.backFrames = heavyBackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 48; 
                break;
            case 'fast':
                this.frontFrames = fastFrontFrames;
                this.rightFrames = fastRightFrames;
                this.backFrames = fastBackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 36;
                break;
            case 'stealth':
                this.frontFrames = stealthFrontFrames;
                this.rightFrames = stealthRightFrames;
                this.backFrames = stealthBackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 30;
                this.speed *= 1.4;  
                this.isStealth = false;
                this.lastStealthToggle = millis();
                this.stealthDuration = 2000;
                this.stealthInterval = 3000;
                break;
            case 'healer':
                this.frontFrames = healerFrontFrames;
                this.rightFrames = healerRightFrames;
                this.backFrames = healerBackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.healingRadius = 200;
                this.healCooldown = 2000;
                this.lastHealTime = millis();
                this.showHealingRadius = false;
                this.healingRadiusEndTime = 0;
                this.healingRings = [];
                this.lastRingTime = 0;
                this.ringInterval = 500; 
                this.speed *= 0.8; 
                break;
            case 'robo1':
                this.frontFrames = robo1FrontFrames;
                this.rightFrames = robo1RightFrames;
                this.backFrames = robo1BackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 45;
                break;
            case 'robo2':
                this.frontFrames = robo2FrontFrames;
                this.rightFrames = robo2RightFrames;
                this.backFrames = robo2BackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 45; 
                break;
            case 'robo3':
                this.frontFrames = robo3FrontFrames;
                this.rightFrames = robo3RightFrames;
                this.backFrames = robo3BackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 45;
                break;            case 'boss':
                this.frontFrames = bossFrontFrames;
                this.rightFrames = bossRightFrames;
                this.backFrames = bossBackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 64;
                this.maxHealth *= 3; 
                this.strength = this.maxHealth;
                this.speed *= 0.5;
                this.canSpawnMinions = false;
                break;
            case 'ship':
                this.frames = shipFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.size = 80; 
                this.maxHealth *= 4; 
                this.strength = this.maxHealth;
                this.speed *= 0.4;
                this.hasDirectionalFrames = false; 
                this.canSpawnMinions = true;
                this.spawnThresholds = [0.8, 0.4]; 
                this.spawnedAtThreshold = [false, false]; 
                this.isSpawningMinions = false;
                this.lastSpawnTime = 0;
                this.needsToResumeMovement = false; 
                const waveMultiplier = Math.floor(waveNumber / 5);
                this.minionsPerSpawn = Math.min(4, 3 + waveMultiplier); 
                
                this.spawnCooldown = isEasyMode ? 2000 : isHardMode ? 1000 : 1500;
                this.minionTypes = waveNumber <= 5 ? ['robo1', 'robo2', 'robo3'] : 
                                   waveNumber <= 15 ? ['robo1', 'robo2', 'robo3', 'heavy', 'fast'] : 
                                   ['robo1', 'robo2', 'robo3', 'heavy', 'fast', 'stealth', 'bomb'];
                break;            
            case 'miniboss1':
                this.frontFrames = miniboss1FrontFrames;
                this.rightFrames = miniboss1RightFrames;
                this.backFrames = miniboss1BackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 58;
                this.maxHealth *= 1.8;
                this.strength = this.maxHealth;
                this.speed *= 0.8;
                this.canSpawnMinions = false; 
                break;
            case 'miniboss2':
                this.frontFrames = miniboss2FrontFrames;
                this.rightFrames = miniboss2RightFrames;
                this.backFrames = miniboss2BackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 58;
                this.maxHealth *= 1.7;
                this.strength = this.maxHealth;
                this.speed *= 0.8;
                this.canSpawnMinions = false; 
                break;
            case 'miniboss3':
                this.frontFrames = miniboss3FrontFrames;
                this.rightFrames = miniboss3RightFrames;
                this.backFrames = miniboss3BackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 58;
                this.maxHealth *= 1.7;
                this.strength = this.maxHealth;
                this.speed *= 0.8;
                this.canSpawnMinions = false; 
                break;
            case 'bomb':
                this.frames = bombFrames;
                this.explosionFrames = explosionFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.size = 48; 
                break;
            case 'boss':
                this.frontFrames = bossFrontFrames;
                this.rightFrames = bossRightFrames;
                this.backFrames = bossBackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 64;
                this.maxHealth *= 2.4; 
                this.strength = this.maxHealth;
                this.speed *= 0.6;
                this.canSpawnMinions = false;
                break;
            default:
                console.error(`Unknown enemy type: ${type}`);

                
        }

    }

    drawHealingArea() {
        if (this.showHealingRadius && millis() - this.lastRingTime > this.ringInterval) {
            this.healingRings.push({
                radius: 0,
                alpha: 255
            });
            this.lastRingTime = millis();
        }

        for (let i = this.healingRings.length - 1; i >= 0; i--) {
            let ring = this.healingRings[i];
            
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = color(0, 255, 128);
            
            noFill();
            stroke(0, 255, 128, ring.alpha);
            strokeWeight(2);
            ellipse(this.x, this.y, ring.radius * 2);
            
            drawingContext.shadowBlur = 0;
            
            ring.radius += 2;
            ring.alpha -= 5;
            
            if (ring.alpha <= 0) {
                this.healingRings.splice(i, 1);
            }
        }

        
        fill(0, 255, 128, 30);
        noStroke();
        ellipse(this.x, this.y, this.healingRadius * 2);
    }
    drawHealthBar() {
        fill(255, 0, 0);
        rect(this.x - 25, this.y - 35, 50, 10);
    
        fill(4, 128, 49);
        const healthWidth = (this.strength / this.maxHealth) * 50;
        rect(this.x - 25, this.y - 35, healthWidth, 10);
    
        fill('white');
        textAlign(CENTER, CENTER);
        textSize(12);
        textStyle(BOLD);
        text(Math.floor(this.strength), this.x, this.y - 31);
    }
    draw() {
        strokeWeight(2);
        
        if (this.isExploding) {
            if (millis() - this.explosionStartTime < this.explosionDuration) {
                image(explosionImage, this.x - this.size*4, this.y - this.size*3, this.size * 8, this.size * 8);
            } else {
                const index = enemies.indexOf(this);
                if (index > -1) enemies.splice(index, 1);
            }
            return;
        }        push();
        if (this.isStealth) {
            tint(128, 128, 128);
        } else if (this.isSlowed) {
            tint(89, 192, 225);
        } else if (activeHealthReduction && activeHealthReduction.active && activeHealthReduction.affectedEnemies.has(this)) {
            // rred tint for health reduction effect
            tint(255, 100, 100);
        } else if (this.type === 'ship' && this.isSpawningMinions) {
            // ship spawning minions effect
            tint(255, 150, 0, 200 + sin(millis() / 100) * 55);
        } else if (this.isSpawned && millis() - this.spawnTime < this.spawnEffectDuration) {
            
            const progress = (millis() - this.spawnTime) / this.spawnEffectDuration;
            tint(255, 200, 0, 255 * (1 - progress * 0.5));
            
            this.spawnScale = 0.1 + progress * 0.9;        }        if (this.type === 'robo1' || this.type === 'robo2' || this.type === 'robo3' || 
            this.type === 'heavy' || this.type === 'fast' || this.type === 'stealth' ||
            this.type === 'healer' || this.type === 'boss' ||
            this.type === 'miniboss1' || this.type === 'miniboss2' || this.type === 'miniboss3') {
            
            if (abs(this.xSpeed) > abs(this.ySpeed)) {
                this.currentFrameSet = this.xSpeed > 0 ? this.rightFrames : this.rightFrames;
            } else {
                this.currentFrameSet = this.ySpeed < 0 ? this.backFrames : this.frontFrames;
            }
        
            if (this.animationTimer % 12 === 0) {
                if (!this.currentFrameSet || !this.currentFrameSet.length) {
                    console.error(`No animation frames for enemy type: ${this.type}`);
                    this.currentFrameSet = [this.img];
                } else {
                    this.animationIndex = (this.animationIndex + 1) % this.currentFrameSet.length;
                }
            }
            this.animationTimer++;            
            let floatOffset = sin(millis() / 250) * 3;
            let roboImg = this.currentFrameSet[this.animationIndex];
            
            
            if (this.isSpawned && this.spawnScale < 1 && millis() - this.spawnTime < this.spawnEffectDuration) {
                const scaledSize = this.size * 2 * this.spawnScale;
                image(roboImg, 
                      this.x - scaledSize/2, 
                      this.y - scaledSize/2 + floatOffset, 
                      scaledSize, 
                      scaledSize);
            } else {
                image(roboImg, this.x - this.size, this.y - this.size + floatOffset, this.size*2, this.size*2);
            }
        }        else if (this.type === 'ship') {
            // Ship animation (no directional frames)
            if (this.animationTimer % 12 === 0) {
                if (!this.frames || !this.frames.length) {
                    console.error('No animation frames for ship');
                    pop();
                    return;
                }
                this.animationIndex = (this.animationIndex + 1) % this.frames.length;
            }
            this.animationTimer++;
            
            let floatOffset = sin(millis() / 250) * 3;
            let shipImg = this.frames[this.animationIndex];
            
            if (this.isSpawned && this.spawnScale < 1 && millis() - this.spawnTime < this.spawnEffectDuration) {
                const scaledSize = this.size * 2 * this.spawnScale;
                image(shipImg, 
                      this.x - scaledSize/2, 
                      this.y - scaledSize/2 + floatOffset, 
                      scaledSize, 
                      scaledSize);
            } else {
                image(shipImg, this.x - this.size, this.y - this.size + floatOffset, this.size*2, this.size*2);
            }
        }
        else if (this.type === 'bomb') {
            if (this.animationTimer % 10 === 0) {
                if (!this.frames || !this.frames.length) {
                    console.error('No animation frames for bomb enemy');
                    pop();
                    return;
                }
                this.animationIndex = (this.animationIndex + 1) % this.frames.length;
            }
            this.animationTimer++;            let floatOffset = sin(millis() / 250) * 3;
            let bombImg = this.frames[this.animationIndex];
            
            
            if (this.isSpawned && this.spawnScale < 1 && millis() - this.spawnTime < this.spawnEffectDuration) {
                const scaledSize = this.size * 2 * this.spawnScale;
                image(bombImg, 
                      this.x - scaledSize/2, 
                      this.y - scaledSize/2 + floatOffset, 
                      scaledSize, 
                      scaledSize);
            } else {
                image(bombImg, this.x - this.size, this.y - this.size + floatOffset, this.size*2, this.size*2);
            }
        }
        else if (this.img) {
            const adjustedX = this.x - this.size * (this.type === 'normal' || this.type === 'heavy' ? 0.75 : this.type === 'stealth' ? 0.8 : 1.15);
            const adjustedY = this.y - this.size * (this.type === 'stealth' ? 1.0 : 0.75);
            const width = this.size * (this.type === 'normal' || this.type === 'heavy' ? 1.5 : this.type === 'stealth' ? 1.5 : 3);
            const height = this.size * (this.type === 'stealth' ? 2.0 : 1.5);
            image(this.img, adjustedX, adjustedY, width, height);
        } else {
            console.error("Image not loaded for enemy type:", this.type);
        }
        pop();
    
        this.drawHealthBar();
    
        if (millis() - this.healedAt < 300) {
            push();
            tint(128, 255, 128, 150);
            image(healingImage, this.x - this.size, this.y - this.size, this.size*2, this.size*2);
            pop();
        }
    
        if (this.type === 'boss' && this.isSpawningMinions) {
            
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = color(255, 150, 0);
            
            noFill();
            stroke(255, 150, 0, 150 + sin(millis() / 100) * 50);
            strokeWeight(3);
            
            
            const pulseSize = this.size * (1.5 + sin(millis() / 150) * 0.2);
            ellipse(this.x, this.y, pulseSize * 2);
            
            drawingContext.shadowBlur = 0;
        }
    
        if (this.type === 'healer' && this.showHealingRadius) {
            this.drawHealingArea();
            if (millis() > this.healingRadiusEndTime) {
                this.showHealingRadius = false;
                this.healingRings = [];
            }
        }
    }
        move() {
        if (!this.isExploding) {
            
            if (this.type === 'boss' && this.isSpawningMinions) {
                return;
            }
            
            if (!this.isStunned) {
                let factor = this.isSlowed ? this.slowFactor : 1;
                let speedBonus = this.isStealth ? 1.2 : 1;
                
                
                if (isNaN(this.xSpeed) || isNaN(this.ySpeed)) {
                    console.warn(`Invalid movement speed: xSpeed=${this.xSpeed}, ySpeed=${this.ySpeed}`);
                    this.xSpeed = 0;
                    this.ySpeed = 0;
                    
                    setTimeout(() => this.findTarget(), 0);
                    return;
                }
                
                
                this.x += this.xSpeed * this.gameSpeed * factor * speedBonus;
                this.y += this.ySpeed * this.gameSpeed * factor * speedBonus;
            }
        }
    }    findTarget() {
        
        if (this.type === 'boss' && this.needsToResumeMovement) {
            
        } else if (this.xSpeed === 0 && this.ySpeed === 0) {
            
            const isStillSpawning = this.isSpawned && (millis() - this.spawnTime <= this.spawnEffectDuration);
            
            
            if (!isStillSpawning) {
                this.targetNode++;
            }
            
            
            if (this.targetNode >= this.nodes.length) {
                this.targetNode = this.nodes.length - 1; 
                return;
            }
            
            
            if (!this.nodes[this.targetNode]) {
                console.warn(`Target node is undefined at index ${this.targetNode}`);
                
                this.targetNode = Math.min(this.nodes.length - 1, Math.max(0, this.targetNode));
                if (!this.nodes[this.targetNode]) {
                    console.error("Could not find a valid node for enemy");
                    return;
                }
            }

            const target = this.nodes[this.targetNode];
            const xDifference = target.x - this.x;
            const yDifference = target.y - this.y;
            const angle = atan2(yDifference, xDifference);
            
            this.xSpeed = this.speed * cos(angle);
            this.ySpeed = this.speed * sin(angle);
            
            if (this.isSpawned && this.minionCount === 1) {
            }
        }
    }
      checkTarget() {
        if (this.targetNode < 0 || this.targetNode >= this.nodes.length) {
            console.warn(`Enemy has invalid targetNode: ${this.targetNode}. Reset to valid value.`);
            this.targetNode = Math.min(this.nodes.length - 1, Math.max(0, this.targetNode));
            return;
        }
        
        const target = this.nodes[this.targetNode];
        if (!target) {
            console.warn(`Target node is undefined at index ${this.targetNode}`);
            return;
        }
        
        const distance = dist(this.x, this.y, target.x, target.y);
        
        const threshold = this.isSpawned ? Math.min(this.speed * this.gameSpeed, 5) : this.speed * this.gameSpeed;
        
        if (distance < threshold) {
            
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.x = target.x; 
            this.y = target.y;

            
            if (this.targetNode === this.nodes.length - 1) {
                this.finished = true;
                health -= Math.round(this.strength);
                if (health <= 0) {
                    health = 0;
                    playing = false;
                }
                updateInfo();
            }
        }
    }
    

    distanceTraveled() {
        let distance = 0;
        let i = 1;
        while (i < this.nodes.length && i < this.targetNode) {
            let node1 = this.nodes[i - 1];
            let node2 = this.nodes[i];
            distance += dist(node1.x, node1.y, node2.x, node2.y);
            i += 1;
        }
        let lastNode = this.nodes[i - 1];
        distance += dist(this.x, this.y, lastNode.x, this.y);
        return distance;
    }

    updateGameSpeed(newGameSpeed) {
        this.gameSpeed = newGameSpeed;
    }

    explode() {
        const EXPLOSION_RADIUS = 185;
        if (this.type === 'bomb') { 
            this.isExploding = true;
            this.explosionStartTime = millis();
            turrets.forEach(turret => {
                const distance = dist(this.x, this.y, turret.x, turret.y);
                if (distance <= EXPLOSION_RADIUS) { 
                    turret.stun(2500 / this.gameSpeed); 
                }
            });
        } else {
            const index = enemies.indexOf(this);
            if (index > -1) enemies.splice(index, 1);
        }
    }

    isFullHealth() {
        return this.strength >= this.maxHealth;
    }    update() {
        if (this.isExploding) {
            this.draw();
            return;
        }
        
        if (this.strength <= 0 && !this.isExploding) {
            this.explode();
            return;
        }
        
        
        if (this.type === 'boss' && !this.isSpawningMinions) {
            if (!this.lastMoveCheck) {
                this.lastMoveCheck = millis();
                this.lastPosition = { x: this.x, y: this.y };
            } else if (millis() - this.lastMoveCheck > 2000) {
                
                const hasMoved = Math.abs(this.x - this.lastPosition.x) > 1 || 
                               Math.abs(this.y - this.lastPosition.y) > 1;
                
                
                if (!hasMoved && !this.isSpawningMinions) {
                    console.log("Boss appears stuck - forcing movement");
                    this.needsToResumeMovement = true;
                }
                
                
                this.lastMoveCheck = millis();
                this.lastPosition = { x: this.x, y: this.y };
            }
        }
    
        
        if (this.type === 'ship' && this.canSpawnMinions && !this.isExploding) {
            
            for (let i = 0; i < this.spawnThresholds.length; i++) {
                const healthRatio = this.strength / this.maxHealth;
                if (healthRatio <= this.spawnThresholds[i] && !this.spawnedAtThreshold[i]) {
                    this.isSpawningMinions = true;
                    this.spawnedAtThreshold[i] = true;
                    this.minionCount = 0;
                    
                    
                    this.savedTargetNode = this.targetNode;
                    
                    break;
                }
            }
            
            
            if (this.isSpawningMinions) {
                
                this.xSpeed = 0;
                this.ySpeed = 0;
                
                
                const adjustedCooldown = this.spawnCooldown / this.gameSpeed;
                if (millis() - this.lastSpawnTime >= adjustedCooldown) {
                    this.lastSpawnTime = millis();
                      
                    if (!this.nodes || this.nodes.length === 0) {
                        console.error("Boss has invalid nodes array, cannot spawn minions");
                        this.isSpawningMinions = false;
                        return;
                    }
                    
                    
                    const randomType = this.minionTypes[Math.floor(Math.random() * this.minionTypes.length)];
                    
                    
                    let minionHealth = this.maxHealth * 0.06; 
                    let minionSpeed = 2.5;
                    
                    
                    const minion = new Enemy(
                        minionHealth, 
                        minionSpeed, 
                        [...this.nodes], 
                        minionHealth,
                        randomType
                    );
                    
                    
                    if (!minion.nodes || minion.nodes.length === 0) {
                        console.error("Minion created with invalid nodes array");
                        return; 
                    }
                    
                    
                    let closestNodeIndex = 0;
                    let closestDistance = Infinity;
                    
                    for (let i = 0; i < this.nodes.length; i++) {
                        const nodeDistance = dist(this.x, this.y, this.nodes[i].x, this.nodes[i].y);
                        if (nodeDistance < closestDistance) {
                            closestDistance = nodeDistance;
                            closestNodeIndex = i;
                        }
                    }
                    
                    
                    minion.x = this.x;
                    minion.y = this.y;
                    
                    
                    minion.targetNode = Math.min(closestNodeIndex + 1, this.nodes.length - 1);
                    minion.xSpeed = 0;
                    minion.ySpeed = 0;
                    
                    
                    minion.isSpawned = true;
                    minion.spawnTime = millis();
                    minion.spawnEffectDuration = 500;
                    minion.spawnScale = 0.1;
                    
                    
                    const target = minion.nodes[minion.targetNode];
                    const xDifference = target.x - minion.x;
                    const yDifference = target.y - minion.y;
                    const angle = atan2(yDifference, xDifference);
                    minion.xSpeed = minion.speed * cos(angle);
                    minion.ySpeed = minion.speed * sin(angle);
                    
                    
                    enemies.push(minion);
                    
                    
                    this.minionCount++;
                      
                    if (this.minionCount >= this.minionsPerSpawn) {
                        this.isSpawningMinions = false;
                        
                        
                        
                        
                        if (this.savedTargetNode !== undefined && this.savedTargetNode >= 0 && this.savedTargetNode < this.nodes.length) {
                            this.targetNode = this.savedTargetNode;
                        } else {
                            
                            
                            console.warn(`Boss: savedTargetNode (${this.savedTargetNode}) was invalid. Current targetNode: ${this.targetNode}. Clamping.`);
                            if (this.targetNode === undefined || this.targetNode >= this.nodes.length || this.targetNode < 0) {
                                this.targetNode = 0; 
                            }
                        }
                        
                        
                        
                        if (this.targetNode >= this.nodes.length || this.targetNode < 0) {
                             console.warn(`Boss: Corrected targetNode ${this.targetNode} is still invalid. Resetting to 0. Path length: ${this.nodes.length}`);
                            this.targetNode = 0; 
                        }
                        
                        this.needsToResumeMovement = true;
                        console.log(`Boss finished spawning. Restored targetNode to: ${this.targetNode}. Will resume movement.`);
                    }
                    
                    
                    if (this.minionCount === 1) {
                        showMinionWarning();
                    }
                }
            }
        }        if (this.isSlowed && millis() >= this.slowEndTime) {
            this.isSlowed = false;
            this.slowFactor = 1;
        }
        if (this.isStunned && millis() >= this.stunEndTime) {
            this.isStunned = false;
        }
        
        
        if (this.type === 'boss' && this.needsToResumeMovement) {
            this.needsToResumeMovement = false;
            
            
            
            if (this.targetNode >= 0 && this.targetNode < this.nodes.length) {
                const target = this.nodes[this.targetNode];
                const xDifference = target.x - this.x;
                const yDifference = target.y - this.y;
                
                
                if (Math.abs(xDifference) < 0.1 && Math.abs(yDifference) < 0.1) { 
                    this.xSpeed = 0;
                    this.ySpeed = 0;
                    
                } else {
                    const angle = atan2(yDifference, xDifference);
                    this.xSpeed = this.speed * cos(angle);
                    this.ySpeed = this.speed * sin(angle);
                }
            } else {
                
                
                this.xSpeed = 0;
                this.ySpeed = 0;
                console.warn(`Boss resuming with invalid targetNode: ${this.targetNode}. findTarget will attempt recovery.`);
            }
            console.log(`Boss resumed movement. Target Node: ${this.targetNode}, New Speed: (${this.xSpeed.toFixed(2)}, ${this.ySpeed.toFixed(2)})`);
        }

        if (this.type === 'stealth' && !this.isExploding) {
            let actualStealthInterval = this.stealthInterval / this.gameSpeed;
            let actualStealthDuration = this.stealthDuration / this.gameSpeed;
            if (!this.isStealth && millis() - this.lastStealthToggle >= actualStealthInterval) {
                this.isStealth = true;
                this.lastStealthStart = millis();
            }
            if (this.isStealth && millis() - this.lastStealthStart >= actualStealthDuration) {
                this.isStealth = false;
                this.lastStealthToggle = millis();
            }
        }

        if (this.type === 'healer' && !this.isExploding) {
            let adjustedCooldown = this.healCooldown / this.gameSpeed;
        
            if (millis() - this.lastHealTime >= adjustedCooldown) {
                if (!this.isFullHealth() || enemies.length > 1) {
                    this.lastHealTime = millis();
                    this.showHealingRadius = false; 
                    
                    let healedAny = false;
                    let healingRadiusSquared = this.healingRadius * this.healingRadius;
        
                    for (let e of enemies) {
                        if (e.isExploding || e.isFullHealth()) continue;
        
                        let dx = this.x - e.x;
                        let dy = this.y - e.y;
                        let distanceSquared = dx * dx + dy * dy;
        
                        if (distanceSquared <= healingRadiusSquared) {
                            const healAmount = isHardMode ? e.maxHealth * 0.15 : e.maxHealth * 0.1;
                            e.strength = Math.min(e.maxHealth, Math.ceil(e.strength + healAmount));
                            e.healedAt = millis();
                            healedAny = true;
                        }
                    }
        
                    if (healedAny) {
                        this.showHealingRadius = true;
                        this.healingRadiusEndTime = millis() + 300;
                    }
                }
            }
        }
        
        this.findTarget();
        this.move();
        this.draw();
        this.checkTarget();
    }
}