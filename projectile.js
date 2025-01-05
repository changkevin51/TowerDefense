class Projectile {
    constructor(x, y, xSpeed, ySpeed, strength, gameSpeed, size) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.strength = strength;
        this.size = size;
        this.gameSpeed = gameSpeed;
    
    }

    draw() {
        fill(0, 255, 0);
        ellipse(this.x, this.y, this.size, this.size);
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
        let outside = 500;
        return this.x > -outside && this.x < 700 + outside
            && this.y > -outside && this.y < 700 + outside;
    }
}

class PiercingProjectile extends Projectile {
    constructor(x, y, xSpeed, ySpeed, strength, gameSpeed, size) {
        super(x, y, xSpeed, ySpeed, strength, gameSpeed, size);
        this.hitEnemies = new Set();
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
                
                enemy.strength -= this.strength;
                if (enemy.strength <= 0 && !enemy.isExploding) {
                    enemy.strength = 0; // Ensure it's not negative
                    enemy.explode(); // Trigger the explosion
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
        this.draw();
        if (!this.inWorld()) return;

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
