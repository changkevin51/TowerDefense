let turretHolderImg;
let turretFrames = [];
let sniperFrames = [];
let wizardFrames = [];
let wizardHolderImg;
let frosterFrames = [];
let frosterHolderImg;

class Turret {
    constructor(roads) {
        this.roads = roads;
        this.x = 150;
        this.y = 150;
        this.size = 50
        this.gunSize = 37.5;
        this.range = 150;
        this.lookAngle = 0;
        this.placed = false;
        this.selected = false;
        this.projectileSpeed = 8.5; 
        this.projectileStrength = 1;
        this.shootCooldown = 30;
        this.shootingTimer = 30;
        this.targetMode = 0;
        this.upgrades = 0;
        this.maxUpgrades = 3;
        this.gameSpeed = gameSpeed; 
        this.isStunned = false;
        this.stunEndTime = 0;
        this.stunImg = loadImage('images/stun2.png'); 
        this.totalDamage = 0;
        this.frameNumber = 0;
        this.isAnimating = false;
        this.animationSpeed = 8;
        this.lastAngle = 0;
        this.idleFrame = loadImage('images/shooter/tile000.png');
    }
    

    upgrade() {
        let upgradePrice = (this.upgrades+ 2) * 120;
        if(this.upgrades < this.maxUpgrades && money >= upgradePrice) {
            money -= upgradePrice;
            updateInfo();
            this.upgrades += 1;
            this.shootCooldown -= 3;
            this.projectileStrength += 1;
            this.range += 50;
        }
    }

    draw() {
        if (!this.placed || this.selected) {
            push();
            strokeWeight(1);
            stroke('black');
            fill(255, 255, 0, 50);
            ellipse(this.x, this.y, this.range * 2, this.range * 2);
            pop();
        }
    
        push();
        imageMode(CENTER);
        if (!this.placed && !this.isValid()) {
            tint(238, 75, 43); 
        }
        image(turretHolderImg, this.x, this.y, this.size, this.size);
    
        push();
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let turretBodySize = this.size * 2;
        if (this.isAnimating) {
            image(turretFrames[this.frameNumber], 0, 0, turretBodySize, turretBodySize);
            if (frameCount % Math.floor(this.animationSpeed / this.gameSpeed) === 0) {
                this.frameNumber++;
                if (this.frameNumber >= turretFrames.length) {
                    this.frameNumber = 0;
                    this.isAnimating = false;
                }
            }
        } else {
            image(this.idleFrame, 0, 0, turretBodySize, turretBodySize);  // Changed this line
        }
        pop();
        pop();
    
        push();
        strokeWeight(2); 
        fill('yellow');
        textSize(12);
        textAlign(CENTER, CENTER);
        text("level " + (this.upgrades+1), this.x, this.y - this.size / 2 - 10);
        pop();
    
        if (this.isStunned) {
            image(this.stunImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        }
    }
    
    
    chooseColor() {
        if(this.selected) {
            return "blue";
        }
        if(this.placed || this.isValid()) {
            return "white";
        } else {
            return "red";
        }
    }

    followMouse() {
        this.x = mouseX;
        this.y = mouseY;
    }

    onRoad() {
        for(var road of this.roads) {
            if(CircleInRect(this, road)) {
                return true;
            }
        }
        return false;
    }

    onTurret() {
        for(var turret of turrets) {
            if(turret == this) {
                continue;
            }
            if(CircleInCircle(this, turret)) {
                return true;
            }
            
        }
        return false;
    }

    isValid() {
        let garbageX = 20; 
        let garbageY = 600; 
        let garbageWidth = 90; 
        let garbageHeight = 90; 
    
        if (this.x > garbageX && this.x < garbageX + garbageWidth &&
            this.y > garbageY && this.y < garbageY + garbageHeight) {
            return false; 
        }

        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 700) {
            return false; 
        }
    
        if (onDecoration(this.x, this.y)) {
            return false;
        }
    
        if (this.onRoad()) {
            return false; 
        }
    
        if (this.onTurret()) {
            return false;
        }
    
        return true; 
    }
    
    

