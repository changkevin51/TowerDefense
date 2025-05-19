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
    {x: 700, y: 50},
    {x: 700, y: 250},
    {x: 600, y: 250},
    {x: 600, y: 650},
    {x: 800, y: 650},
];
// console.log('Database URL:', process.env.DATABASE_URL);
window.userSubmittedScore = false;
window.userDisplayName = '';

 var isEasyMode = false;
 var isHardMode = false;
 var settingsImg;
 var resumeImg;
 var isPaused = false;
 var canvas;
 var path;
 var enemies;
 var powImage;
 var orbImage;
 var enemyImg
 var bombImg, stunImg;
 var heavyEnemyImage;
 var fastEnemyImage;
 var bombEnemyImage;
 var stealthEnemyImage;
 var explosionImage;
 var healingImage;
 var turrets;
 var projectiles;
 var money = 1050;
 var health = isEasyMode ? 200 : isHardMode ? 75 : 100;
 var wave;
 var waveNumber = 1;
 var gameSpeed = 1; 
 var isCooldown = false;
 var isWaveCooldown = false;
 var frameRateBase = 60;  var turretPrice = 150; 
 var turretPriceSniper = 300;
 var turretPriceWizard = 400;
 var turretPriceFroster = 350;
 var turretPriceMachinegun = 350;
 const turretPriceIncreaseFactor = 1.4; 
 const sniperPriceIncreaseFactor = 1.65; 
 const wizardPriceIncreaseFactor = 4;
 const frosterPriceIncreaseFactor = 2.5;
 const machinegunPriceIncreaseFactor = 1.8;
 var autoStart = false;
 var showStartArrow = true; 
 var isPopupActive = false;
 var isGameOver = false;

