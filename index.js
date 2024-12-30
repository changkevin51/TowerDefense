var playing = true;

var sangImg;

var levelOneNodes = [
    {x: -100, y: 50},
    {x: 100, y: 50},
    {x: 100, y: 500},
    {x: 400, y: 500},
    {x: 400, y: 200},
    {x: 220, y: 200},
    {x: 220, y: 80},
    {x: 600, y: 80},
    {x: 600, y: 800},
];

 var path;
 var enemies;
 var turrets;
 var projectiles;
 var money = 1200;
 var health = 100;
 var wave;
 var waveNumber = 1;
 var gameSpeed = 1; 
 var isCooldown = false;
 let isWaveCooldown = false;
 var frameRateBase = 60; 
 var turretPrice = 150; 
 const turretPriceIncreaseFactor = 1.4; 
 const sniperPriceIncreaseFactor = 1.65; 
 const wizardPriceIncreaseFactor = 1.75;
 var autoStart = false;
 var showStartArrow = true; 
 var turretPriceSniper = 300;
 var turretPriceWizard = 400;
 


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
}

function draw() {
    if (playing) {
        background(0, 200, 0);
        image(sandImg, 0, 0, 700, 700);
        path.draw();

        if (showStartArrow) {
            path.drawStartArrow();
        }

        for (var enemy of enemies) {
            enemy.update();
        }

        for (var turret of turrets) {
            turret.update();
        }

        for (var projectile of projectiles) {
            projectile.update();
        }

        filterArrays();
        checkCollision();
        wave.update();

        if (enemies.length > 0 || wave.active) {
            showStartArrow = false; 
        }
    } else {
        drawGameOver();
    }
}

function filterArrays() {
    enemies = enemies.filter(e => e.finished == false && e.strength > 0);
    projectiles = projectiles.filter(p => p.inWorld() && p.strength > 0);
}



