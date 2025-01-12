var playing = true;
var sandImg
var levelOneNodes = [
    {x: -100, y: 50},
    {x: 100, y: 50},
    {x: 100, y: 500},
    {x: 400, y: 500},
    {x: 400, y: 200},
    {x: 250, y: 200},
    {x: 250, y: 50},
    {x: 600, y: 50},
    {x: 600, y: 800},
];
 let isEasyMode = false;
 let isHardMode = false;
 let settingsImg;
 let resumeImg;
 let isPaused = false;
 var canvas;
 var path;
 var enemies;
 var powImage;
 var orbImage;
 var enemyImg
 var bombImg, stunImg;
 let normalEnemyImages = [];
 let heavyEnemyImage;
 let fastEnemyImage;
 let bossEnemyImage;
 let bombEnemyImage;
 let stealthEnemyImage;
 let explosionImage;
 var turrets;
 var projectiles;
 var money = 1050;
 var health = isEasyMode ? 200 : isHardMode ? 75 : 100;
 var wave;
 var waveNumber = 1;
 var gameSpeed = 1; 
 var isCooldown = false;
 let isWaveCooldown = false;
 var frameRateBase = 60; 
 var turretPrice = 150; 
 var turretPriceSniper = 300;
 var turretPriceWizard = 400;
 var turretPriceFroster = 350;
 const turretPriceIncreaseFactor = 1.4; 
 const sniperPriceIncreaseFactor = 1.65; 
 const wizardPriceIncreaseFactor = 4;
 const frosterPriceIncreaseFactor = 2.5;
 var autoStart = false;
 var showStartArrow = true; 
 let isPopupActive = false;
 let isGameOver = false;



 function preload() {
    backgroundTile = loadImage('images/map/tile2.png');
    pathTile = loadImage('images/map/pathTile.png');
    powImage = loadImage('images/pow.png'); 
    bombImg = loadImage('images/enemies/bomb.png');
    stunImg = loadImage('images/stun2.png');
    sandImg = loadImage("images/sand.jpg");
    snowballImg = loadImage('images/snowball.png');
    projectileImg = loadImage('images/shooter/shooterProjectile.png');

    for (let i = 1; i <= 3; i++) {
        normalEnemyImages.push(loadImage(`images/enemies/normal${i}.png`));
    }
    heavyEnemyImage = loadImage('images/enemies/heavy1.png');
    fastEnemyImage = loadImage('images/enemies/fast1.png');
    bossEnemyImage = loadImage('images/enemies/boss1.png');
    bombEnemyImage = loadImage('images/enemies/bomb.png');
    explosionImage = loadImage('images/explosion.png');
    stealthEnemyImage = loadImage('images/enemies/stealth.png');

    turretHolderImg = loadImage('images/shooter/greenHolder.png');
    for (let i = 1; i <= 7; i++) {
        turretFrames.push(loadImage(`images/shooter/tile00${i}.png`));
    }

    for (let i = 0; i < 11; i++) {
        let filename = `images/sniper/tile00${i}.png`;
        sniperFrames[i] = loadImage(filename);
    }

    for (let i = 0; i < 11; i++) {
        let filename = `images/wizard/tile00${i}.png`;
        wizardFrames[i] = loadImage(filename);
    }
    wizardHolderImg = loadImage('images/wizard/purpleHolder.png');
    wizardProjectileImage = loadImage('images/wizard/wizardProjectile.png');

    for (let i = 0; i < 11; i++) {
        let filename = `images/froster/tile00${i}.png`;
        frosterFrames[i] = loadImage(filename);
    }
    frosterHolderImg = loadImage('images/froster/blueHolder.png');

    water = loadImage('images/map/water.png');
    rocks = loadImage('images/map/rocks.png');
    cactus = loadImage('images/map/cactus.png');
    sign = loadImage('images/map/sign.png');
    bigRock = loadImage('images/map/bigRock.png');

    settingsImg = loadImage('images/pause.png');
    resumeImg = loadImage('images/resume.png');
}



 function setup() {
    canvas = createCanvas(700, 700).parent("gameCanvas");
    frameRate(frameRateBase); 
    path = new Path(levelOneNodes, pathTile);
    enemies = [];
    turrets = [];
    projectiles = [];
    wave = new Wave();
    updateInfo();

    document.getElementById('turretInfo').style.display = 'none';
    isPopupActive = false;

}