let robo1FrontFrames = [];
let robo1RightFrames = [];
let robo1BackFrames = [];
let robo2FrontFrames = [];
let robo2RightFrames = [];
let robo2BackFrames = [];
let robo3FrontFrames = [];
let robo3RightFrames = [];
let robo3BackFrames = [];
let heavyFrontFrames = [];
let heavyRightFrames = [];
let heavyBackFrames = [];
let fastFrontFrames = [];
let fastRightFrames = [];
let fastBackFrames = [];
let stealthFrontFrames = [];
let stealthRightFrames = [];
let stealthBackFrames = [];
let bossFrontFrames = [];
let bossRightFrames = [];
let bossBackFrames = [];
let miniboss1FrontFrames = [];
let miniboss1RightFrames = [];
let miniboss1BackFrames = [];
let miniboss2FrontFrames = [];
let miniboss2RightFrames = [];
let miniboss2BackFrames = [];
let miniboss3FrontFrames = [];
let miniboss3RightFrames = [];
let miniboss3BackFrames = [];
let bombFrames = [];
let explosionFrames = [];
let hoveredTurret = null;

 function preload() {
    backgroundTile = loadImage('images/map/tile2.png');
    pathTile = loadImage('images/map/pathTile.png');
    powImage = loadImage('images/pow.png'); 
    stunImg = loadImage('images/stun2.png');
    healingImage = loadImage('images/healing.png');
    sandImg = loadImage("images/sand.jpg");
    snowballImg = loadImage('images/snowball.png');
    projectileImg = loadImage('images/shooter/shooterProjectile.png');

    bombEnemyImage = loadImage('images/enemies/bomb.png');
    explosionImage = loadImage('images/explosion.png');
    healerEnemyImage = loadImage('images/enemies/healer.png');

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
    wizardProjectileImage = loadImage('images/wizard/wizardProjectile.png');    for (let i = 0; i < 11; i++) {
        let filename = `images/froster/tile00${i}.png`;
        frosterFrames[i] = loadImage(filename);
    }
    frosterHolderImg = loadImage('images/froster/blueHolder.png');

    // Load machine gun images
    machinegunHolderImg = loadImage('images/machinegun/redHolder.png');
    for (let i = 0; i <= 7; i++) {
        machinegunFrames.push(loadImage(`images/machinegun/tile00${i}.png`));
    }

    water = loadImage('images/map/water.png');
    rocks = loadImage('images/map/rocks.png');
    cactus = loadImage('images/map/cactus.png');
    cactus2 = loadImage('images/map/cactus2.png');
    sign = loadImage('images/map/sign.png');
    bigRock = loadImage('images/map/bigRock.png');

    settingsImg = loadImage('images/pause.png');
    resumeImg = loadImage('images/resume.png');

    for (let i = 0; i < 3; i++) {
        robo1FrontFrames.push(loadImage(`images/enemies/robo1/front00${i}.png`));
        robo1RightFrames.push(loadImage(`images/enemies/robo1/right00${i}.png`));
        robo1BackFrames.push(loadImage(`images/enemies/robo1/back00${i}.png`));
    }

    for (let i = 0; i < 3; i++) {
        robo2FrontFrames.push(loadImage(`images/enemies/robo2/front00${i}.png`));
        robo2RightFrames.push(loadImage(`images/enemies/robo2/right00${i}.png`));
        robo2BackFrames.push(loadImage(`images/enemies/robo2/back00${i}.png`));

        robo3FrontFrames.push(loadImage(`images/enemies/robo3/front00${i}.png`));
        robo3RightFrames.push(loadImage(`images/enemies/robo3/right00${i}.png`));
        robo3BackFrames.push(loadImage(`images/enemies/robo3/back00${i}.png`));
    }

    for (let i = 0; i < 3; i++) {
        heavyFrontFrames.push(loadImage(`images/enemies/tank/front00${i}.png`));
        heavyRightFrames.push(loadImage(`images/enemies/tank/right00${i}.png`));
        heavyBackFrames.push(loadImage(`images/enemies/tank/back00${i}.png`));
    }

    for (let i = 0; i < 3; i++) {
        fastFrontFrames.push(loadImage(`images/enemies/fast/front00${i}.png`));
        fastRightFrames.push(loadImage(`images/enemies/fast/right00${i}.png`));
        fastBackFrames.push(loadImage(`images/enemies/fast/back00${i}.png`));
    }

    for (let i = 0; i < 3; i++) {
        stealthFrontFrames.push(loadImage(`images/enemies/stealth/front00${i}.png`));
        stealthRightFrames.push(loadImage(`images/enemies/stealth/right00${i}.png`));
        stealthBackFrames.push(loadImage(`images/enemies/stealth/back00${i}.png`));
    }

    for (let i = 0; i < 6; i++) {
        bossFrontFrames.push(loadImage(`images/enemies/boss/front00${i}.png`));
        bossRightFrames.push(loadImage(`images/enemies/boss/right00${i}.png`));
        bossBackFrames.push(loadImage(`images/enemies/boss/back00${i}.png`));
    }

    for (let i = 0; i < 6; i++) {
        miniboss1FrontFrames.push(loadImage(`images/enemies/miniboss1/front00${i}.png`));
        miniboss1RightFrames.push(loadImage(`images/enemies/miniboss1/right00${i}.png`));
        miniboss1BackFrames.push(loadImage(`images/enemies/miniboss1/back00${i}.png`));

        miniboss2FrontFrames.push(loadImage(`images/enemies/miniboss2/front00${i}.png`));
        miniboss2RightFrames.push(loadImage(`images/enemies/miniboss2/right00${i}.png`));
        miniboss2BackFrames.push(loadImage(`images/enemies/miniboss2/back00${i}.png`));

        miniboss3FrontFrames.push(loadImage(`images/enemies/miniboss3/front00${i}.png`));
        miniboss3RightFrames.push(loadImage(`images/enemies/miniboss3/right00${i}.png`));
        miniboss3BackFrames.push(loadImage(`images/enemies/miniboss3/back00${i}.png`));
    }

    for (let i = 0; i < 6; i++) {
        bombFrames.push(loadImage(`images/enemies/bomb/frame${i}.png`));
    }

    for (const type in turretsStaticInfo) {
        if (turretsStaticInfo.hasOwnProperty(type)) {
            turretsStaticInfo[type].pImage = loadImage(turretsStaticInfo[type].image);
        }
    }
}

 function setup() {
    canvas = createCanvas(800, 700).parent("gameCanvas");
    frameRate(frameRateBase); 
    path = new Path(levelOneNodes, pathTile);
    enemies = [];
    turrets = [];
    projectiles = [];
    wave = new Wave();
    updateInfo();

    document.getElementById('turretInfo').style.display = 'none';
    isPopupActive = false;

    document.getElementById('buyText').innerHTML = `Buy Turret <img src="images/turret.png" alt="Buy Turret" style="width: 20px; height: 20px; vertical-align: middle;">`;

    const turretHoverInfo = document.createElement('div');
    turretHoverInfo.className = 'turret-hover-info';
    turretHoverInfo.innerHTML = `
        <div class="turret-hover-title">Turret Info</div>
        <div class="turret-hover-stats">
            <div class="turret-hover-label">Level:</div>
            <div class="turret-hover-value">1</div>
            <div class="turret-hover-label">Damage:</div>
            <div class="turret-hover-value">10</div>
            <div class="turret-hover-label">Range:</div>
            <div class="turret-hover-value">150</div>
            <div class="turret-hover-label">Fire Rate:</div>
            <div class="turret-hover-value">Medium</div>
        </div>
    `;
    document.getElementById('gameCanvas').appendChild(turretHoverInfo);

    let hoveredTurret = null;
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
    translate(460, 200); 
    image(cactus, 0, 0, cactus.width*0.9, cactus.height*0.9);
    pop();

    push();
    translate(650, 490); 
    image(cactus2, 0, 0, cactus2.width*0.9, cactus2.height*0.9);
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
        { x: 460, y: 200, width: cactus.width*0.9, height: cactus.height*0.9 },
        { x: 670, y: 490, width: cactus2.width*0.9, height: cactus2.height*0.9 },
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

    if (isPlacingTurret && selectedTurretType) {
        drawPlacementPreview(mouseX, mouseY);
    }

    if (health <= 0) {
        drawGameOver();
    }

    if (isPaused) {
        push();
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        pop();
        
        // Draw pause menu
        push();
        fill(50, 50, 50, 200);
        stroke(255, 165, 0);
        strokeWeight(3);
        rect(width/2 - 150, height/2 - 150, 300, 300, 15);
        
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text("GAME PAUSED", width/2, height/2 - 100);
        
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 - 50 && mouseY < height/2) {
            fill(76, 175, 80);  
        } else {
            fill(56, 142, 60);  
        }
        rect(width/2 - 100, height/2 - 50, 200, 50, 10);
        
        fill(255);
        textSize(20);
        text("RESUME", width/2, height/2 - 25);
        
        // Restart button
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 + 20 && mouseY < height/2 + 70) {
            fill(244, 67, 54);  
        } else {
            fill(198, 40, 40);  
        }
        rect(width/2 - 100, height/2 + 20, 200, 50, 10);
        
        fill(255);
        textSize(20);
        text("RESTART", width/2, height/2 + 45);
        
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

    updateTurretHoverInfo();
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

