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
        this.projectileSpeed = 6.5;
        this.projectileStrength = 1;
        this.shootCooldown = 30;
        this.shootingTimer = 30;
        this.targetMode = 0;
        this.upgrades = 0;
        this.maxUpgrades = 3;
    }

    upgrade() {
        let upgradePrice = (this.upgrades+ 2) * 100;
        if(this.upgrades < this.maxUpgrades && money >= upgradePrice) {
            money -= upgradePrice;
            updateInfo();
            this.upgrades ++;
            this.shootCooldown -= 5;
            this.projectileStrength += 1;
            this.range += 50;
        }
    }

    draw() {
        if(!this.placed || this.selected) {
            strokeWeight(1);
            stroke('black');
            fill(255, 255, 0, 50);
            ellipse(this.x, this.y, this.range * 2, this.range * 2);
        }
    
        strokeWeight(5);
        stroke(this.chooseColor());
        stroke("white");
        var x = this.gunSize * cos(this.lookAngle);
        var y = this.gunSize * sin(this.lookAngle);
        line(this.x, this.y, this.x + x, this.y + y);
    
        strokeWeight(1);
        stroke('black');
        fill(this.chooseColor());
        ellipse(this.x, this.y, this.size, this.size);
    
        fill('yellow');
        textSize(12);
        textAlign(CENTER, CENTER);
        text("level " + (this.upgrades+1), this.x, this.y - this.size / 2 - 10);
    

        if(this.selected) {
            fill('white');
            textAlign(CENTER, CENTER);
            textSize(15);
            text(this.targetMode, this.x, this.y);
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
        if(this.x < 0 || this.x > 700 || this.y < 0 || this.y > 700) {
            return false;
        }

        if(this.onRoad()) {
            return false;
        } 

        if(this.onTurret()) {
            return false;
        }

        return true;
    }

    shootProjectile() {
        if (this.shootingTimer < this.shootCooldown) {
            this.shootingTimer += 1;
        } else {
            this.shootingTimer = 0;
        
        let x = this.x + (this.gunSize * cos(this.lookAngle));
        let y = this.y + (this.gunSize * sin(this.lookAngle));

        let xSpeed = this.projectileSpeed * cos(this.lookAngle);
        let ySpeed = this.projectileSpeed * sin(this.lookAngle);

        projectiles.push(new Projectile(x, y, xSpeed, ySpeed, this.projectileStrength));
      }
    }

    getEnemyClosestToTurret() {
        var closestDistance = Infinity;
        var closestEnemy = null;

        for(var enemy of enemies) {
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
    

    targetEnemy() {
        var enemy = null;
        if(this.targetMode == 0) {
            enemy = this.getEnemyClosestToTurret();
        }
        if(this.targetMode == 1) {
            enemy = this.getStrongestEnemy();
        }
        if(this.targetMode == 2) {
            enemy = this.getEnemyFarthestFromStart();
        }

        if (enemy == null) {
            return;
        }
        
        this.lookAngle = atan2(enemy.y - this.y, enemy.x - this.x);
        this.shootProjectile();
    }

    update() {

        if(this.placed == false) {
            this.followMouse();
        }
        else {
            this.targetEnemy();
            //this.shootProjectile();
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