    shootProjectile() {
        let enemy = null;
    
        if (this.targetMode === 0) {
            enemy = this.getEnemyClosestToTurret();
        } else if (this.targetMode === 1) {
            enemy = this.getStrongestEnemy();
        } else if (this.targetMode === 2) {
            enemy = this.getEnemyFarthestFromStart();
        } else if (this.targetMode === 3) {
            enemy = this.getLastEnemyInRange();
        }
    
        if (enemy) {
            this.lookAngle = atan2(enemy.y - this.y, enemy.x - this.x);
            
            // Start animation when angle changes significantly or shooting
            if (abs(this.lookAngle - this.lastAngle) > 0.1 || !this.isAnimating) {
                this.isAnimating = true;
                this.frameNumber = 0;
            }
            this.lastAngle = this.lookAngle;

            let x = this.x + (this.gunSize * cos(this.lookAngle));
            let y = this.y + (this.gunSize * sin(this.lookAngle));
            let xSpeed = this.projectileSpeed * cos(this.lookAngle) * this.gameSpeed;
            let ySpeed = this.projectileSpeed * sin(this.lookAngle) * this.gameSpeed;
    
            projectiles.push(new Projectile(x, y, xSpeed, ySpeed, this.projectileStrength, this.gameSpeed, 10));
            this.shootingTimer = 0;
            this.totalDamage += this.projectileStrength;
            dealDamage(this.projectileStrength); // Increment global damage counter
        }
    }
    
    

    getEnemyClosestToTurret() {
        var closestDistance = Infinity;
        var closestEnemy = null;

        for(var enemy of enemies) {
            if(enemy.isStealth) { 
                continue; 
            }
            var distance = dist(enemy.x, enemy.y, this.x, this.y);
            if(distance > this.range + enemy.size/2) {
                continue;
            }

            if(distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }
        return closestEnemy;
    }

    getStrongestEnemy() {
        var strongestEnemy = null;
        var strongestStrength = 0;

        for(var enemy of enemies) {
            if(enemy.isStealth) { 
                continue; 
            }
            var distance = dist(enemy.x, enemy.y, this.x, this.y);
            if (distance > this.range + enemy.size/2) {
                continue;
            }

            if (enemy.strength > strongestStrength) {
                strongestStrength = enemy.strength;
                strongestEnemy = enemy;
            }
        }
        return strongestEnemy;
    }

    getEnemyFarthestFromStart() {
        var farthestDistance = -1;
        var farthestEnemy = null;
        for(var enemy of enemies) {
            if(enemy.isStealth) { 
                continue; 
            }
            var distance = dist(enemy.x, enemy.y, this.x, this.y);
            if (distance > this.range + enemy.size/2) {
                continue;
            }
            var travel = enemy.distanceTraveled();

            if(travel > farthestDistance) {
                farthestDistance = travel;
                farthestEnemy = enemy;
            }
        }
        return farthestEnemy;
    }

    getLastEnemyInRange() {
        let lastEnemy = null;
    
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            if(enemy.isStealth) { 
                continue; 
            }
            let distance = dist(enemy.x, enemy.y, this.x, this.y);
    
            if (distance <= this.range + enemy.size / 2) {
                lastEnemy = enemy;
                break;
            }
        }
    
        return lastEnemy;
    }
    

    targetEnemy() {
        let enemy = null;
    
        if (this.targetMode === 0) {
            enemy = this.getEnemyClosestToTurret();
        } else if (this.targetMode === 1) {
            enemy = this.getStrongestEnemy();
        } else if (this.targetMode === 2) {
            enemy = this.getEnemyFarthestFromStart();
        } else if (this.targetMode === 3) {
            enemy = this.getLastEnemyInRange();
        }
    
        if (!enemy) {
            return;
        }
    
    
        if (this.shootingTimer >= this.shootCooldown / this.gameSpeed) {
            this.shootProjectile();
            this.shootingTimer = 0;
        } else {
            this.shootingTimer += 1;
        }
    }
    
