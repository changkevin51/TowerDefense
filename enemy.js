class Enemy {
    constructor(strength, speed, nodes, maxHealth) {
        this.strength = maxHealth;
        this.speed = speed;
        this.nodes = nodes;
        this.x = nodes[0].x;
        this.y = nodes[0].y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.size = 30;
        this.targetNode = 0;
        this.finished = false;
        this.maxHealth = maxHealth; 
        this.gameSpeed = gameSpeed;
    }

    draw() {
        fill('red');
        ellipse(this.x, this.y, this.size, this.size);
        
        fill(255, 0, 0); 
        rect(this.x - 15, this.y - 25, 30, 5); 
        

        fill(0, 255, 0); 
        let healthWidth = (this.strength / this.maxHealth) * 30;
        rect(this.x - 15, this.y - 25, healthWidth, 5);

        fill('black');
        textAlign(CENTER, CENTER);
        textSize(15);
        text(floor(this.strength), this.x, this.y);

    }
    
    move() {
        this.x += this.xSpeed * this.gameSpeed;
        this.y += this.ySpeed * this.gameSpeed; 
    }

    findTarget() {
        if (this.xSpeed === 0 && this.ySpeed === 0) {
            this.targetNode++;
            if (this.targetNode >= this.nodes.length) {
                return; 
            }
            let target = this.nodes[this.targetNode];
            let xDifference = target.x - this.x;
            let yDifference = target.y - this.y;
            let angle = atan2(yDifference, xDifference);
            this.xSpeed = this.speed * cos(angle);
            this.ySpeed = this.speed * sin(angle);
        }
    }

    checkTarget() {
        let target = this.nodes[this.targetNode];
        let distance = dist(this.x, this.y, target.x, target.y);
        if (distance < this.speed) {
            this.xSpeed = 0;
            this.ySpeed = 0;

            if (this.targetNode === this.nodes.length - 1) {
                this.finished = true;
                health -= round(this.strength);
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

    update() {
        this.findTarget();
        this.move();
        this.draw();
        this.checkTarget();
    }
}
