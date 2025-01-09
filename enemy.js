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

        // Assign preloaded images
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
            default:
                console.error(`Unknown enemy type: ${type}`);
        }

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
    
        if (this.isSlowed) {
            tint(89, 192, 225); 
        } else {
            noTint(); 
        }
    
        if (this.img) {
            const adjustedX = this.x - this.size * (this.type === 'normal' || this.type === 'heavy' ? 0.75 : 1.15);
            const adjustedY = this.y - this.size * 0.75;
            const width = this.size * (this.type === 'normal' || this.type === 'heavy' ? 1.5 : 3);
            const height = this.size * 1.5;
    
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
    }
    

    move() {
        if (!this.isExploding) {
            if (!this.isStunned) {
                let factor = this.isSlowed ? this.slowFactor : 1;
                this.x += this.xSpeed * this.gameSpeed * factor;
                this.y += this.ySpeed * this.gameSpeed * factor;
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
    
        this.findTarget();
        this.move();
        this.draw();
        this.checkTarget();
    }
}