function filterArrays() {
    enemies = enemies.filter(e => e.finished == false && e.strength > 0);
    projectiles = projectiles.filter(p => p.inWorld() && p.strength > 0);
}

function drawPlacementPreview(x, y) {
    if (!selectedTurretType || !turretsStaticInfo[selectedTurretType]) return;

    const turretPreviewInfo = turretsStaticInfo[selectedTurretType];
    const turretImage = turretPreviewInfo.pImage; 
    
    const turretSize = getTurretTypeSize(selectedTurretType);
    const range = turretPreviewInfo.stats.baseRange || parseFloat(turretPreviewInfo.stats.range.split('-')[0]) || 150;

    const canPlace = isValidPlacementLocation(x, y, selectedTurretType);

    push();
    if (selectedTurretType !== 'machinegun') {
        noFill();
        if (canPlace) {
            stroke(0, 255, 0, 150); 
        } else {
            stroke(255, 0, 0, 150); 
        }
        strokeWeight(2);
        ellipse(x, y, range * 2);
    }

    if (turretImage) {
        imageMode(CENTER);
        if (!canPlace) {
            tint(255, 0, 0, 150); 
        } else {
            noTint();
        }
        image(turretImage, x, y, turretSize, turretSize);
        noTint(); 
        imageMode(CORNER); 
    }
    pop();
}

function getTurretTypeSize(type) {
    switch(type) {
        case 'shooter':
            return 100;  
        case 'sniper':
            return 120;  
        case 'wizard':
            return 130; 
        case 'froster':
            return 120;  
        case 'machinegun':
            return 110;
        default:
            return 70;  
    }
}

function isValidPlacementLocation(x, y, turretType) {
    const turretSize = turretsStaticInfo[turretType]?.size || 50; 

    if (path.onPath(x, y, turretSize / 2)) {
        return false;
    }
    if (onDecoration(x - turretSize / 2, y - turretSize / 2) || onDecoration(x + turretSize / 2, y - turretSize / 2) || onDecoration(x - turretSize / 2, y + turretSize / 2) || onDecoration(x + turretSize / 2, y + turretSize / 2) || onDecoration(x,y)) {
        return false;
    }
    if (getTurretAt(x, y)) { 
        return false;
    }
    return true;
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
    isGameOver = true;
    filter(BLUR, 3);

    push();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    pop();

    push();
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(64);
    text("GAME OVER", width/2, height/2 - 50);

    textSize(32);
    fill('#FFA500');
    stroke(0);
    strokeWeight(2);
    text(`Waves Survived: ${wave.number}`, width/2, height/2 + 20);

    let btnWidth = 200;
    let btnHeight = 60;
    let btnX = width/2 - btnWidth/2;
    let btnY = height/2 + 80;
    
    if (mouseX > btnX && mouseX < btnX + btnWidth &&
        mouseY > btnY && mouseY < btnY + btnHeight) {
        fill('#4CAF50');
    } else {
        fill('#388E3C');
    }
    
    stroke(0);
    strokeWeight(2);
    rect(btnX, btnY, btnWidth, btnHeight, 10);
    
    fill(255);
    noStroke();
    textSize(24);
    text("RESTART", width/2, btnY + btnHeight/2);
    pop();
    if (waveNumber >= 25) {
        promptLeaderboardIfEligible();
    }
}

 function updateInfo() {
    document.getElementById("Money").innerHTML = money;
    document.getElementById("Wave").innerHTML = wave.number;
    document.getElementById("Health").innerHTML = health;
    
    // Update shop stats if shop is open
    const shopMoney = document.getElementById("shopMoney");
    const shopHealth = document.getElementById("shopHealth");
    const shopWave = document.getElementById("shopWave");
    
    if (shopMoney) shopMoney.innerHTML = `$${money}`;
    if (shopHealth) shopHealth.innerHTML = health;
    if (shopWave) shopWave.innerHTML = waveNumber;
    
    const turret = getTurretBeingSelected();
    if (turret) {
        showSelectedTurretInfo(turret);
    }
 }

 function startWave() {
    if (wave.active || enemies.length > 0) {
        return; 
    }
    isWaveCooldown = true; 
    setTimeout(() => {
        isWaveCooldown = false;
    }, 1500);
    wave.start();
    updateInfo();
    if (wave.number % 5 === 0) {
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
        let btnX = width / 2 - btnWidth / 2;
        let btnY = height / 2 + 80;
        if (mouseX > btnX && mouseX < btnX + btnWidth &&
            mouseY > btnY && mouseY < btnY + btnHeight) {
            restartGame();
            return;
        }
    }

    if (isPaused) {
        // Resume button
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 - 50 && mouseY < height/2) {
            togglePause();
            return;
        }
        
        // Restart button
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 + 20 && mouseY < height/2 + 70) {
            restartGame();
            return;
        }
        
        return; // Prevent other actions while paused
    }

    if (mouseX > width - 60 && mouseX < width && mouseY > 10 && mouseY < 70 && !isPopupActive && !isGameOver) {
        togglePause();
        return;
    }

    if (isPaused) return;

    if (isPlacingTurret && selectedTurretType) {
        if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
            placeSelectedTurret(mouseX, mouseY);
        } else {
            closeTurretShop(true); // Cancel placement
        }
        return;
    }

    // if (mouseX > width - 50 && mouseX < width - 10 && mouseY > 10 && mouseY < 50) {
    //     isPaused = true;
    //     return;
    // }

    if (isPopupActive) { 
        const turretInfoPopup = document.getElementById('turretInfo');
        const isClickInsidePopup = turretInfoPopup.contains(event.target);

        if (!isClickInsidePopup && mouseY < 560 && mouseX < 800) { 
            turrets.forEach(t => t.selected = false);
            showSelectedTurretInfo(null);
            // console.log("All turret selections canceled (clicked outside popup).");
        } else {
            return;
        }

        return; 
    }


    // This block handles clicking on existing turrets or empty ground
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        // The old logic for getTurretBeingPlaced() is removed as new system handles placement differently.
        // Now, if not placing a turret, a click either selects an existing turret or does nothing.
        let clickedTurret = getTurretAt(mouseX, mouseY); // getTurretAt should be getTurretBeingClicked
        if (clickedTurret) {
            turrets.forEach(t => t.selected = (t === clickedTurret));
            showSelectedTurretInfo(clickedTurret);
        } else {
            // Clicked on empty ground, deselect any selected turret
            turrets.forEach(t => t.selected = false);
            showSelectedTurretInfo(null);
            // console.log("All turret selections canceled (clicked on empty ground).");
        }
    }
}


