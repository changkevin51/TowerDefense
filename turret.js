let turretHolderImg;
let turretFrames = [];
let sniperFrames = [];
let wizardFrames = [];
let wizardHolderImg;
let frosterFrames = [];
let frosterHolderImg;
let machinegunFrames = [];
let machinegunHolderImg;

class Turret {
    constructor(type, x, y, projectileImgResource, idleFrameResource, animationFrames, holderImgResource, roadsData) {
        this.type = type;
        this.roads = roadsData;
        this.x = x;
        this.y = y;
        this.size = 50;
        this.gunSize = 37.5;
        this.range = 150;
        this.lookAngle = 0;
        this.placed = true;
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
        this.stunImg = stunImg;
        this.totalDamage = 0;
        this.frameNumber = 0;
        this.isAnimating = false;
        this.animationSpeed = 8;
        this.lastAngle = 0;
        
        this.projectileImg = projectileImgResource; 
        this.turretFrames = animationFrames;     // Animation frames
        this.turretHolderImg = holderImgResource; // Base/holder image
        this.idleFrame = idleFrameResource; // Specific idle frame
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
        if (this.selected) { // Simplified: always show range if selected
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
        image(this.turretHolderImg, this.x, this.y, this.size, this.size); // Use instance-specific holder
    
        push();
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let turretBodySize = this.size * 2;
        if (this.isAnimating) {
            image(this.turretFrames[this.frameNumber], 0, 0, turretBodySize, turretBodySize); // Use instance-specific frames
            if (frameCount % Math.floor(this.animationSpeed / this.gameSpeed) === 0) {
                this.frameNumber++;
                if (this.frameNumber >= turretFrames.length) {
                    this.frameNumber = 0;
                    this.isAnimating = false;
                }
            }
        } else {
            image(this.idleFrame, 0, 0, turretBodySize, turretBodySize);  // Use instance-specific idle frame
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
        
        if (activeSpeedBoost.active && this.placed) {
            push();
            tint(255, 255, 255, 150);
            imageMode(CENTER);
            image(speedBoostEffectImg, this.x, this.y, this.size * 1.8, this.size * 1.8);
            noTint();
            imageMode(CORNER);
            pop();
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
    constructor(x, y, sniperAnimationFrames, roadsData) {

        super("sniper", x, y, null, sniperAnimationFrames[0], sniperAnimationFrames, turretHolderImg, roadsData); // Added "sniper" type
        this.range = 400;
        this.size = 60; // Sniper specific size
        this.gunSize = 55;
        this.shootCooldown = 100;
        this.projectileStrength = 4;
        this.hitEffects = [];
        this.targetMode = 2; // Default for sniper
        // this.upgrades = 0; // from super
        this.currentTarget = null;
        // this.frameNumber = 0; // from super
        // this.isAnimating = false; // from super
        this.animationSpeed = 1.5;
        // this.lastAngle = 0; // from super
        this.idleFrame = sniperAnimationFrames[0]; // Sniper's specific idle frame
        this.sniperFrames = sniperAnimationFrames; // Store specific frames if needed differently from base
    }

    draw() {
        if (this.selected) { // Simplified
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
        image(this.turretHolderImg, this.x, this.y, this.size, this.size); // Use instance-specific or common holder
        pop();
    
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let sniperSize = this.size * 2;
        if (this.isAnimating) {
            image(this.sniperFrames[this.frameNumber], 0, 0, sniperSize, sniperSize); // Use sniper specific frames
            if (frameCount % Math.floor(this.animationSpeed / this.gameSpeed) === 0) {
                this.frameNumber++;
                if (this.frameNumber >= sniperFrames.length) {
                    this.frameNumber = 0;
                    this.isAnimating = false;
                }
            }
        } else {
            image(this.idleFrame, 0, 0, sniperSize, sniperSize); // Use sniper specific idle
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

        if (activeSpeedBoost.active && this.placed) {
            push();
            tint(255, 255, 255, 150);
            imageMode(CENTER);
            image(speedBoostEffectImg, this.x, this.y, this.size * 1.8, this.size * 1.8);
            noTint();
            imageMode(CORNER);
            pop();
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
    constructor(x, y, wizardAnimationFrames, wizardHolderResource, wizardProjectileResource, roadsData) {
        super("wizard", x, y, wizardProjectileResource, wizardAnimationFrames[0], wizardAnimationFrames, wizardHolderResource, roadsData);
        this.range = 400;
        this.size = 67; 
        this.gunSize = 53; 
        this.projectileSpeed = 5;
        this.projectileStrength = 3;
        this.shootCooldown = 380;
        this.stunChance = 0.2;
        this.stunDuration = 1000;
        this.projectileImg = wizardProjectileResource;
        this.targetMode = 0;
        this.animationSpeed = 5;
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
        if (this.selected) {
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
        // Use this.turretHolderImg instead of this.wizardHolderImg
        image(this.turretHolderImg, this.x, this.y, this.size, this.size);
        pop();

        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let wizardSize = this.size * 2;
        if (this.isAnimating) {
            // Use this.turretFrames instead of this.wizardFrames
            image(this.turretFrames[Math.floor(this.frameNumber)], 0, 0, wizardSize, wizardSize);
            this.frameNumber += this.animationSpeed / this.gameSpeed;
            if (this.frameNumber >= this.turretFrames.length) { // Use this.turretFrames.length
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

        if (activeSpeedBoost.active && this.placed) {
            push();
            tint(255, 255, 255, 150);
            imageMode(CENTER);
            image(speedBoostEffectImg, this.x, this.y, this.size * 1.8, this.size * 1.8);
            noTint();
            imageMode(CORNER);
            pop();
        }
    }
}

class FrosterTurret extends Turret {
    constructor(x, y, frosterAnimationFrames, frosterHolderResource, snowballProjectileResource, roadsData) {
        super("froster", x, y, snowballProjectileResource, frosterAnimationFrames[0], frosterAnimationFrames, frosterHolderResource, roadsData);
        this.range = 300;
        this.size = 60; 
        this.gunSize = 42; 
        this.projectileSpeed = 6;
        this.projectileStrength = 0.5;
        this.shootCooldown = 50;
        this.slowFactor = 0.5;
        this.slowDuration = 1600;
        this.slowDurationBase = 1600;
        this.slowDurationUpgraded = 4000;
        this.stunDuration = 1000;
        this.projectileImg = snowballProjectileResource;
        this.targetMode = 0;
        this.animationSpeed = 6;
        this.animationEndTime = 0;
        this.animationDelay = 500;
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
        if (this.selected) {
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
        // Use this.turretHolderImg instead of this.frosterHolderImg
        image(this.turretHolderImg, this.x, this.y, this.size, this.size);
        pop();

        // Draw animated turret
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let frosterSize = this.size * 2;
        if (this.isAnimating) {
            image(this.turretFrames[Math.floor(this.frameNumber)], 0, 0, frosterSize, frosterSize);
            this.frameNumber += this.animationSpeed / this.gameSpeed;
            if (this.frameNumber >= this.turretFrames.length) { // Use this.turretFrames.length
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

        if (activeSpeedBoost.active && this.placed) {
            push();
            tint(255, 255, 255, 150);
            imageMode(CENTER);
            image(speedBoostEffectImg, this.x, this.y, this.size * 1.8, this.size * 1.8);
            noTint();
            imageMode(CORNER);
            pop();
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

class MachineGunTurret extends Turret {
    constructor(x, y, machinegunAnimationFrames, machinegunHolderResource, projectileImgResource, roadsData) {
        super("machinegun", x, y, projectileImgResource, machinegunAnimationFrames[0], machinegunAnimationFrames, machinegunHolderResource, roadsData);
        this.range = Infinity; 
        this.size = 55;
        this.gunSize = 40;
        this.projectileSpeed = 12;
        this.projectileStrength = 0.6;
        this.shootCooldown = 7; 
        this.spreadFactor = 0.3; 
        this.projectileImg = projectileImgResource;
        this.targetMode = 0;
        this.animationSpeed = 12; 
        this.cursorX = mouseX;
        this.cursorY = mouseY;
    }

    upgrade() {
        let upgradePrice = (this.upgrades + 2) * 180;
        if (this.upgrades < this.maxUpgrades && money >= upgradePrice) {
            money -= upgradePrice;
            updateInfo();
            this.upgrades++;
            this.shootCooldown -= 0.5;
            this.projectileStrength += 0.6;
            this.spreadFactor -= 0.05; 
        }
    }

    draw() {
        if (this.selected) {
            push();
            strokeWeight(1);
            stroke('black');
            fill(255, 100, 100, 50);
            ellipse(this.x, this.y, 1500, 1500); 
            pop();
        }

        push();
        imageMode(CENTER);
        if (!this.placed && !this.isValid()) {
            tint(238, 75, 43);
        }
        image(this.turretHolderImg, this.x, this.y, this.size, this.size);
        pop();

        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.lookAngle + PI/2);
        
        let machineGunSize = this.size * 2;
        if (this.isAnimating) {
            image(this.turretFrames[Math.floor(this.frameNumber)], 0, 0, machineGunSize, machineGunSize);
            this.frameNumber += this.animationSpeed / this.gameSpeed;
            if (this.frameNumber >= this.turretFrames.length) {
                this.frameNumber = 0;
                this.isAnimating = false;
            }
        } else {
            image(this.idleFrame, 0, 0, machineGunSize, machineGunSize);
        }
        pop();
        
        push();
        strokeWeight(2); 
        fill('yellow');
        textSize(12);
        textAlign(CENTER, CENTER);
        text("level " + (this.upgrades + 1), this.x, this.y - this.size / 2 - 10);
        pop();

        if (this.isStunned) {
            image(this.stunImg, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        }

        if (activeSpeedBoost.active && this.placed) {
            push();
            tint(255, 255, 255, 150);
            imageMode(CENTER);
            image(speedBoostEffectImg, this.x, this.y, this.size * 1.8, this.size * 1.8);
            noTint();
            imageMode(CORNER);
            pop();
        }
    }

    shootProjectile() {
        if (this.placed) {
            this.isAnimating = true;
            this.frameNumber = 0;
            
            this.cursorX = mouseX;
            this.cursorY = mouseY;
            
            this.lookAngle = atan2(this.cursorY - this.y, this.cursorX - this.x);
            
            let spreadAngle = this.lookAngle + random(-this.spreadFactor, this.spreadFactor);
            
            let x = this.x + (this.gunSize * cos(this.lookAngle));
            let y = this.y + (this.gunSize * sin(this.lookAngle));
            
            let xSpeed = this.projectileSpeed * cos(spreadAngle) * this.gameSpeed;
            let ySpeed = this.projectileSpeed * sin(spreadAngle) * this.gameSpeed;
            
            projectiles.push(new Projectile(x, y, xSpeed, ySpeed, this.projectileStrength, this.gameSpeed, 8));
            this.shootingTimer = 0;
            this.totalDamage += this.projectileStrength;
            dealDamage(this.projectileStrength);
        }
    }

    targetEnemy() {
        if (this.isStunned) {
            return;
        }

        if (this.shootingTimer >= this.shootCooldown / this.gameSpeed) {
            this.shootProjectile();
        } else {
            this.shootingTimer += 1;
        }
        
        if (this.placed) {
            this.cursorX = mouseX;
            this.cursorY = mouseY;
            this.lookAngle = atan2(this.cursorY - this.y, this.cursorX - this.x);
        }
    }

    chooseColor() {
        if (this.selected) return "blue";
        if (this.placed || this.isValid()) return "red";
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
    if (typeof window.totalDamage === 'number') {
        window.totalDamage += amount;
    }
}