function checkUpgrade() {
    let text = "";
    const turret = getTurretBeingSelected();

    if (turret !== null) {
        if (turret.upgrades >= turret.maxUpgrades) {
            text = "Max Upgrade!";
        } else {
            text = "Price: $";
            if (turret instanceof SniperTurret) {
                text += (turret.upgrades + 2) * 250; 
            }
            else if (turret instanceof WizardTurret) {
                text += (turret.upgrades + 2) * 280;
            } else {
                text += (turret.upgrades + 2) * 120; 
            }
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

 function updateWaveButtonText() {
    const autoStartText = document.querySelector('.autoStartToggle');
    autoStartText.textContent = `Auto Start Toggle: ${autoStart ? "True" : "False"}`;

    const waveButton = document.querySelector('#waveText');
    waveButton.textContent = wave.active ? "Wave Active" : "Wave Ready";
}


function toggleAutoStart() {
    autoStart = !autoStart;
    updateWaveButtonText();

    if (autoStart && !wave.active && enemies.length === 0 && !isWaveCooldown) {
        startWave();
    }
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
    isWaveCooldown = true; 
    setTimeout(() => {
        isWaveCooldown = false;
    }, 1500);
  

    waveNumber += 1
    showMoneyPopup(150);
    let healthIncrease = 2*wave.number;  
    health += healthIncrease;
    showHealthPopup(healthIncrease);
    money += 150;  

    wave.start();
    updateInfo();

    console.log(`AutoStart: ${autoStart}, Wave Active: ${wave.active}, Enemies Remaining: ${enemies.length}, Cooldown: ${isWaveCooldown}`);

    

    if (wave.number % 8 === 0) {
        showBossWarning();
    }

    if (autoStart) {
        scheduleNextWaveCheck();
    }
}

function scheduleNextWaveCheck() {
    const checkNextWave = () => {
        if (autoStart && !wave.active && enemies.length === 0 && !isWaveCooldown) {
            startWave(); 
        } else if (autoStart) {
            setTimeout(checkNextWave, 1000); 
        }
    };
    setTimeout(checkNextWave, 3000); 
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


function showBossWarning(amount) {
    const popup = document.getElementById('bossWarningPopup');
    popup.textContent = 'Boss Wave Incoming!'; 
    popup.classList.add('show'); 
    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000); 
}
function checkCollision() {
    for (var enemy of enemies) {
        for (var projectile of projectiles) {
            if (CircleInCircle(enemy, projectile)) {
                if (projectile instanceof PiercingProjectile) {
                    if (!projectile.hitEnemies.has(enemy)) {
                        const damage = Math.min(enemy.strength, projectile.strength);

                        enemy.strength -= damage;
                        money += Math.round(damage * 0.5);
                        updateInfo();

                        projectile.hitEnemies.add(enemy);

                        if (enemy.strength <= 0) {
                            enemies.splice(enemies.indexOf(enemy), 1);
                        }
                    }
                } else {
                    const damage = Math.min(enemy.strength, projectile.strength);

                    enemy.strength -= damage;
                    projectile.strength -= damage;
                    money += Math.round(damage * 0.5);
                    updateInfo();

                    // Remove defeated enemies
                    if (enemy.strength <= 0) {
                        enemies.splice(enemies.indexOf(enemy), 1);
                    }

                    // Remove projectiles with no strength left
                    if (projectile.strength <= 0) {
                        projectiles.splice(projectiles.indexOf(projectile), 1);
                    }
                }
            }
        }
    }
}


function mousePressed() {

    let turret = getTurretBeingPlaced();
    if (turret != null) {
        if (turret.isValid()) {
            turret.placed = true;

            // Deduct money after placement
            if (turret.type === 'shooter') {
                money -= turretPrice;
                turretPrice = Math.round(turretPrice * turretPriceIncreaseFactor);
            } else if (turret.type === 'sniper') {
                money -= turretPriceSniper;
                turretPriceSniper = Math.round(turretPriceSniper * sniperPriceIncreaseFactor);
            } else if (turret.type === 'wizard') {
                money -= turretPriceWizard;
                turretPriceWizard = Math.round(turretPriceWizard * wizardPriceIncreaseFactor);
            }

            updateInfo();
            updateTurretMenuText(); 

            document.getElementById("buyTurretText").textContent = "Select a turret to buy";
        } else {
            cancelTurretSelection(turret);
        }
    } else {
        turret = getTurretBeingClicked();
        if (turret != null) {
            turret.selected = true;
        }
    }
}


function keyPressed() {
    let turret = getTurretBeingSelected();
    if (turret != null) {
        if (keyCode === LEFT_ARROW) {
            if (turret.targetMode > 0) {
                turret.targetMode -= 1;
            }
        }

        if (keyCode === RIGHT_ARROW) {
            if (turret.targetMode < 3) { 
                turret.targetMode += 1;
            }
        }
    }
}

function changeTargetMode() {
    let turret = getTurretBeingSelected();
    if (turret != null) {
        turret.targetMode = (turret.targetMode + 1) % 4;  
        checkTargetMode();  
    }
}

function toggleSpeed() {
    if (isCooldown || isWaveCooldown) return; 

    isCooldown = true;
    setTimeout(() => {
        isCooldown = false; 
    }, 50);

    if (gameSpeed === 1) {
        gameSpeed = 1.5;
    } else if (gameSpeed === 1.5) {
        gameSpeed = 2;
    } else {
        gameSpeed = 1;
    }

    wave.gameSpeed = gameSpeed;
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
function unselectAllTurrets() {
    // Filter out unplaced turrets from the array
    turrets = turrets.filter(turret => turret.placed);

    // Update UI or take other necessary actions
    updateInfo();
    document.getElementById("buyText").textContent = "Buy a Turret";
    console.log("Unplaced turrets removed.");
}


function buyTurret(type) {
    const menu = document.getElementById('turretMenu');
    menu.style.display = 'none';

    unselectAllTurrets();

    // Check if there is an unplaced turret
    const unplacedTurretExists = turrets.some(turret => !turret.placed);
    if (unplacedTurretExists) {
        console.log("You must place the current turret before buying another.");
        return;
    }

    // Set up new turret without deducting money
    let newTurret = null;
    if (type === 'shooter') {
        newTurret = new Turret(path.roads);
        newTurret.type = 'shooter';
        turrets.push(newTurret);
    } else if (type === 'sniper') {
        newTurret = new SniperTurret(path.roads);
        newTurret.type = 'sniper';
        turrets.push(newTurret);
    } else if (type === 'wizard') {
        newTurret = new WizardTurret(path.roads);
        newTurret.type = 'wizard';
        turrets.push(newTurret);
    } else {
        console.log("Invalid turret type");
        return;
    }

    updateTurretMenuText();
    document.getElementById("buyText").textContent = "Drag turret out of map to cancel";
}
function mouseDragged() {
    let turret = getTurretBeingPlaced();
    if (turret && !turret.placed) {
        if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
            cancelTurretSelection(turret);
        }
    }
}

function cancelTurretSelection(turret) {
    const turretIndex = turrets.indexOf(turret);
    if (turretIndex > -1) {
        turrets.splice(turretIndex, 1);
        updateInfo();
        document.getElementById("buyText").textContent = "Buy a Turret";
        console.log("Turret selection canceled as it was dragged outside the map.");
    }
}


function updateTurretMenuText() {
    const shooterButton = document.querySelector("#turretMenu button:nth-child(1) span");
    const sniperButton = document.querySelector("#turretMenu button:nth-child(2) span");
    const wizardButton = document.querySelector("#turretMenu button:nth-child(3) span"); 

    shooterButton.textContent = `Buy Shooter - $${turretPrice}`;
    sniperButton.textContent = `Buy Sniper - $${turretPriceSniper}`;
    wizardButton.textContent = `Buy Wizard - $${turretPriceWizard}`; 
}

function checkTargetMode() {
    let turret = getTurretBeingSelected();
    let text = "Targeting Mode: ";
    
    if (turret) {
        if (turret.targetMode === 0) text += "Closest";
        else if (turret.targetMode === 1) text += "Strongest";
        else if (turret.targetMode === 2) text += "Farthest";
        else if (turret.targetMode === 3) text += "Last";
    } else {
        text += "None";
    }

    document.getElementById("targetModeText").textContent = text;
}

function showTurretMenu() {
    const menu = document.getElementById('turretMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}