function drawBackground() {
    const tileSize = 50; 
    const tilesX = Math.ceil(width / tileSize);
    const tilesY = Math.ceil(height / tileSize);
    
    for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
            let tileWidth = (x === tilesX - 1) ? width - x * tileSize : tileSize;
            let tileHeight = (y === tilesY - 1) ? height - y * tileSize : tileSize;
            
            image(backgroundTile, 
                  x * tileSize, y * tileSize,
                  tileWidth, tileHeight,
                  0, 0,
                  tileWidth, tileHeight);
        }
    }
    
}

function drawDecorations() {
    push(); 
    translate(300 + water.width / 2, 590 + water.height / 2); 
    image(water, -water.width / 2, -water.height / 2); 
    pop(); 

    push();
    translate(280 + rocks.width / 2, 580 + water.height + rocks.height / 2); 
    image(rocks, -rocks.width / 2, -rocks.height / 2);
    pop();

    push();
    translate(460, 250); 
    image(cactus, 0, 0, cactus.width*0.9, cactus.height*0.9);
    pop();

    push();
    translate(275, 80); 
    image(sign, 0, 0, sign.width*0.7, sign.height*0.7);
    pop();

    push();
    translate(200, 320); 
    image(bigRock, 0, 0, bigRock.width*0.8, bigRock.height*0.8);
    pop();
}

function getDecorationBounds() {
    return [
        { x: 300, y: 590, width: water.width, height: water.height },
        { x: 280, y: 580 + water.height, width: rocks.width, height: rocks.height },
        { x: 460, y: 250, width: cactus.width*0.9, height: cactus.height*0.9 },
        { x: 275, y: 80, width: sign.width * 0.7, height: sign.height * 0.7 },
        { x: 200, y: 320, width: bigRock.width * 0.8, height: bigRock.height * 0.8 },
    ];
}

function onDecoration(x, y) {
    for (const deco of getDecorationBounds()) {
        if (x >= deco.x && x <= deco.x + deco.width &&
            y >= deco.y && y <= deco.y + deco.height) {
            return true;
        }
    }
    return false;
}