function placeSelectedTurret(x, y) {
    if (!selectedTurretType || !isPlacingTurret) return;

    const turretInfo = turretsStaticInfo[selectedTurretType];
    const currentCost = getCurrentTurretCost(selectedTurretType);

    if (money < currentCost) {
        showTemporaryMessage("Not enough money!", "error");
        return;
    }

    if (!isValidPlacementLocation(x, y, selectedTurretType)) {
        showTemporaryMessage("Cannot place turret here!", "error");
        return;
    }    let newTurret;
    switch (selectedTurretType) {
        case 'shooter':
            newTurret = new Turret('shooter', x, y, projectileImg, turretFrames[0], turretFrames, turretHolderImg, path.roads);
            break;
        case 'sniper':
            newTurret = new SniperTurret(x, y, sniperFrames, path.roads);
            break;
        case 'wizard':
            newTurret = new WizardTurret(x, y, wizardFrames, wizardHolderImg, wizardProjectileImage, path.roads);
            break;
        case 'froster':
            newTurret = new FrosterTurret(x, y, frosterFrames, frosterHolderImg, snowballImg, path.roads);
            break;
        case 'machinegun':
            newTurret = new MachineGunTurret(x, y, machinegunFrames, machinegunHolderImg, projectileImg, path.roads);
            break;
        default:
            console.error("Unknown turret type in placeSelectedTurret:", selectedTurretType);
            closeTurretShop(true);
            return;
    }


    money -= currentCost;
    updateDynamicTurretPrice(selectedTurretType);
    turrets.push(newTurret);
    updateInfo();
    // console.log(`${turretInfo.name} placed at (${x}, ${y}). Money left: ${money}. New price for ${selectedTurretType}: ${getCurrentTurretCost(selectedTurretType)}`);

    isPlacingTurret = false;
    selectedTurretType = null;
    document.getElementById('gameCanvas').style.cursor = 'default';
}

function getTurretAt(x, y) {
    for (var turret of turrets) {
        if (dist(x, y, turret.x, turret.y) < turret.size / 2) { 
            return turret;
        }
    }
    return null;
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
    turrets.forEach(t => t.selected = false);

    updateInfo(); // Update UI if deselection affects it
    // console.log("All turrets deselected / Unplaced turrets removed (if any).");
}


function mouseDragged() {
    // console.log('mouseDragged called'); // Keep for debugging if needed
    if (isPlacingTurret && selectedTurretType) { 
        if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
            // console.log('Cancelling turret selection due to dragging outside map');
            closeTurretShop(true); // Cancel placement
        }
    }
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

