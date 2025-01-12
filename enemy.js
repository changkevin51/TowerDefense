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
        this.gameSpeed = gameSpeed;
        this.type = type;
        this.isExploding = false;
        this.explosionFrameCount = 0;

        this.isSlowed = false;
        this.slowEndTime = 0;
        this.slowFactor = 1;
        this.isStunned = false;
        this.stunEndTime = 0;

        this.healedAt = 0;  // Track when this enemy was last healed

        switch (type) {
            case 'normal':
                this.img = normalEnemyImages[Math.floor(Math.random() * normalEnemyImages.length)];
                break;
            case 'heavy':
                this.img = heavyEnemyImage;
                break;
            case 'fast':
                this.img = fastEnemyImage;
                break;
            case 'boss':
                this.img = bossEnemyImage;
                break;
            case 'bomb':
                this.img = bombEnemyImage;
                this.explosionImg = explosionImage;
                break;
            case 'stealth':
                this.img = stealthEnemyImage; 
                this.speed *= 1.45;  
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

    draw() {
        strokeWeight(2);
        if (this.isExploding) {
            if (this.explosionFrameCount < 60) {
                if (this.explosionImg) {
                    const explosionRadius = 175 * 2;
                    image(this.explosionImg, this.x - explosionRadius / 2, this.y - explosionRadius / 2, explosionRadius, explosionRadius);
                }
                this.explosionFrameCount++;
                return;
            } else {
                const index = enemies.indexOf(this);
                if (index > -1) enemies.splice(index, 1);
                return;
            }
        }
    
        if (this.isStealth) {
            tint(128, 128, 128); 
        } else if (this.isSlowed) {
            tint(89, 192, 225); 
        } else {
            noTint(); 
        }
    
        if (this.img) {
            const adjustedX = this.x - this.size * (this.type === 'normal' || this.type === 'heavy' ? 0.75 : this.type === 'stealth' ? 0.8 : 1.15);
            const adjustedY = this.y - this.size * (this.type === 'stealth' ? 1.0 : 0.75);
            const width = this.size * (this.type === 'normal' || this.type === 'heavy' ? 1.5 : this.type === 'stealth' ? 1.5 : 3);
            const height = this.size * (this.type === 'stealth' ? 2.0 : 1.5);
    
            image(this.img, adjustedX, adjustedY, width, height);
        } else {
            console.error("Image not loaded for enemy type:", this.type);
        }
    
        noTint();
    
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

        if (millis() - this.healedAt < 300) {
            tint(128, 255, 128, 150);
            image(healingImage, this.x - this.size, this.y - this.size, this.size*2, this.size*2);
            noTint();
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
            if (this.isExploding && this.explosionImg) {
                const explosionDiameter = EXPLOSION_RADIUS * 2;
                image(this.explosionImg, this.x - explosionDiameter / 2, this.y - explosionDiameter / 2, explosionDiameter, explosionDiameter);
            }   if (!this.explosionImg) console.error("Explosion image not loaded.");
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
                            e.strength = Math.min(e.maxHealth, Math.ceil(e.strength + e.maxHealth * 0.1));
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