function draw() {
    drawBackground();
    drawDecorations();
    path.draw();

    if (showStartArrow) {
        path.drawStartArrow();
    }

    for (var enemy of enemies) {
        if (!isPaused) enemy.update();
        else enemy.draw();
    }

    for (var turret of turrets) {
        if (!isPaused) turret.update();
        else turret.draw();
    }

    for (var projectile of projectiles) {
        if (!isPaused) projectile.update();
        else projectile.draw();
    }

    if (health <= 0) {
        drawGameOver();
    }

    if (isPaused) {
        filter(BLUR, 3);
        push();
        imageMode(CENTER);
        image(resumeImg, width/2, height/2, 100, 100);
        pop();
        return;
    }

    if (!isPaused) {
        filterArrays();
        checkCollision();
        wave.update();

        if (enemies.length > 0 || wave.active) {
            showStartArrow = false;
        }

        push();
        imageMode(CORNER);
        image(settingsImg, width - 60, 10, 60, 60);
        pop();
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
            text = "UPGRADE $";
            if (turret instanceof SniperTurret) {
                text += (turret.upgrades + 2) * 250; 
            } else if (turret instanceof WizardTurret) {
                text += (turret.upgrades + 2) * 260;
            } else if (turret instanceof FrosterTurret) {
                text += (turret.upgrades + 2) * 270;
            } else {
                text += (turret.upgrades + 2) * 120; 
            }
        }
    } else {
        text = "No Turret Selected!";
    }

    const upgradeButton = document.getElementById("upgradeButton");
    upgradeButton.textContent = text;

    const upgradeCost = (turret.upgrades + 2) * (turret instanceof SniperTurret ? 250 : turret instanceof WizardTurret ? 260 : 120);
    if (turret.upgrades >= turret.maxUpgrades || money < upgradeCost) {
        upgradeButton.classList.remove('blue');
        upgradeButton.classList.add('red');
        upgradeButton.disabled = true;
    } else {
        upgradeButton.classList.remove('red');
        upgradeButton.classList.add('blue');
        upgradeButton.disabled = false;
    }
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
    // Set game over flag
    isGameOver = true;
    
    // Add blur to game
    filter(BLUR, 3);
    
    // Draw semi-transparent overlay
    push();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    pop();
    
    // Draw game over text
    push();
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(64);
    text("GAME OVER", width/2, height/2 - 50);
    
    // Draw waves survived text
    textSize(32);
    fill('#FFA500');
    stroke(0);
    strokeWeight(2);
    text(`Waves Survived: ${wave.number}`, width/2, height/2 + 20);
    
    // Draw restart button
    let btnWidth = 200;
    let btnHeight = 60;
    let btnX = width/2 - btnWidth/2;
    let btnY = height/2 + 80;
    
    // Button hover effect
    if (mouseX > btnX && mouseX < btnX + btnWidth &&
        mouseY > btnY && mouseY < btnY + btnHeight) {
        fill('#4CAF50');
    } else {
        fill('#388E3C');
    }
    
    stroke(0);
    strokeWeight(2);
    rect(btnX, btnY, btnWidth, btnHeight, 10);
    
    // Restart text
    fill(255);
    noStroke();
    textSize(24);
    text("RESTART", width/2, btnY + btnHeight/2);
    pop();
}

 function updateInfo() {
    document.getElementById("Money").innerHTML = money;
    document.getElementById("Wave").innerHTML = wave.number;
    document.getElementById("Health").innerHTML = health;
    const turret = getTurretBeingSelected();
    if (turret) {
        showSelectedTurretInfo(turret);
    }
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
  

    wave.start();
    updateInfo();
    

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
                        if (isEasyMode) {
                            money += Math.round(damage * 0.7);
                        } else if (isHardMode) {
                            money += Math.round(damage * 0.4);
                        } else {
                            money += Math.round(damage * 0.5);
                        }
                        updateInfo();

                        projectile.hitEnemies.add(enemy);

                        if (enemy.strength <= 0 && !enemy.isExploding) {
                            enemy.explode(); // Trigger explosion
                        }

                    }
                } else {
                    const damage = Math.min(enemy.strength, projectile.strength);

                    enemy.strength -= damage;
                    projectile.strength -= damage;
                    money += Math.round(damage * 0.5);
                    updateInfo();

                    if (enemy.strength <= 0 && !enemy.isExploding) {
                        enemy.explode(); // Trigger explosion
                    }

                    if (projectile.strength <= 0) {
                        projectiles.splice(projectiles.indexOf(projectile), 1);
                    }
                }
            }
        }
    }
}