/* // Old showTurretMenu - new shop uses handleBuyTurretClick
function showTurretMenu() {
    const menu = document.getElementById('turretMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
*/
function showSelectedTurretInfo(turret) {
    const infoDiv = document.getElementById('turretInfo');
    const header = document.getElementById('turretDetailsHeader');
    if (!turret) {
        infoDiv.style.display = 'none';
        isPopupActive = false;
        return;
    }

    if (typeof turret.type !== 'string' || turret.type.length === 0) {
        console.error("Cannot show turret info: turret.type is invalid.", turret);
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
        const nextStrength = strength + (turret.type === "sniper" ? (4 + level + 1) : turret.type === "wizard" ? (2 + level + 1) : turret.type === "froster" ? 1 : turret.type === "machinegun" ? 0.6: 1);
        const nextCooldown = cooldown - (turret.type === "sniper" ? 8 : turret.type === "wizard" ? 5 : turret.type === "froster" ? 8 : turret.type === "machinegun" ? 0.5 : 3);
        let nextSpecialAbility = turretStats.ability;
        if (turret.type === "wizard" && level === 2) {
            nextSpecialAbility = "+ Immune to Stun";
        } else if (turret.type === "froster" && level === 2) {
            nextSpecialAbility = "+ Freeze and Slow Enemies";
        } else if (turret.type === "sniper" && level === 2) { // Restored from prior release
            nextSpecialAbility = "+ Target Invisible Enemies and Instant Hit";
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
    let upgradeCost;
    if (level < 4) {
        if (turret.type === 'sniper') {
            upgradeCost = (turret.upgrades + 2) * 250;
        } else if (turret.type === 'wizard') {
            upgradeCost = (turret.upgrades + 2) * 260;
        } else if (turret.type === 'froster') {
            upgradeCost = (turret.upgrades + 2) * 270;
        } else if (turret.type === 'machinegun') {
            upgradeCost = (turret.upgrades + 2) * 180; 
        } else {
            upgradeCost = (turret.upgrades + 2) * 120;
        }
    } else {
        upgradeCost = "Maxed";
    }
    
    if (level < 4) {
        upgradeButton.textContent = `UPGRADE $${upgradeCost}`;
    } else {
        upgradeButton.textContent = "Max Upgrade!";
    }
    
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
    const initialPrice = turret.type === 'sniper' ? 300 : 
                         turret.type === 'wizard' ? 400 : 
                         turret.type === 'froster' ? 350 : 
                         turret.type === 'machinegun' ? 360 : 150;
    
    const upgradeFactor = turret.type === 'sniper' ? 250 : 
                          turret.type === 'wizard' ? 260 : 
                          turret.type === 'froster' ? 270 : 
                          turret.type === 'machinegun' ? 180 : 120;
    
    const totalSpent = initialPrice + turret.upgrades * upgradeFactor;
    const sellPrice = Math.round(totalSpent * 0.8);
    sellButton.textContent = `Sell for $${sellPrice}`;

    const damageCounter = document.querySelector('.damage-counter');
    if (damageCounter) {
        damageCounter.textContent = `Damage: ${Math.round(turret.totalDamage)}`;
    }
}


function sellTurret() {
    const turret = getTurretBeingSelected(); // getTurretBeingSelected should return the currently selected turret
    if (!turret) return;    const initialPrice = turret.type === 'sniper'
        ? 300
        : turret.type === 'wizard'
            ? 400
            : turret.type === 'froster'
                ? 350
                : turret.type === 'machinegun'
                    ? 250
                    : 150;
    const upgradeCost = (turret.type === 'sniper' || turret.type === 'wizard' || turret.type === 'froster' || turret.type === 'machinegun') ? 250 : 120;
    const totalSpent = initialPrice + turret.upgrades * upgradeCost;

    const sellPrice = Math.round(totalSpent * 0.8);
    money += sellPrice;

    const turretIndex = turrets.indexOf(turret);
    if (turretIndex > -1) {
        turrets.splice(turretIndex, 1);
    }    if (turret.type === 'shooter') {
        turretPrice = Math.round(turretPrice / turretPriceIncreaseFactor);
    } else if (turret.type === 'sniper') {
        turretPriceSniper = Math.round(turretPriceSniper / sniperPriceIncreaseFactor);
    } else if (turret.type === 'wizard') {
        turretPriceWizard = Math.round((turretPriceWizard - 500)/ wizardPriceIncreaseFactor);
    } else if (turret.type === 'froster') {
        turretPriceFroster = Math.round((turretPriceFroster - 500)/ frosterPriceIncreaseFactor);
    } else if (turret.type === 'machinegun') {
        turretPriceMachinegun = Math.round(turretPriceMachinegun / machinegunPriceIncreaseFactor);
    }

    updateInfo();
    // updateTurretMenuText(); // Obsolete
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
    if (turretMenu) {
       closeTurretShop(true); 
    }
    
    updateInfo();
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
      health = 200;
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
        health = 20;
        difficultyScreen.style.display = 'none';
        updateInfo();
    });

    turretInfo.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    
    upgradeButton.addEventListener('click', (event) => {
        event.preventDefault();
        upgradeTurret();
        updateInfo();
    });
    
    sellButton.addEventListener('click', (event) => {
        event.preventDefault();
        sellTurret();
    });
});


window.totalDamage = 0;