    stun(duration) {
        this.isStunned = true;
        this.stunEndTime = millis() + duration; 
    }
    
    update() {
        if (this.isStunned && millis() >= this.stunEndTime) {
            this.isStunned = false;
        }
        if (!this.isStunned) {
            if (!this.placed) {
                this.followMouse();
            } else {
                this.targetEnemy();
            }
        }
        this.draw();
    }
    
}

function upgradeTurret() {
    let turret = getTurretBeingSelected();
    if (turret != null) {
        turret.upgrade();
        checkUpgrade();
    }
}

function buyTurret() {
    let turret = getTurretBeingPlaced();
    if(money >= 100 && turret == null) {
        money -= 100;
        updateInfo();
        turrets.push(new Turret(path.roads));
    }
}

function CircleInRect(c, r) {
        
    let closeX = c.x;
    let closeY = c.y;

    if(c.x < r.x) {
        closeX = r.x;
    }else if(c.x > r.x + r.w) {
        closeX = r.x + r.w;
    }
    if(c.y < r.y) {
        closeY = r.y;
    }else if(c.y > r.y + r.h) {
        closeY = r.y + r.h;
    }

    if(dist(c.x, c.y, closeX, closeY) < c.size / 2) {
        return true;
    } else {
        return false;
    }
}

function CircleInCircle(c1, c2) {
    return dist(c1.x, c1.y, c2.x, c2.y) < (c1.size/2) + (c2.size/2);
}

function getTurretBeingPlaced() {
    for(var turret of turrets) {
        if(turret.placed == false) {
            return turret;
        }
    }
    return null;
}

function getTurretBeingSelected() {
    for(var turret of turrets) {
        if(turret.selected) {
            return turret;
        }
    }
    return null;
}

function getTurretBeingClicked() {
    for(var turret of turrets) {
        if(dist(mouseX, mouseY, turret.x, turret.y) < turret.size/2) {
            return turret;
        }
    }
    return null;
}