function mousePressed() {
    if (isGameOver) {
        let btnWidth = 200;
        let btnHeight = 60;
        let btnX = width/2 - btnWidth/2;
        let btnY = height/2 + 80;
        
        if (mouseX > btnX && mouseX < btnX + btnWidth &&
            mouseY > btnY && mouseY < btnY + btnHeight) {
            restartGame();
            return;
        }
    }
    if (isPaused) {
        // Check for large centered button click
        if (dist(mouseX, mouseY, width/2, height/2) < 50) {
            isPaused = false;
            return;
        }
        return; // Block all other clicks while paused
    }
    
    // Check corner button click
    if (mouseX > width - 50 && mouseX < width - 10 && 
        mouseY > 10 && mouseY < 50) {
        isPaused = true;
        return;
    }

    if (isPopupActive) {

        if (mouseY < 560 && mouseX < 700) {
            let turret = getTurretBeingClicked();
            if (turret) {
                turrets.forEach(t => t.selected = false);
                turret.selected = true;
                showSelectedTurretInfo(turret);
            } else {
                turrets.forEach(t => t.selected = false);
                showSelectedTurretInfo(null);
                console.log("All turret selections canceled (clicked above popup).");
            }
        }
        return; 
    }

    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let turret = getTurretBeingPlaced();

        if (turret != null) {
            if ((turret.type === 'shooter' && money >= turretPrice) ||
                (turret.type === 'sniper' && money >= turretPriceSniper) ||
                (turret.type === 'wizard' && money >= turretPriceWizard) ||
                (turret.type === 'froster' && money >= turretPriceFroster)) {
                
                if (turret.isValid()) {
                    turret.placed = true;

                    if (turret.type === 'shooter') {
                        money -= turretPrice;
                        turretPrice = Math.round(turretPrice * turretPriceIncreaseFactor);
                    } else if (turret.type === 'sniper') {
                        money -= turretPriceSniper;
                        turretPriceSniper = Math.round(turretPriceSniper * sniperPriceIncreaseFactor);
                    } else if (turret.type === 'wizard') {
                        money -= turretPriceWizard;
                        turretPriceWizard = Math.round(turretPriceWizard * wizardPriceIncreaseFactor) + 500;
                    } else if (turret.type === 'froster') {
                        money -= turretPriceFroster;
                        turretPriceFroster = Math.round(turretPriceFroster * frosterPriceIncreaseFactor) + 500;
                    }

                    updateInfo();
                    updateTurretMenuText(); 
                    document.getElementById("buyText").textContent = "Buy a Turret";
                } else {
                    cancelTurretSelection(turret);
                }
            } else {
                console.log("Not enough money to place turret!");
                document.getElementById("buyText").textContent = "Not enough money!";
            }
        } else {
            turret = getTurretBeingClicked();
            if (turret != null) {
                turrets.forEach(t => t.selected = false);
                turret.selected = true;
                showSelectedTurretInfo(turret);
            } else {
                turrets.forEach(t => t.selected = false);
                showSelectedTurretInfo(null);
                console.log("All turret selections canceled.");
            }
        }
    }
}

function keyPressed() {
    if (keyCode === ESCAPE) {
        isPaused = !isPaused;
        return;
    }
    
    if (isPaused) return; 
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
    turrets = turrets.filter(turret => turret.placed);

    updateInfo();
    document.getElementById("buyText").textContent = "Buy a Turret";
    console.log("Unplaced turrets removed.");
}


function buyTurret(type) {
    const menu = document.getElementById('turretMenu');
    menu.style.display = 'none';

    unselectAllTurrets();

    const unplacedTurretExists = turrets.some(turret => !turret.placed);
    if (unplacedTurretExists) {
        console.log("You must place the current turret before buying another.");
        return;
    }

    let newTurret = null;
    let price = 0;

    const buyTextElement = document.getElementById("buyText");

    if (type === 'shooter') {
        price = turretPrice;
        if (money < price) {
            console.log("Not enough money to buy Shooter Turret!");
            buyTextElement.textContent = "Not enough money!";
            setTimeout(() => {
                buyTextElement.textContent = "Buy a Turret";
            }, 1000); 
            return;
        }
        newTurret = new Turret(path.roads);
        newTurret.type = 'shooter';
    } else if (type === 'sniper') {
        price = turretPriceSniper;
        if (money < price) {
            console.log("Not enough money to buy Sniper Turret!");
            buyTextElement.textContent = "Not enough money!";
            setTimeout(() => {
                buyTextElement.textContent = "Buy a Turret";
            }, 1000);
            return;
        }
        newTurret = new SniperTurret(path.roads);
        newTurret.type = 'sniper';
    } else if (type === 'wizard') {
        price = turretPriceWizard;
        if (money < price) {
            console.log("Not enough money to buy Wizard Turret!");
            buyTextElement.textContent = "Not enough money!";
            setTimeout(() => {
                buyTextElement.textContent = "Buy a Turret";
            }, 1000);
            return;
        }
        newTurret = new WizardTurret(path.roads);
        newTurret.type = 'wizard';
    } else if (type === 'froster') {
        price = turretPriceFroster;
        if (money < price) {
            console.log("Not enough money to buy Froster Turret!");
            buyTextElement.textContent = "Not enough money!";
            setTimeout(() => {
                buyTextElement.textContent = "Buy a Turret";
            }, 1000);
            return;
        }
        newTurret = new FrosterTurret(path.roads); 
        newTurret.type = 'froster';
    } else {
        console.log("Invalid turret type");
        return;
    }

    turrets.push(newTurret);

    updateTurretMenuText();
    updateInfo();
    buyTextElement.textContent = "Drag turret to garbage bin to cancel";
}