/*
function openLeaderboard() {
    const popup = document.getElementById('leaderboardPopup');
    popup.style.display = 'block';
    fetchLeaderboardEntries();
}

async function fetchLeaderboardEntries() {
    const loadingDiv = document.querySelector('.leaderboard-loading');
    if (loadingDiv) {
        loadingDiv.style.display = 'block';
    }
    
    try {
        const response = await fetch('/api/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        displayLeaderboardEntries(data);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        document.getElementById('leaderboardContents').innerHTML = 
            '<div class="error-message">Failed to load leaderboard</div>';
    } finally {
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }
}

function closeLeaderboard() {
    const popup = document.getElementById('leaderboardPopup');
    popup.style.display = 'none';
}

function displayLeaderboardEntries(entries) {
    const container = document.getElementById('leaderboardContents');
    container.innerHTML = '';
    
    // Check if user has an entry
    const userEntry = entries.find(entry => entry.player_name === window.userDisplayName);
    if (userEntry) {
        window.userSubmittedScore = true;
        const addEntryButton = document.getElementById('addEntryButton');
        addEntryButton.textContent = '🔄 Update Score';
    }
    
    entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'leaderboard-entry';
        entryDiv.innerHTML = `
            <span class="entry-rank">#${index + 1}</span>
            <span class="entry-name">${entry.player_name}</span>
            <span class="entry-score">Wave ${entry.wave} | DMG: ${entry.damage}</span>
            <span class="entry-date">${new Date(entry.created_at).toLocaleDateString()}</span>
        `;
        container.appendChild(entryDiv);
    });
}
function filterLeaderboard(event) {
    const difficulty = event.target.value;
    const entries = document.querySelectorAll('.leaderboard-entry');
    
    entries.forEach(entry => {
        const entryDifficulty = entry.querySelector('.entry-score').textContent.split('|')[1].trim();
        entry.style.display = (difficulty === 'all' || entryDifficulty === difficulty) ? '' : 'none';
    });
}


function promptLeaderboardIfEligible() {
    if (waveNumber >= 1) {
        const prompt = document.getElementById('leaderboardPrompt');
        prompt.classList.add('show');
        // Hide after 3 seconds
        setTimeout(() => prompt.classList.remove('show'), 3000);
    }
}

async function submitLeaderboardEntry() {
    if (waveNumber < 1) {
        alert('You must reach wave 25 to submit a score!');
        return;
    }

    if (!window.userSubmittedScore) {
        const displayName = prompt('Enter your display name:');
        if (!displayName) return;
        window.userDisplayName = displayName;
    }

    try {
        const response = await fetch('/api/leaderboard', {
            method: window.userSubmittedScore ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player_name: window.userDisplayName,
                wave: waveNumber,
                damage: window.totalDamage,
                difficulty: isHardMode ? 'hard' : (isEasyMode ? 'easy' : 'normal')
            })
        });

        if (response.ok) {
            await fetchLeaderboardEntries();
            showSuccessPopup(window.userSubmittedScore ? 'Score updated!' : 'Score submitted!');
            window.userSubmittedScore = true;
        } else {
            throw new Error('Failed to submit score');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to submit score. Please try again.');
    }
}

function showSuccessPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'success-popup'; 
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 3000);
}
*/
var selectedTurretType = null; // To store the type of turret selected from the shop
var isPlacingTurret = false; // Flag to indicate if user is in turret placement mode

const turretsStaticInfo = {
    shooter: {
        name: "Shooter Turret",
        image: 'images/turrets/shooter.png', // Path for loadImage
        pImage: null, 
        size: 50, 
        stats: { damage: "1-4", range: "150-250", firerate: "Medium", effect: "None", baseRange: 150 } 
    },
    sniper: {
        name: "Sniper Turret",
        image: 'images/turrets/sniper.png',
        pImage: null,
        size: 50,
        stats: { damage: "4-28", range: "400-550", firerate: "Slow", effect: "Instant hit", baseRange: 150 }
    },
    wizard: {
        name: "Wizard Turret",
        image: 'images/turrets/wizard.png',
        pImage: null,
        size: 50,
        stats: { damage: "3-21", range: "400-500", firerate: "Medium", effect: "Piercing projectile", baseRange: 400 }
    },
    froster: {
        name: "Froster Turret",
        image: 'images/turrets/froster.png',
        pImage: null,
        size: 50,
        stats: { damage: "2-5", range: "300-330", firerate: "Medium", effect: "Slows enemies, Freeze", baseRange: 300 }
    },
    machinegun: {
        name: "Machine Gun Turret",
        image: 'images/turrets/machinegun.png',
        pImage: null,
        size: 50,
        stats: { damage: "0.6-2.4", range: "Infinite", firerate: "Very Fast", effect: "Targets mouse cursor", baseRange: Infinity }
    }
};

function getCurrentTurretCost(type) {
    switch (type) {
        case 'shooter': return turretPrice;
        case 'sniper': return turretPriceSniper;
        case 'wizard': return turretPriceWizard;
        case 'froster': return turretPriceFroster;
        case 'machinegun': return turretPriceMachinegun;
        default: return Infinity;
    }
}

function updateDynamicTurretPrice(type) {
    switch (type) {
        case 'shooter':
            turretPrice = Math.round(turretPrice * turretPriceIncreaseFactor);
            break;
        case 'sniper':
            turretPriceSniper = Math.round(turretPriceSniper * sniperPriceIncreaseFactor);
            break;
        case 'wizard':
            turretPriceWizard = Math.round(turretPriceWizard * wizardPriceIncreaseFactor);
            break;
        case 'froster':
            turretPriceFroster = Math.round(turretPriceFroster * frosterPriceIncreaseFactor);
            break;
        case 'machinegun':
            turretPriceMachinegun = Math.round(turretPriceMachinegun * machinegunPriceIncreaseFactor);
            break;
    }
}

