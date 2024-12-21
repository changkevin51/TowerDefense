var playing = true;

var sangImg;

var levelOneNodes = [
    {x: -100, y: 50},
    {x: 100, y: 50},
    {x: 100, y: 500},
    {x: 400, y: 500},
    {x: 400, y: 200},
    {x: 200, y: 200},
    {x: 200, y: 100},
    {x: 800, y: 100}
];

 var path;
 var enemies;
 var turrets;
 var projectiles;
 var money = 1100;
 var health = 100;
 var wave;
 var waveNumber = 1;
 var gameSpeed = 1; 
 var frameRateBase = 60; 
 var turretPrice = 150; 
 const turretPriceIncreaseFactor = 1.5; 

 function setup() {
    createCanvas(700, 700).parent("gameCanvas");
    frameRate(frameRateBase); 
    sandImg = loadImage("images/sand.jpg");
    path = new Path(levelOneNodes);
    enemies = [];
    turrets = [];
    projectiles = [];
    wave = new Wave();
    updateInfo();
    turrets.push(new Turret(path.roads));
}

function draw() {
   if(playing) {
    background(0, 200, 0); 
    image(sandImg, 0, 0, 700, 700); 
    path.draw();

    for(var enemy of enemies) {
        enemy.update();
    }

    for(var turret of turrets) {
        turret.update();
    }

    for(var projectile of projectiles) {
        projectile.update();
    }

    filterArrays();
    checkCollision();
    wave.update();
}else{
    drawGameOver();
}

}

function filterArrays() {
    enemies = enemies.filter(e => e.finished == false && e.strength > 0);
    projectiles = projectiles.filter(p => p.inWorld() && p.strength > 0);
}

 function checkTurret() {
    var text = "";
    if(getTurretBeingPlaced() != null) {
        text = "Unavailable";
    } else {
        text = "Price: $100";
    }
    document.getElementById("buyTurretText").textContent = text;
 }

 function checkUpgrade() {
    var text = "";
    var turret = getTurretBeingSelected();
    if(turret != null) {
        if(turret.upgrades >= turret.maxUpgrades) {
            text = "Max Upgrade!";
        } else {
            text = "Price: $";
            text += (turret.upgrades+ 2) * 120;
        }
    } else {
        text = "No Turret Selected!";
    }
    document.getElementById("upgradeTurretText").textContent = text;
 }

 function checkWave() {
    var text = "";
    if (wave.active == false && enemies.length == 0) {
        text = "Wave Ready";
    } else {
        text = "Wave Not Ready";
    }
    document.getElementById("waveText").textContent = text;
 }

 function drawGameOver() {
    background(0, 0, 0, 20);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER!", 350, 350);
 }

 function updateInfo() {
    document.getElementById("Money").innerHTML = money;
    document.getElementById("Wave").innerHTML = wave.number;
    document.getElementById("Health").innerHTML = health;
 }

 function startWave() {
    if (wave.active || enemies.length > 0) {
        console.log("Wave not ready");
        return; 
    }
  
    wave.start();
    updateInfo();
    
    let healthIncrease = 2*wave.number;  
    health += healthIncrease;

    money += 100;  
    updateInfo();
    
    showMoneyPopup(100);
    showHealthPopup(healthIncrease);
}

function showHealthPopup(amount) {
    const popup = document.getElementById('healthPopup');
    popup.textContent = `+ ${amount} Health`; 
    popup.classList.add('show'); 
    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000); 
}

function showMoneyPopup(amount) {
    const popup = document.getElementById('moneypopup');
    popup.textContent = `+ ${amount} $`; 
    popup.classList.add('show'); 
    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000); 
}

function checkCollision() {
    for(var enemy of enemies) {
        for(var projectile of projectiles) {
            if(CircleInCircle(enemy, projectile)) {
                var damage = min(enemy.strength, projectile.strength);

                enemy.strength -= damage;
                projectile.strength -= damage;
                money += round(damage*0.5);
                updateInfo();
                filterArrays();
            }
        }
    }
}

function mousePressed() {

    if(mouseX > 0 && mouseX < 700 && mouseY > 0 && mouseY < 700) {
        unselectAllTurrets();
    }

    let turret = getTurretBeingPlaced();
    if(turret != null){
        if(turret.isValid()) {
            turret.placed = true;

        }
    }
    else {
        turret = getTurretBeingClicked();

        if(turret != null) {
            turret.selected = true;
        }
    }
}

function keyPressed() {
    let turret = getTurretBeingSelected();
    if(turret != null) {
        if(keyCode == LEFT_ARROW) {
            if(turret.targetMode > 0)
                turret.targetMode -= 1;
        }

        if(keyCode == RIGHT_ARROW) {
            if(turret.targetMode < 2)
                turret.targetMode += 1;
        }
    }
}

function changeTargetMode() {
    let turret = getTurretBeingSelected();
    if (turret != null) {
        turret.targetMode = (turret.targetMode + 1) % 3;  
        checkTargetMode();  
    }
}
function toggleSpeed() {
    if (gameSpeed === 1) {
        gameSpeed = 1.5;
    } else if (gameSpeed === 1.5) {
        gameSpeed = 2;
    } else {
        gameSpeed = 1;
    }
    wave.gameSpeed = gameSpeed; // Update speed dynamically
    turrets.forEach(t => t.gameSpeed = gameSpeed);
    projectiles.forEach(p => p.gameSpeed = gameSpeed);
    enemies.forEach(enemy => enemy.updateGameSpeed(gameSpeed));
    updateSpeedText();
}

function checkSpeed() {
    const speedText = document.getElementById('speedText');
    speedText.textContent = `Current Speed: ${gameSpeed}x`;
}

function updateSpeedText() {
    const speedText = document.getElementById('speedText');
    speedText.textContent = `Current Speed: ${gameSpeed}x`;
}

function buyTurret() {
    let turret = getTurretBeingPlaced();
    if (money >= turretPrice && turret == null) { 
        money -= turretPrice;  
        updateInfo(); 
        turrets.push(new Turret(path.roads));  
        turretPrice = Math.round(turretPrice * 1.5); 
        document.getElementById('buyTurretText').innerText = `Price: $${turretPrice}`; 
    }
}

function checkTurret() {
    document.getElementById('buyTurretText').innerText = `Price: $${turretPrice}`;
}

function checkTargetMode() {
    let turret = getTurretBeingSelected();
    let text = "";
    if (turret != null) {
        if (turret.targetMode == 0) {
            text = "Mode: 0 (Closest)";
        } else if (turret.targetMode == 1) {
            text = "Mode: 1 (Strongest)";
        } else if (turret.targetMode == 2) {
            text = "Mode: 2 (First)";
        }
    } else {
        text = "No Turret Selected!";
    }
    document.getElementById("targetModeText").textContent = text;
}