function mouseDragged() {
    console.log('mouseDragged called');
    let turret = getTurretBeingPlaced();
    if (turret && !turret.placed && !isPopupActive) { 
        if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
            console.log('Cancelling turret selection');
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

        const infoDiv = document.getElementById('turretInfo');
        infoDiv.style.display = 'none';
        isPopupActive = false;
    }
}


function updateTurretMenuText() {
    const shooterButton = document.querySelector("#turretMenu button:nth-child(1) span");
    const sniperButton = document.querySelector("#turretMenu button:nth-child(2) span");
    const wizardButton = document.querySelector("#turretMenu button:nth-child(3) span"); 
    const frosterButton = document.querySelector("#turretMenu button:nth-child(4) span"); 


    shooterButton.textContent = `Buy Shooter - $${turretPrice}`;
    sniperButton.textContent = `Buy Sniper - $${turretPriceSniper}`;
    wizardButton.textContent = `Buy Wizard - $${turretPriceWizard}`; 
    frosterButton.textContent = `Buy Froster - $${turretPriceFroster}`; 
}

function checkTargetMode() {
    let turret = getTurretBeingSelected();
    let text = "Targeting Mode: ";
    
    if (turret) {
        if (turret.targetMode === 0) text += "Closest";
        else if (turret.targetMode === 1) text += "Strongest";
        else if (turret.targetMode === 2) text += "First";
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


function showSelectedTurretInfo(turret) {
    const infoDiv = document.getElementById('turretInfo');
    const header = document.getElementById('turretDetailsHeader');
    if (!turret) {
        infoDiv.style.display = 'none';
        isPopupActive = false;
        return;
    }
    infoDiv.style.display = 'flex';
    isPopupActive = true;
    header.textContent = `${turret.type.charAt(0).toUpperCase() + turret.type.slice(1)} Details`;
    const stats = populateStats(); 
    const turretStats = stats.find(s => s.name.toLowerCase() === turret.type);
    if (!turretStats) {
        console.error("No stats found for turret type:", turret.type);
        return;
    }

    const level = turret.upgrades + 1;
    const range = turretStats.baseRange + turret.upgrades * (turret.type === "wizard" ? 30 : 50);
    const strength = turretStats.baseStrength + turret.upgrades *
        (turret.type === "sniper" ? (4 + level) : turret.type === "wizard" ? (2 + level) : turret.type === "froster" ? 1 : 1);
    const cooldown = turretStats.baseCooldown - turret.upgrades *
        (turret.type === "sniper" ? 8 : turret.type === "wizard" ? 5 : turret.type === "froster" ? 8 : 3);
    const specialAbility = (turret.type === "wizard" && turret.upgrades >= 2) ? "+ Immune to Stun" :
                           (turret.type === "froster" && turret.upgrades >= 2) ? "+ Stun Enemies" :
                           turretStats.ability;

    document.getElementById('turretCurrentStats').innerHTML = `
        Level: ${level}<br>
        Range: ${range}<br>
        Damage: ${strength}<br>
        Cooldown: ${cooldown}<br>
        Special Ability: ${specialAbility}
    `;

    let nextText = "Maxed Out";
    if (level < 4) {
        const nextRange = range + (turret.type === "wizard" ? 30 : turret.type === "froster" ? 10 : 50);
        const nextStrength = strength + (turret.type === "sniper" ? (4 + level + 1) : turret.type === "wizard" ? (2 + level + 1) : turret.type === "froster" ? 1 : 1);
        const nextCooldown = cooldown - (turret.type === "sniper" ? 8 : turret.type === "wizard" ? 5 : turret.type === "froster" ? 8 : 3);
        let nextSpecialAbility = turretStats.ability;
        if (turret.type === "wizard" && level === 2) {
            nextSpecialAbility = "+ Immune to Stun";
        } else if (turret.type === "froster" && level === 2) {
            nextSpecialAbility = "+ Freeze and Slow Enemies";
        }
        nextText = `
            Next Level:<br>
            → Range: ${nextRange}<br>
            → Damage: ${nextStrength}<br>
            → Cooldown: ${nextCooldown}<br>
            → Special Ability: ${nextSpecialAbility}
        `;
    }
    document.getElementById('turretNextStats').innerHTML = nextText;

    checkUpgrade();

    const upgradeButton = document.getElementById('upgradeButton');
    const upgradeCost = (level < 4) ? turretStats.upgradeCost(level) : "Maxed";
    if (typeof upgradeCost === 'number' && money >= upgradeCost && level < 4) {
        upgradeButton.classList.remove('red');
        upgradeButton.classList.add('blue');
        upgradeButton.disabled = false;
    } else {
        upgradeButton.classList.remove('blue');
        upgradeButton.classList.add('red');
        upgradeButton.disabled = true;
    }

    const sellButton = document.getElementById('sellButton');
    const initialPrice = turret.type === 'sniper' ? 300 : turret.type === 'wizard' ? 400 : turret.type === 'frost' ? 350 : 150;
    const totalSpent = initialPrice + turret.upgrades * (turret.type === 'sniper' || turret.type === 'wizard' || turret.type === 'frost' ? 250 : 120);
    const sellPrice = Math.round(totalSpent * 0.8);
    sellButton.textContent = `Sell for $${sellPrice}`;

    const damageCounter = document.querySelector('.damage-counter');
    if (damageCounter) {
        damageCounter.textContent = `Damage: ${Math.round(turret.totalDamage)}`;
    }
}

function sellTurret() {
    const turret = getTurretBeingSelected();
    if (!turret) return;

    const initialPrice = turret.type === 'sniper'
        ? 300
        : turret.type === 'wizard'
            ? 400
            : turret.type === 'frost'
                ? 350
                : 150;
    const upgradeCost = (turret.type === 'sniper' || turret.type === 'wizard' || turret.type === 'frost') ? 250 : 120;
    const totalSpent = initialPrice + turret.upgrades * upgradeCost;

    const sellPrice = Math.round(totalSpent * 0.8);
    money += sellPrice;

    const turretIndex = turrets.indexOf(turret);
    if (turretIndex > -1) {
        turrets.splice(turretIndex, 1);
    }

    if (turret.type === 'shooter') {
        turretPrice = Math.round(turretPrice / turretPriceIncreaseFactor);
    } else if (turret.type === 'sniper') {
        turretPriceSniper = Math.round(turretPriceSniper / sniperPriceIncreaseFactor);
    } else if (turret.type === 'wizard') {
        turretPriceWizard = Math.round((turretPriceWizard - 500)/ wizardPriceIncreaseFactor);
    } else if (turret.type === 'frost') {
        turretPriceFroster = Math.round((turretPriceFroster - 500)/ frostPriceIncreaseFactor);
    }

    updateInfo();
    updateTurretMenuText();
    showSelectedTurretInfo(null);
}

function sellTurret() {
    const turret = getTurretBeingSelected();
    if (!turret) return;

    const initialPrice = turret.type === 'sniper'
        ? 300
        : turret.type === 'wizard'
            ? 400
            : turret.type === 'froster'
                ? 350
                : 150;
    const upgradeCost = (turret.type === 'sniper' || turret.type === 'wizard' || turret.type === 'froster') ? 250 : 120;
    const totalSpent = initialPrice + turret.upgrades * upgradeCost;

    const sellPrice = Math.round(totalSpent * 0.8);
    money += sellPrice;

    const turretIndex = turrets.indexOf(turret);
    if (turretIndex > -1) {
        turrets.splice(turretIndex, 1);
    }

    if (turret.type === 'shooter') {
        turretPrice = Math.round(turretPrice / turretPriceIncreaseFactor);
    } else if (turret.type === 'sniper') {
        turretPriceSniper = Math.round(turretPriceSniper / sniperPriceIncreaseFactor);
    } else if (turret.type === 'wizard') {
        turretPriceWizard = Math.round((turretPriceWizard - 500)/ wizardPriceIncreaseFactor);
    } else if (turret.type === 'froster') {
        turretPriceFroster = Math.round((turretPriceFroster - 500)/ frosterPriceIncreaseFactor);
    }

    updateInfo();
    updateTurretMenuText();
    showSelectedTurretInfo(null);
}

function restartGame() {
    isGameOver = false;
    isPaused = false;
    autoStart = false;
    showStartArrow = true;
    isPopupActive = false;
    

    money = 1050;
    health = 100; 
    gameSpeed = 1;
    waveNumber = 0; 
    wave = new Wave();
    enemies = [];
    turrets = [];
    projectiles = [];
    
    turretPrice = 150;
    turretPriceSniper = 300;
    turretPriceWizard = 400;
    turretPriceFroster = 350;
    
    isEasyMode = false;
    isHardMode = false;
    
    const difficultyScreen = document.getElementById('difficultyScreen');
    difficultyScreen.style.display = 'flex';
    
    const turretInfo = document.getElementById('turretInfo');
    turretInfo.style.display = 'none';
    
    const turretMenu = document.getElementById('turretMenu');
    if (turretMenu) turretMenu.style.display = 'none';
    
    updateInfo();
    updateTurretMenuText();
    updateWaveButtonText();
    
    draw();
}

document.addEventListener('DOMContentLoaded', () => {
    const upgradeButton = document.getElementById('upgradeButton');
    const sellButton = document.getElementById('sellButton');
    const turretInfo = document.getElementById('turretInfo');
    const difficultyScreen = document.getElementById('difficultyScreen');
    const easyButton = document.getElementById('easyButton');
    const normalButton = document.getElementById('normalButton');
    const hardButton = document.getElementById('hardButton');

  
    easyButton.addEventListener('click', () => {
      isEasyMode = true;
      health = 2;
      difficultyScreen.style.display = 'none';
      updateInfo();
    });
  
    normalButton.addEventListener('click', () => {
      isEasyMode = false;
      difficultyScreen.style.display = 'none';
      updateInfo();
    });

    hardButton.addEventListener('click', () => {
        isHardMode = true;
        isEasyMode = false;
        health = 75;
        difficultyScreen.style.display = 'none';
        updateInfo();
    });

    turretInfo.addEventListener('click', (event) => {
        console.log('Popup clicked');
        event.stopPropagation();
    });
    
    upgradeButton.addEventListener('click', (event) => {
        console.log('Upgrade button clicked');
        event.preventDefault();
        upgradeTurret();
        updateInfo();
    });
    
    sellButton.addEventListener('click', (event) => {
        console.log('Sell button clicked');
        event.preventDefault();
        sellTurret();
    });
});