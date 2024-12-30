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
    update() {
        this.move();
        this.draw();
        if (!this.inWorld()) return;
        for (let enemy of enemies) {
            if (!this.hitEnemies.has(enemy) && CircleInCircle(this, enemy)) {
                enemy.strength -= this.strength;
                money += Math.round(this.strength * 0.5);
                updateInfo();

                this.hitEnemies.add(enemy);
            }
        }
    }
}
