let projectileImg;

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
        rotate(this.angle + PI/2); // Add 90 degrees since image points down
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
        return this.x > outside && this.x < 690 + outside
            && this.y > outside && this.y < 690 + outside;
    }
}

class PiercingProjectile extends Projectile {
    constructor(x, y, xSpeed, ySpeed, strength, gameSpeed, size, parentTurret) {
        super(x, y, xSpeed, ySpeed, strength, gameSpeed, size);
        this.hitEnemies = new Set();
        this.totalDamageDealt = 0;
        this.parentTurret = parentTurret; // Assign parent turret
    }

    draw() {
        push();
        
        if (orbImage) {
            imageMode(CENTER);
            image(orbImage, this.x, this.y, this.size, this.size);
        } else {
            fill(0, 255, 0);
            ellipse(this.x, this.y, this.size, this.size);
        }
    
        pop();
    }
    

    update() {
        this.move();
        this.draw();
        if (!this.inWorld()) return;

        for (let enemy of enemies) {
            if (!this.hitEnemies.has(enemy) && CircleInCircle(this, enemy)) {
                // Reduce enemy's strength
                enemy.strength -= this.strength;

                // Add to total damage dealt
                this.totalDamageDealt += this.strength;

                // Update turret's damage counter
                if (this.parentTurret) {
                    this.parentTurret.totalDamage += this.strength;
                }

                // Handle enemy death
                if (enemy.strength <= 0 && !enemy.isExploding) {
                    enemy.strength = 0; // Ensure it doesn't go negative
                    enemy.explode(); // Trigger the explosion
                }

                // Award money and update UI
                money += Math.round(this.strength * 0.5);
                updateInfo();

                // Mark this enemy as hit
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
                enemy.slowFactor = 0.6;

                if (this.stunDuration > 0) {
                    enemy.isStunned = true;
                    enemy.stunEndTime = millis() + this.stunDuration;
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
