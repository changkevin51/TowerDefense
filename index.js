var playing = true;
var sandImg
var speedBoostEffectImg;
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
let healerFrontFrames = [];
let healerRightFrames = [];
let healerBackFrames = [];
let bossFrontFrames = [];
let bossRightFrames = [];
let bossBackFrames = [];
let shipFrames = [];
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
    speedBoostEffectImg = loadImage('images/effects/speedboost.png');
    bombEnemyImage = loadImage('images/enemies/bomb.png');
    explosionImage = loadImage('images/explosion.png');

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

    for (let i = 0; i < 3; i++) {
        healerFrontFrames.push(loadImage(`images/enemies/healer/front00${i}.png`));
        healerRightFrames.push(loadImage(`images/enemies/healer/right00${i}.png`));
        healerBackFrames.push(loadImage(`images/enemies/healer/back00${i}.png`));
    }

    for (let i = 0; i < 6; i++) {
        bossFrontFrames.push(loadImage(`images/enemies/boss/front00${i}.png`));
        bossRightFrames.push(loadImage(`images/enemies/boss/right00${i}.png`));
        bossBackFrames.push(loadImage(`images/enemies/boss/back00${i}.png`));
    }

    for (let i = 0; i < 6; i++) {
        shipFrames.push(loadImage(`images/enemies/ship/tile00${i}.png`));
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
        updateSpeedBoostEffect();

        if (enemies.length > 0 || wave.active) {
            showStartArrow = false;
        }

        push();
        imageMode(CORNER);
        image(settingsImg, width - 60, 10, 60, 60);
        pop();    }

    updateTurretHoverInfo();
    updateCancelOverlayHoverEffect();
}


function filterArrays() {
    enemies = enemies.filter(e => e.finished == false && e.strength > 0);
    projectiles = projectiles.filter(p => p.inWorld() && p.strength > 0);
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
    popup.textContent = '+ ' + amount;
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000);  
}

function showMoneyPopup(amount) {
    const popup = document.getElementById('moneypopup');
    popup.textContent = '+ ' + amount;
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

function showMinionWarning() {
    const popup = document.getElementById('minionWarningPopup');
    if (!popup) {
        
        const newPopup = document.createElement('div');
        newPopup.id = 'minionWarningPopup';
        newPopup.className = 'popup minion-warning';
        document.body.appendChild(newPopup);
        
        
        const style = document.createElement('style');
        style.textContent = `
            .minion-warning {
                background-color: rgba(255, 150, 0, 0.8);
                border: 3px solid #ff6600;
                color: white;
                font-weight: bold;
                animation: pulse 0.5s infinite alternate;
            }
            @keyframes pulse {
                from { transform: scale(1); }
                to { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
    
    const warningPopup = document.getElementById('minionWarningPopup') || newPopup;
    warningPopup.textContent = 'Boss Spawning Minions!';
    warningPopup.classList.add('show');
    
    setTimeout(() => {
        warningPopup.classList.remove('show');
    }, 2000);
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
                            enemy.explode(); 
                        }

                    }
                } else {
                    const damage = Math.min(enemy.strength, projectile.strength);

                    enemy.strength -= damage;
                    projectile.strength -= damage;
                    money += Math.round(damage * 0.5);
                    updateInfo();

                    if (enemy.strength <= 0 && !enemy.isExploding) {
                        enemy.explode(); 
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

    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let clickedTurret = getTurretAt(mouseX, mouseY); 
        if (clickedTurret) {
            turrets.forEach(t => t.selected = (t === clickedTurret));
            showSelectedTurretInfo(clickedTurret);
        } else {
            turrets.forEach(t => t.selected = false);
            showSelectedTurretInfo(null);
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
    updateInfo();    // console.log(`${turretInfo.name} placed at (${x}, ${y}). Money left: ${money}. New price for ${selectedTurretType}: ${getCurrentTurretCost(selectedTurretType)}`);

    isPlacingTurret = false;
    selectedTurretType = null;
    document.getElementById('gameCanvas').style.cursor = 'default';
    if (typeof updateCancelSelectionOverlay === 'function') {
        updateCancelSelectionOverlay();
    }
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





function mouseDragged() {
    // console.log('mouseDragged called'); // Keep for debugging if needed
    if (isPlacingTurret && selectedTurretType) { 
        if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
            // console.log('Cancelling turret selection due to dragging outside map');
            closeTurretShop(true); // Cancel placement
        }
    }
}




/* // Old showTurretMenu - new shop uses handleBuyTurretClick
function showTurretMenu() {
    const menu = document.getElementById('turretMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
*/







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
var selectedTurretType = null; 
var isPlacingTurret = false; 

const turretsStaticInfo = {
    shooter: {
        name: "Shooter Turret",
        image: 'images/turrets/shooter.png', 
        pImage: null, 
        size: 50, 
        stats: { damage: "1-4", range: "150-250", firerate: "Medium", effect: "None", baseRange: 150 } 
    },
    sniper: {
        name: "Sniper Turret",
        image: 'images/turrets/sniper.png',
        pImage: null,
        size: 50,
        stats: { damage: "4-28", range: "400-550", firerate: "Slow", effect: "Instant hit", baseRange: 400 }
    },
    wizard: {
        name: "Wizard Turret",
        image: 'images/turrets/wizard.png',
        pImage: null,
        size: 50,
        stats: { damage: "3-21", range: "400-500", firerate: "Very Slow", effect: "Piercing projectile", baseRange: 400 }
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