function unselectAllTurrets() {
        for(var turret of turrets) {
                turret.selected = false;
        }
 }

 class SniperTurret extends Turret {
    constructor(roads) {
        super(roads);
        this.range = 400;
        this.size = 60;
        this.gunSize = 55;
        this.shootCooldown = 100;
        this.projectileStrength = 4;
        this.hitEffects = [];
        this.targetMode = 2;
        this.upgrades = 0;
        this.currentTarget = null;
        this.frameNumber = 0;
        this.isAnimating = false;
        this.animationSpeed = 1.5;
        this.lastAngle = 0;
        this.idleFrame = loadImage('images/sniper/tile000.png');
    }

    draw() {
        if (!this.placed || this.selected) {
            push();
            strokeWeight(1);
            stroke('black');
            fill(100, 200, 255, 50);
            ellipse(this.x, this.y, this.range * 2, this.range * 2);
            pop();
        }
    
        push();
        imageMode(CENTER);
        if (!this.placed && !this.isValid()) {
            tint(238, 75, 43); 
        }
        image(turretHolderImg, this.x, this.y, this.size, this.size);
        pop();
    
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let sniperSize = this.size * 2;
        if (this.isAnimating) {
            image(sniperFrames[this.frameNumber], 0, 0, sniperSize, sniperSize);
            if (frameCount % Math.floor(this.animationSpeed / this.gameSpeed) === 0) {
                this.frameNumber++;
                if (this.frameNumber >= sniperFrames.length) {
                    this.frameNumber = 0;
                    this.isAnimating = false;
                }
            }
        } else {
            image(this.idleFrame, 0, 0, sniperSize, sniperSize);
        }
        pop();
        strokeWeight(2); 

        fill('yellow');
        textSize(12);
        textAlign(CENTER, CENTER);
        text("level " + (this.upgrades + 1), this.x, this.y - this.size / 2 - 10);
    
        if (this.isStunned) {
            image(this.stunImg, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        }
    }

    chooseColor() {
        if (this.selected) {
            return "blue"; 
        }
        if (this.placed || this.isValid()) {
            return "darkblue"; 
        } else {
            return "red";
        }
    }

    


    upgrade() {
        let upgradePrice = (this.upgrades + 2) * 250;
        if (this.upgrades < this.maxUpgrades && money >= upgradePrice) {
            money -= upgradePrice;
            updateInfo();
            this.upgrades++;
            this.shootCooldown -= 8;
            this.projectileStrength += (4 + this.upgrades);
            this.range += 50;
        }
    }

    shootEnemy(enemy) {
        if (enemy) {
            this.isAnimating = true;
            this.frameNumber = 0;
            
            let damage = Math.min(enemy.strength, this.projectileStrength);
            enemy.strength -= damage;
            this.totalDamage += damage;
            money += Math.round(damage * 0.5);
            updateInfo();
            dealDamage(damage); // Increment global damage counter
    
            if (enemy.strength <= 0) {
                enemy.strength = 0;
                if (enemy.type === 'bomb' && !enemy.isExploding) {
                    enemy.explode();
                    return;
                }
            }
            this.displayHitEffect(enemy);
        }
    }

    getEnemyClosestToTurret() {
        let closestDistance = Infinity;
        let closestEnemy = null;
        for (let enemy of enemies) {
            if (enemy.strength <= 0) continue;
            let distance = dist(enemy.x, enemy.y, this.x, this.y);
            if (distance <= this.range + enemy.size/2 && distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }
        return closestEnemy;
    }

    getStrongestEnemy() {
        let strongestEnemy = null;
        let strongestStrength = 0;
        for (let enemy of enemies) {
            if (enemy.strength <= 0) continue;
            let distance = dist(enemy.x, enemy.y, this.x, this.y);
            if (distance <= this.range + enemy.size/2 && enemy.strength > strongestStrength) {
                strongestStrength = enemy.strength;
                strongestEnemy = enemy;
            }
        }
        return strongestEnemy;
    }

    getEnemyFarthestFromStart() {
        let farthestDistance = -1;
        let farthestEnemy = null;
        for (let enemy of enemies) {
            if (enemy.strength <= 0) continue;
            let distance = dist(enemy.x, enemy.y, this.x, this.y);
            if (distance > this.range + enemy.size/2) continue;
            let travel = enemy.distanceTraveled();
            if (travel > farthestDistance) {
                farthestDistance = travel;
                farthestEnemy = enemy;
            }
        }
        return farthestEnemy;
    }

    getLastEnemyInRange() {
        let lastEnemy = null;
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            if (enemy.strength <= 0) continue;
            let distance = dist(enemy.x, enemy.y, this.x, this.y);
            if (distance <= this.range + enemy.size / 2) {
                lastEnemy = enemy;
                break;
            }
        }
        return lastEnemy;
    }
    
    

    targetEnemy() {
        if (this.isStunned) {
            return;  // Prevent any actions (like shooting) when stunned
        }
    
        if (this.currentTarget) {
            let distance = dist(this.currentTarget.x, this.currentTarget.y, this.x, this.y);
            if (distance > this.range + this.currentTarget.size / 2 || this.currentTarget.strength <= 0) {
                this.currentTarget = null; // Reset target if out of range or dead
            }
        }
    
        if (!this.currentTarget) {
            if (this.targetMode === 0) {
                this.currentTarget = this.getEnemyClosestToTurret();
            } else if (this.targetMode === 1) {
                this.currentTarget = this.getStrongestEnemy();
            } else if (this.targetMode === 2) {
                this.currentTarget = this.getEnemyFarthestFromStart();
            } else if (this.targetMode === 3) {
                this.currentTarget = this.getLastEnemyInRange(); // Add support for "Last"
            }
        }
    
        if (this.currentTarget) {
            this.lookAngle = atan2(this.currentTarget.y - this.y, this.currentTarget.x - this.x);
            if (this.shootingTimer >= this.shootCooldown / this.gameSpeed) {
                this.shootingTimer = 0;
                this.shootEnemy(this.currentTarget);
            } else {
                this.shootingTimer += 1;
            }
        }
    }
    
    

    displayHitEffect(enemy) {
        this.hitEffects.push({
            enemy: enemy,
            size: 1,
            growing: true,
            lastX: enemy.x,
            lastY: enemy.y,
        });
    }

    drawHitEffects() {
        for (let i = this.hitEffects.length - 1; i >= 0; i--) {
            let effect = this.hitEffects[i];
            let x = effect.enemy.strength > 0 ? effect.enemy.x : effect.lastX;
            let y = effect.enemy.strength > 0 ? effect.enemy.y : effect.lastY;

            push();
            imageMode(CENTER);
            tint(255, 200);
            image(powImage, x, y, effect.size, effect.size);
            pop();

            if (effect.growing) {
                effect.size += 10;
                if (effect.size >= 100) effect.growing = false;
            } else {
                effect.size -= 10;
                if (effect.size <= 0) this.hitEffects.splice(i, 1);
            }

            if (effect.enemy.strength <= 0) {
                effect.lastX = x;
                effect.lastY = y;
            }
        }
    }

    update() {
        if (this.isStunned) {
            if (millis() >= this.stunEndTime) {
                this.isStunned = false;
            } else {
                image(this.stunImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            }
        }
        if (!this.placed) {
            this.followMouse();
        } else {
            this.targetEnemy();
        }
        this.draw();
        this.drawHitEffects();
    }
}

class WizardTurret extends Turret {
    constructor(roads) {
        super(roads);
        this.range = 465; 
        this.size = 65; 
        this.handOffset = 35; 
        this.gunSize = 50;
        this.shootCooldown = 380; 
        this.projectileStrength = 3; 
        this.projectileSpeed = 2; 
        this.cost = 400; 
        this.immuneToStun = false; 
        this.frameNumber = 0;
        this.isAnimating = false;
        this.animationSpeed = 6;
        this.lastAngle = 0;
        this.idleFrame = loadImage('images/wizard/tile000.png');
        this.animationEndTime = 0;
        this.animationDelay = 500; 
    }

    upgrade() {
        let upgradePrice = (this.upgrades + 2) * 260;
        if (this.upgrades < this.maxUpgrades && money >= upgradePrice) {
            money -= upgradePrice;
            updateInfo();
            this.upgrades++;
            this.shootCooldown -= 5;
            this.projectileStrength += (2 + this.upgrades);
            this.range += 12;
            if (this.upgrades >= 2) {
                this.immuneToStun = true;
            }
        }
    }

    stun(duration) {
        if (!this.immuneToStun) {
            this.isStunned = true;
            this.stunEndTime = millis() + duration;
        }
    }

    shootProjectile(enemy) {
        if (enemy) {
            this.isAnimating = true;
            this.frameNumber = 0;
            this.animationEndTime = millis() + this.animationDelay;
            this.lookAngle = atan2(enemy.y - this.y, enemy.x - this.x);

            let x = this.x + this.gunSize * cos(this.lookAngle);
            let y = this.y + this.gunSize * sin(this.lookAngle);

            let xSpeed = this.projectileSpeed * cos(this.lookAngle);
            let ySpeed = this.projectileSpeed * sin(this.lookAngle);

            // Create a piercing projectile and pass reference to this turret
            const newProjectile = new PiercingProjectile(
                x, 
                y, 
                xSpeed, 
                ySpeed, 
                this.projectileStrength, 
                this.gameSpeed,
                50,
                this
            );
            projectiles.push(newProjectile);

            if (enemy.type === 'bomb' && enemy.strength <= 0 && !enemy.isExploding) {
                if (this.type === 'wizard' && (this.upgrades + 1) >= 3) {
                    enemy.isExploding = true;
                } else {
                    enemy.explode();
                }
            }
        }
    }


    targetEnemy() {
        let enemy = null;
    
        if (this.targetMode === 0) {
            enemy = this.getEnemyClosestToTurret();
        } else if (this.targetMode === 1) {
            enemy = this.getStrongestEnemy();
        } else if (this.targetMode === 2) {
            enemy = this.getEnemyFarthestFromStart();
        } else if (this.targetMode === 3) {
            enemy = this.getLastEnemyInRange(); // Add support for "Last"
        }
    
        if (enemy) {
            this.lookAngle = atan2(enemy.y - this.y, enemy.x - this.x);
            if (this.shootingTimer >= this.shootCooldown / this.gameSpeed) {
                this.shootProjectile(enemy); 
                this.shootingTimer = 0;
            } else {
                this.shootingTimer += 1; 
            }
        }
    }
    

    draw() {
        if (!this.placed || this.selected) {
            push();
            strokeWeight(1);
            stroke('black');
            fill(255, 255, 0, 50);
            ellipse(this.x, this.y, this.range * 2, this.range * 2);
            pop();
        }

        push();
        imageMode(CENTER);
        if (!this.placed && !this.isValid()) {
            tint(238, 75, 43); 
        }
        image(wizardHolderImg, this.x, this.y, this.size, this.size);
        pop();

        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let wizardSize = this.size * 2;
        if (this.isAnimating) {
            image(wizardFrames[Math.floor(this.frameNumber)], 0, 0, wizardSize, wizardSize);
            this.frameNumber += this.animationSpeed / this.gameSpeed;
            if (this.frameNumber >= wizardFrames.length) {
                this.frameNumber = 0;
                this.isAnimating = false;
            }
        } else {
            image(this.idleFrame, 0, 0, wizardSize, wizardSize);
        }
        pop();
        strokeWeight(2); 

        fill('yellow');
        textSize(12);
        textAlign(CENTER, CENTER);
        text("level " + (this.upgrades + 1), this.x, this.y - this.size / 2 - 10);

        if (this.isStunned) {
            image(this.stunImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        }
    }

    chooseColor() {
        if(this.selected) {
            return "blue";
        }
        if(this.placed || this.isValid()) {
            return "magenta";
        } else {
            return "red";
        }
    }

    update() {
        if (this.isStunned && millis() >= this.stunEndTime) {
            this.isStunned = false;
        }
        if (!this.isStunned) {
            if (!this.placed) {
                this.followMouse();
            } else {
                // Only target new enemy if animation is complete
                if (millis() >= this.animationEndTime) {
                    this.targetEnemy();
                }
            }
        }
        this.draw();
    }
}


class FrosterTurret extends Turret {
    constructor(roads) {
        super(roads);
        this.range = 300;
        this.size = 60;
        this.gunSize = 45;
        this.shootCooldown = 100;
        this.projectileStrength = 2;
        this.projectileSpeed = 6.5;
        this.upgrades = 0;
        this.maxUpgrades = 3;
        this.slowDurationBase = 1500;
        this.slowDurationUpgraded = 2000;
        this.stunDuration = 600;
        
        // Animation properties
        this.frameNumber = 0;
        this.isAnimating = false;
        this.animationSpeed = 1.5;
        this.lastAngle = 0;
        this.idleFrame = loadImage('images/froster/tile000.png');
        this.animationEndTime = 0;
        this.animationDelay = 400;
    }

    upgrade() {
        let upgradePrice = (this.upgrades + 2) * 270; 
        if (this.upgrades < this.maxUpgrades && money >= upgradePrice) {
            money -= upgradePrice;
            updateInfo();
            this.upgrades++;
            this.shootCooldown -= 8;
            this.projectileStrength += 1;
            this.range += 10;
        }
    }

    shootProjectile(enemy) {
        if (enemy) {
            this.isAnimating = true;
            this.frameNumber = 0;
            this.lookAngle = atan2(enemy.y - this.y, enemy.x - this.x);
            
            const x = this.x + this.gunSize * cos(this.lookAngle);
            const y = this.y + this.gunSize * sin(this.lookAngle);
            const xSpeed = this.projectileSpeed * cos(this.lookAngle);
            const ySpeed = this.projectileSpeed * sin(this.lookAngle);

            const level = this.upgrades + 1;
            const slowTime = (level >= 3) ? this.slowDurationUpgraded : this.slowDurationBase;
            const applyStun = (level >= 3);

            let snowball = new SnowballProjectile(
                x, y,
                xSpeed, ySpeed,
                this.projectileStrength,
                this.gameSpeed,
                30,
                slowTime,
                applyStun ? this.stunDuration : 0
            );
            projectiles.push(snowball);
            this.shootingTimer = 0;
            this.totalDamage += this.projectileStrength;
            dealDamage(this.projectileStrength); // Increment global damage counter
        }
    }

    draw() {
        if (!this.placed || this.selected) {
            push();
            strokeWeight(1);
            stroke('black');
            fill(150, 200, 255, 50);
            ellipse(this.x, this.y, this.range * 2, this.range * 2);
            pop();
        }

        // Draw static holder
        push();
        imageMode(CENTER);
        if (!this.placed && !this.isValid()) {
            tint(238, 75, 43); 
        }
        image(frosterHolderImg, this.x, this.y, this.size, this.size);
        pop();

        // Draw animated turret
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let frosterSize = this.size * 2;
        if (this.isAnimating) {
            image(frosterFrames[Math.floor(this.frameNumber)], 0, 0, frosterSize, frosterSize);
            this.frameNumber += this.animationSpeed / this.gameSpeed;
            if (this.frameNumber >= frosterFrames.length) {
                this.frameNumber = 0;
                this.isAnimating = false;
            }
        } else {
            image(this.idleFrame, 0, 0, frosterSize, frosterSize);
        }
        pop();
        strokeWeight(2); 

        fill('yellow');
        textSize(12);
        textAlign(CENTER, CENTER);
        text("level " + (this.upgrades + 1), this.x, this.y - this.size / 2 - 10);

        if (this.isStunned) {
            image(this.stunImg, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        }
    }

    targetEnemy() {
        let enemy = null;
    
        if (this.targetMode === 0) {
            enemy = this.getEnemyClosestToTurret();
        } else if (this.targetMode === 1) {
            enemy = this.getStrongestEnemy();
        } else if (this.targetMode === 2) {
            enemy = this.getEnemyFarthestFromStart();
        } else if (this.targetMode === 3) {
            enemy = this.getLastEnemyInRange(); 
        }
    
        if (enemy) {
            if (millis() >= this.animationEndTime) {
                this.lookAngle = atan2(enemy.y - this.y, enemy.x - this.x);
            }
            
            if (this.shootingTimer >= this.shootCooldown / this.gameSpeed) {
                this.shootProjectile(enemy);
                this.shootingTimer = 0;
                this.animationEndTime = millis() + this.animationDelay/this.gameSpeed;
            } else {
                this.shootingTimer += this.gameSpeed;
            }
        }
    }

    chooseColor() {
        if (this.selected) return "blue";
        if (this.placed || this.isValid()) return "cyan";
        return "red";
    }

    update() {
        if (this.isStunned && millis() >= this.stunEndTime) {
            this.isStunned = false;
        }
        if (!this.isStunned) {
            if (!this.placed) {
                this.followMouse();
            } else {
                this.targetEnemy();
            }
        }
        this.draw();
    }
}

function dealDamage(amount) {
    // Increment global damage counter
    if (typeof window.totalDamage === 'number') {
        window.totalDamage += amount;
    }
}
