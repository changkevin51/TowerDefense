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
        // Collision detection is now handled in the main checkCollision() function
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
    }
}
