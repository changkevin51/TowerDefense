let projectileImg;
let wizardProjectileImage;

class Projectile {
    constructor(x, y, xSpeed, ySpeed, strength, gameSpeed, size) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.strength = strength;
        this.size = size;
        this.gameSpeed = gameSpeed;
        this.angle = atan2(ySpeed, xSpeed);
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angle); 
        imageMode(CENTER);
        image(projectileImg, 0, 0, this.size*2.4, this.size*3);
        pop();
    }


    move() {
        this.x += this.xSpeed * this.gameSpeed; 
        this.y += this.ySpeed * this.gameSpeed; 
    }

    update() {
        this.move();
        this.draw();
    }

    inWorld() {
        let outside = 5;
        return this.x > outside && this.x < 790 + outside
            && this.y > outside && this.y < 690 + outside;
    }
}

class PiercingProjectile extends Projectile {
    constructor(x, y, xSpeed, ySpeed, strength, gameSpeed, size, parentTurret) {
        super(x, y, xSpeed, ySpeed, strength, gameSpeed, size);
        this.hitEnemies = new Set();
        this.totalDamageDealt = 0;
        this.parentTurret = parentTurret;
        this.angle = atan2(ySpeed, xSpeed);
        this.speedMultiplier = 1.0;
        this.speedIncrement = 0.05; // increase speed by 5% each frame
    }
    move() {
        this.speedMultiplier += this.speedIncrement;
        this.x += this.xSpeed * this.speedMultiplier * this.gameSpeed;
        this.y += this.ySpeed * this.speedMultiplier * this.gameSpeed;
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        
        if (wizardProjectileImage) {
            imageMode(CENTER);
            image(wizardProjectileImage, 0, 0, this.size, this.size);
        } else {
            fill(0, 255, 0);
            ellipse(0, 0, this.size, this.size);
        }
        
        pop();
    }
    

    update() {
        this.move();
        this.draw();
        if (!this.inWorld()) return;

        for (let enemy of enemies) {
            if (!this.hitEnemies.has(enemy) && CircleInCircle(this, enemy)) {
                enemy.strength -= this.strength;
                this.totalDamageDealt += this.strength;
                if (this.parentTurret) {
                    this.parentTurret.totalDamage += this.strength;
                }
                if (enemy.strength <= 0 && !enemy.isExploding) {
                    enemy.strength = 0; 
                    enemy.explode(); 
                }

                money += Math.round(this.strength * 0.5);
                updateInfo();
                this.hitEnemies.add(enemy);
            }
        }
    }
}

class SnowballProjectile extends Projectile {
    constructor(x, y, xSpeed, ySpeed, strength, gameSpeed, size, slowDuration, stunDuration) {
        super(x, y, xSpeed, ySpeed, strength, gameSpeed, size);
        this.slowDuration = slowDuration;
        this.stunDuration = stunDuration;
    }

    draw() {
        push(); 
        imageMode(CENTER);
        if (snowballImg) {
            image(snowballImg, this.x, this.y, this.size, this.size);
        } else {
            fill(200, 255, 255);
            ellipse(this.x, this.y, this.size, this.size);
        }
        pop(); 
    }

    update() {
        this.move();
        if (!this.inWorld()) return;

        this.draw();

        for (let enemy of enemies) {
            if (CircleInCircle(this, enemy)) {
                enemy.strength -= this.strength;
                money += Math.round(this.strength * 0.5);
                updateInfo();

                enemy.isSlowed = true;
                enemy.slowEndTime = millis() + this.slowDuration;
                enemy.slowFactor = 0.65;

                if (this.stunDuration > 0 && enemy.type !== 'ship' && enemy.type !== 'boss' && enemy.type !== 'miniboss1' && enemy.type !== 'miniboss2' && enemy.type !== 'miniboss3') {
                    enemy.isStunned = true;
                    enemy.stunEndTime = millis() + this.stunDuration;
                } else if (this.stunDuration > 0 && (enemy.type === 'ship' || enemy.type === 'boss' || enemy.type === 'miniboss1' || enemy.type === 'miniboss2' || enemy.type === 'miniboss3')) {
                    // apply a stronger slow effect instead of stun for bosses
                    enemy.slowFactor = 0.5; 
                    enemy.slowEndTime = millis() + this.slowDuration; 
                }

                if (enemy.strength <= 0 && !enemy.isExploding) {
                    enemy.strength = 0;
                    enemy.explode();
                }
                projectiles.splice(projectiles.indexOf(this), 1);
                break;
            }
        }
    }
}
