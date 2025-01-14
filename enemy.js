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

        this.isSlowed = false;
        this.slowEndTime = 0;
        this.slowFactor = 1;
        this.isStunned = false;
        this.stunEndTime = 0;

        this.healedAt = 0;  // Track when this enemy was last healed

        switch (type) {
            case 'heavy':
                this.frontFrames = heavyFrontFrames;
                this.rightFrames = heavyRightFrames;
                this.backFrames = heavyBackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 48; // Adjust as needed
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
                this.img = healerEnemyImage; 
                this.healingRadius = 200;
                this.healCooldown = 2000;
                this.lastHealTime = millis();
                this.showHealingRadius = false;
                this.healingRadiusEndTime = 0;
                this.healingRings = [];
                this.lastRingTime = 0;
                this.ringInterval = 500; // New ring every 500ms
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
                break;
            case 'boss':
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
                break;
            case 'miniboss1':
                this.frontFrames = miniboss1FrontFrames;
                this.rightFrames = miniboss1RightFrames;
                this.backFrames = miniboss1BackFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.currentFrameSet = this.frontFrames;
                this.size = 58;
                this.maxHealth *= 1.7;
                this.strength = this.maxHealth;
                this.speed *= 0.8;
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
                break;
            case 'bomb':
                this.frames = bombFrames;
                this.explosionFrames = explosionFrames;
                this.animationIndex = 0;
                this.animationTimer = 0;
                this.size = 48; 
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

        // Base healing area
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
        }
    
        push();
        if (this.isStealth) {
            tint(128, 128, 128);
        } else if (this.isSlowed) {
            tint(89, 192, 225);
        }
    
        if (this.type === 'robo1' || this.type === 'robo2' || this.type === 'robo3' || 
            this.type === 'heavy' || this.type === 'fast' || this.type === 'stealth' ||
            this.type === 'miniboss1' || this.type === 'miniboss2' || this.type === 'miniboss3' ||
            this.type === 'boss') {
            
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
            image(roboImg, this.x - this.size, this.y - this.size + floatOffset, this.size*2, this.size*2);
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
            this.animationTimer++;
        
            let floatOffset = sin(millis() / 250) * 3;
            let bombImg = this.frames[this.animationIndex];
            image(bombImg, this.x - this.size, this.y - this.size + floatOffset, this.size*2, this.size*2);
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
            if (!this.isStunned) {
                let factor = this.isSlowed ? this.slowFactor : 1;
                let speedBonus = this.isStealth ? 1.2 : 1;
                this.x += this.xSpeed * this.gameSpeed * factor * speedBonus;
                this.y += this.ySpeed * this.gameSpeed * factor * speedBonus;
            }
        }
    }

    findTarget() {
        if (this.xSpeed === 0 && this.ySpeed === 0) {
            this.targetNode++;
            if (this.targetNode >= this.nodes.length) return;

            const target = this.nodes[this.targetNode];
            const xDifference = target.x - this.x;
            const yDifference = target.y - this.y;
            const angle = atan2(yDifference, xDifference);
            this.xSpeed = this.speed * cos(angle);
            this.ySpeed = this.speed * sin(angle);
        }
    }

    checkTarget() {
        const target = this.nodes[this.targetNode];
        const distance = dist(this.x, this.y, target.x, target.y);
        if (distance < this.speed * this.gameSpeed) {
            this.xSpeed = 0;
            this.ySpeed = 0;

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
        if (distance < this.speed * this.gameSpeed) {
            this.x = target.x;
            this.y = target.y;
            this.xSpeed = 0;
            this.ySpeed = 0;
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
        if (this.type === 'bomb') { // Ensure only bomb enemies trigger this
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
    }

    update() {
        if (this.isExploding) {
            this.draw();
            return;
        }
        
        if (this.strength <= 0 && !this.isExploding) {
            this.explode();
            return;
        }
    
        if (this.isSlowed && millis() >= this.slowEndTime) {
            this.isSlowed = false;
            this.slowFactor = 1;
        }
        if (this.isStunned && millis() >= this.stunEndTime) {
            this.isStunned = false;
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