// buy turret functionality
function handleBuyTurretClick() {
    const turretMenu = document.getElementById('turretMenu');
    const gameMenu = document.getElementById('gameMenu');
    const menuButtons = document.getElementById('menuButtons');
    if (turretMenu.classList.contains('turret-shop-active')) {
        closeTurretShop();
    } else {
        if (isPopupActive) {
            showSelectedTurretInfo(null);
        }
        turrets.forEach(t => t.selected = false);
        turretMenu.innerHTML = '';
        turretMenu.classList.add('turret-shop-active');
        if (gameMenu) gameMenu.classList.add('shop-open');
        if (menuButtons) {
            Array.from(menuButtons.children).forEach(button => {
                if (button.id !== 'buyText' && button.id !== 'turretMenu') { 
                    button.style.display = 'none';
                }
            });
        }
        const buyTextButton = document.getElementById('buyText');
        if (buyTextButton) buyTextButton.style.display = 'none';
        const shopTitle = document.createElement('div');
        shopTitle.className = 'shop-title';
        shopTitle.textContent = 'TURRET SHOP';
        turretMenu.appendChild(shopTitle);
        const shopHeader = document.createElement('div');
        shopHeader.className = 'turret-shop-header';
        const moneyDisplay = document.createElement('div');
        moneyDisplay.className = 'shop-stat';
        moneyDisplay.innerHTML = `
            <img src="images/money.png" alt="Money">
            <div id="shopMoney" class="shop-stat-value">$${money}</div>
        `;
        const healthDisplay = document.createElement('div');
        healthDisplay.className = 'shop-stat';
        healthDisplay.innerHTML = `
            <img src="images/health.png" alt="Health">
            <div id="shopHealth" class="shop-stat-value">${health}</div>
        `;
        const waveDisplay = document.createElement('div');
        waveDisplay.className = 'shop-stat';
        waveDisplay.innerHTML = `
            <img src="images/wave.png" alt="Wave">
            <div id="shopWave" class="shop-stat-value">${waveNumber}</div>
        `;
        shopHeader.appendChild(moneyDisplay);
        shopHeader.appendChild(healthDisplay);
        shopHeader.appendChild(waveDisplay);
        turretMenu.appendChild(shopHeader);
        const shopGrid = document.createElement('div');
        shopGrid.className = 'turret-shop-grid';
        const turretDescriptions = {
            shooter: "Basic turret with balanced stats. Good for early waves.",
            sniper: "Long-range turret with high damage. Best against strong enemies.",
            wizard: "Area damage turret. Effective against groups of enemies.",
            froster: "Slows down enemies. Great for strategic control.",
            machinegun: "Infinite range, rapid fire turret that shoots where your cursor points. Low damage but very fast."
        };
        for (const type in turretsStaticInfo) {
            const turretInfo = turretsStaticInfo[type];
            const currentCost = getCurrentTurretCost(type);
            const canAfford = money >= currentCost;
            const item = document.createElement('div');
            item.className = 'turret-shop-item';
            if (!canAfford) {
                item.className += ' disabled';
            }
            item.onclick = canAfford ? () => selectTurretToPlace(type) : null;
            const img = document.createElement('img');
            img.src = turretInfo.image;
            img.alt = turretInfo.name;
            const name = document.createElement('div');
            name.className = 'turret-name';
            name.textContent = turretInfo.name;
            const price = document.createElement('div');
            price.className = 'price-tag';
            price.textContent = `$${currentCost}`;
            item.appendChild(img);
            item.appendChild(name);
            item.appendChild(price);
            const tooltip = document.createElement('div');
            tooltip.className = 'turret-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-title">${turretInfo.name}</div>
                <div class="tooltip-description">${turretDescriptions[type]}</div>
                <div class="tooltip-stats">
                    <div class="stat-label">Damage:</div>
                    <div class="stat-value">${turretInfo.stats.damage}</div>
                    
                    <div class="stat-label">Range:</div>
                    <div class="stat-value">${turretInfo.stats.range}</div>
                    
                    <div class="stat-label">Fire Rate:</div>
                    <div class="stat-value">${turretInfo.stats.firerate}</div>
                    
                    <div class="stat-label">Effect:</div>
                    <div class="stat-value">${turretInfo.stats.effect}</div>
                </div>
            `;
            item.appendChild(tooltip);
            shopGrid.appendChild(item);
        }
        turretMenu.appendChild(shopGrid);
        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancelTurretSelectionButton';
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = closeTurretShop;
        turretMenu.appendChild(cancelButton);
    }
}

function selectTurretToPlace(type) {
    const currentCost = getCurrentTurretCost(type);
    if (money >= currentCost) {
        selectedTurretType = type;
        isPlacingTurret = true;
        closeTurretShop(false);
        document.getElementById('gameCanvas').style.cursor = 'copy';
    } else {
        showTemporaryMessage(`Not enough money for ${turretsStaticInfo[type].name}`, "error");
    }
}

function closeTurretShop(resetPlacement = true) {
    const turretMenu = document.getElementById('turretMenu');
    const gameMenu = document.getElementById('gameMenu');
    const menuButtons = document.getElementById('menuButtons');

    turretMenu.classList.remove('turret-shop-active');
    if (gameMenu) gameMenu.classList.remove('shop-open');
    turretMenu.innerHTML = ''; 

    // Restore other general game menu buttons
    if (menuButtons) {
        Array.from(menuButtons.children).forEach(button => {
            if (button.id !== 'turretMenu') {
                button.style.display = ''; 
            }
        });
    }
    // Show the "Buy Turret" button again
    const buyTextButton = document.getElementById('buyText');
    if (buyTextButton) buyTextButton.style.display = '';


    if (resetPlacement) {
        isPlacingTurret = false;
        selectedTurretType = null;
        document.getElementById('gameCanvas').style.cursor = 'default';
    }
}

function showTemporaryMessage(message, type = "info") {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1000';
    popup.style.backgroundColor = type === "error" ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)';
    popup.style.color = 'white';
    document.body.appendChild(popup);
    setTimeout(() => {
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
        }
    }, 3000);
}

function updateTurretHoverInfo() {
    const mouseOverTurret = getTurretBeingHovered();
    const turretHoverInfo = document.querySelector('.turret-hover-info');
    
    if (!turretHoverInfo) return;
    
    if (mouseOverTurret && !isPlacingTurret && !isPopupActive) {
        // Update the hover info content
        const turretType = mouseOverTurret.type || 'shooter';
        const turretStats = populateStats().find(s => s.name.toLowerCase() === turretType);
          if (!turretStats) return;
        
        const level = mouseOverTurret.upgrades + 1;
        
        // Handle range display for different turret types
        let range;
        if (turretType === "machinegun") {
            range = "Infinite";
        } else {
            range = turretStats.baseRange + mouseOverTurret.upgrades * 
                (turretType === "wizard" ? 30 : turretType === "froster" ? 10 : 50);
        }
        
        // Handle strength (damage) calculation
        const strength = turretStats.baseStrength + mouseOverTurret.upgrades *
            (turretType === "sniper" ? (4 + level) : 
             turretType === "wizard" ? (2 + level) : 
             turretType === "froster" ? 1 : 
             turretType === "machinegun" ? 0.3 : 1);
               // Handle cooldown calculation
        const cooldown = turretStats.baseCooldown - mouseOverTurret.upgrades *
            (turretType === "sniper" ? 8 : 
             turretType === "wizard" ? 5 : 
             turretType === "froster" ? 8 : 
             turretType === "machinegun" ? 1 : 3);
        
        // Determine fire rate text based on cooldown
        let fireRateText = "Medium";
        if (cooldown < 10) fireRateText = "Very Fast";
        else if (cooldown < 20) fireRateText = "Fast";
        else if (cooldown < 50) fireRateText = "Medium";
        else if (cooldown > 80) fireRateText = "Slow";
          // Calculate special ability
        const specialAbility = (turretType === "wizard" && mouseOverTurret.upgrades >= 2) ? 
            "Immune to Stun" : (turretType === "froster" && mouseOverTurret.upgrades >= 2) ? 
            "Freeze Enemies" : (turretType === "sniper" && mouseOverTurret.upgrades >= 2) ? 
            "Target Invisible" : (turretType === "machinegun" && mouseOverTurret.upgrades >= 1) ? 
            "Improved Accuracy" : "None";
        
        turretHoverInfo.innerHTML = `
            <div class="turret-hover-title">${turretType.charAt(0).toUpperCase() + turretType.slice(1)} Turret</div>
            <div class="turret-hover-stats">
                <div class="turret-hover-label">Level:</div>
                <div class="turret-hover-value">${level}</div>
                <div class="turret-hover-label">Damage:</div>
                <div class="turret-hover-value">${strength}</div>
                <div class="turret-hover-label">Range:</div>
                <div class="turret-hover-value">${range}</div>
                <div class="turret-hover-label">Fire Rate:</div>
                <div class="turret-hover-value">${fireRateText}</div>
                <div class="turret-hover-label">Special:</div>
                <div class="turret-hover-value">${specialAbility}</div>
                <div class="turret-hover-label">Damage Done:</div>
                <div class="turret-hover-value">${Math.round(mouseOverTurret.totalDamage)}</div>
            </div>
        `;
        
        // Position the hover info near the mouse
        turretHoverInfo.style.left = mouseX + 20 + 'px';
        turretHoverInfo.style.top = mouseY - 100 + 'px';
        turretHoverInfo.style.display = 'block';
        
        hoveredTurret = mouseOverTurret;
    } else if (hoveredTurret !== null) {
        // Hide the hover info if not hovering over a turret
        turretHoverInfo.style.display = 'none';
        hoveredTurret = null;
    }
}

function getTurretBeingHovered() {
    for (var turret of turrets) {
        if (dist(mouseX, mouseY, turret.x, turret.y) < turret.size/2 && turret.placed) {
            return turret;
        }
    }
    return null;
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        // Optionally pause any animations or timers
        showTemporaryMessage("Game Paused", "info");
    } else {
        showTemporaryMessage("Game Resumed", "info");
    }
}