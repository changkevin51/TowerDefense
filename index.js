var playing = true;
var sandImg
var speedBoostEffectImg;
var prerenderedBackground;
// var levelOneNodes = [
//     {x: -100, y: 50},
//     {x: 100, y: 50},
//     {x: 100, y: 500},
//     {x: 400, y: 500},
//     {x: 400, y: 200},
//     {x: 250, y: 200},
//     {x: 250, y: 50},
//     {x: 700, y: 50},
//     {x: 700, y: 250},
//     {x: 600, y: 250},
//     {x: 600, y: 650},
//     {x: 800, y: 650},
// ];


var levelOneNodes = [
    {x: -100, y: 50},
    {x: 100, y: 50},
    {x: 100, y: 300},
    {x: 150, y: 300},
    {x: 150, y: 500},
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


var secondPath = [
    {x: 200, y: 750},
    {x: 200, y: 650},
    {x: 50, y: 650},
    {x: 50, y: 500},
    {x: 97, y: 500}
];


// console.log('Database URL:', process.env.DATABASE_URL);
window.userSubmittedScore = false;
window.userDisplayName = '';

 var isEasyMode = false;
 var isHardMode = false;
 var pendingDifficulty = null; 
 var settingsImg;
 var resumeImg;
 var isPaused = false;
 var canvas;
 var path;
 var secondaryPath;
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
 var isDualPathWarningActive = false;
 var arrowAnimationOffset = 0;
 var arrowAnimationSpeed = 2;
 var hasSeenDualPathWarning = false;

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
let campfireFrames = [];
let campfireCurrentFrame = 0;
let campfireAnimationSpeed = 10; 
let campfireFrameCounter = 0;
let flagFrames = [];
let flagCurrentFrame = 0;
let flagAnimationSpeed = 8; 
let flagFrameCounter = 0;
let hoveredTurret = null;

// Evolution system variables
var evolvedShooterFrames = [];
var evolvedShooterHolderImg;
var evolvedShooterProjectileImg;
var totalShooterDamage = 0; // Track total damage done by all shooters
var evolvedShooterPrice = 400;
const evolvedShooterPriceIncreaseFactor = 1.5;
var evolvedShooterUpgradePrice = 200;

let isPlacingTarget = false;
let targetingTurret = null;
window.isPlacingTarget = false;
window.targetingTurret = null;

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
    targetImg = loadImage('images/target.png');

    turretHolderImg = loadImage('images/shooter/greenHolder.png');
    for (let i = 1; i <= 7; i++) {
        turretFrames.push(loadImage(`images/shooter/tile00${i}.png`));
    }
    
    evolvedShooterHolderImg = loadImage('images/shooter2/greenHolder.png');
    evolvedShooterProjectileImg = loadImage('images/shooter2/shooterProjectile.png');
    for (let i = 0; i <= 7; i++) {
        let frameFile = i === 0 ? 'tile000.png' : `tile00${i}.png`;
        evolvedShooterFrames.push(loadImage(`images/shooter2/${frameFile}`));
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

    // Load campfire animation frames
    for (let i = 0; i < 6; i++) {
        campfireFrames.push(loadImage(`images/map/animations/campfire/frame${i}.png`));
    }

    // Load flag animation frames
    for (let i = 0; i < 6; i++) {
        flagFrames.push(loadImage(`images/map/animations/flag/frame${i}.png`));
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
    
    // Secondary path will be created when difficulty is selected
    secondaryPath = null;
    
    enemies = [];
    turrets = [];
    projectiles = [];
    wave = new Wave();
    
    // Pre-render the static background
    prerenderBackground();
    
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

function prerenderBackground() {
    prerenderedBackground = createGraphics(width, height);
    
    const tileSize = 50; 
    const tilesX = Math.ceil(width / tileSize);
    const tilesY = Math.ceil(height / tileSize);
    
    for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
            let tileWidth = (x === tilesX - 1) ? width - x * tileSize : tileSize;
            let tileHeight = (y === tilesY - 1) ? height - y * tileSize : tileSize;
            
            prerenderedBackground.image(backgroundTile, 
                  x * tileSize, y * tileSize,
                  tileWidth, tileHeight,
                  0, 0,
                  tileWidth, tileHeight);
        }
    }
    
    drawDecorationsToBuffer(prerenderedBackground);
    
    path.draw(prerenderedBackground);
    
    if (!isEasyMode && secondaryPath) {
        secondaryPath.draw(prerenderedBackground);
    }
}

function drawDecorationsToBuffer(buffer) {
    buffer.push(); 
    buffer.translate(300 + water.width / 2, 590 + water.height / 2); 
    buffer.image(water, -water.width / 2, -water.height / 2); 
    buffer.pop(); 

    buffer.push();
    buffer.translate(280 + rocks.width / 2, 580 + water.height + rocks.height / 2); 
    buffer.image(rocks, -rocks.width / 2, -rocks.height / 2);
    buffer.pop();

    buffer.push();
    buffer.translate(460, 200); 
    buffer.image(cactus, 0, 0, cactus.width*0.9, cactus.height*0.9);
    buffer.pop();

    buffer.push();
    buffer.translate(650, 490); 
    buffer.image(cactus2, 0, 0, cactus2.width*0.9, cactus2.height*0.9);
    buffer.pop();

    buffer.push();
    buffer.translate(275, 80); 
    buffer.image(sign, 0, 0, sign.width*0.7, sign.height*0.7);
    buffer.pop();

    buffer.push();
    buffer.translate(540, 120); 
    buffer.image(bigRock, 0, 0, bigRock.width*0.65, bigRock.height*0.65);
    buffer.pop();
}

function drawAnimatedDecorations() {
    if (!isPaused) {
        campfireFrameCounter++;
        if (campfireFrameCounter >= campfireAnimationSpeed) {
            campfireCurrentFrame = (campfireCurrentFrame + 1) % campfireFrames.length;
            campfireFrameCounter = 0;
        }
    }
    
    push();
    translate(235, 320);
    if (campfireFrames[campfireCurrentFrame]) {
        image(campfireFrames[campfireCurrentFrame], 0, 0, 
              campfireFrames[campfireCurrentFrame].width * 2, 
              campfireFrames[campfireCurrentFrame].height * 2);
    }
    pop();

    if (!isPaused) {
        flagFrameCounter++;
        if (flagFrameCounter >= flagAnimationSpeed) {
            flagCurrentFrame = (flagCurrentFrame + 1) % flagFrames.length;
            flagFrameCounter = 0;
        }
    }
    
    push();
    translate(150, 10);
    if (flagFrames[flagCurrentFrame]) {
        image(flagFrames[flagCurrentFrame], 0, 0, 
              flagFrames[flagCurrentFrame].width * 1.6, 
              flagFrames[flagCurrentFrame].height * 1.6);
    }
    pop();
}

function drawBackground() {
    image(prerenderedBackground, 0, 0);
    
    drawAnimatedDecorations();
}

function getDecorationBounds() {
    return [
        { x: 300, y: 590, width: water.width, height: water.height },
        { x: 280, y: 580 + water.height, width: rocks.width, height: rocks.height },
        { x: 460, y: 200, width: cactus.width*0.9, height: cactus.height*0.9 },
        { x: 650, y: 490, width: cactus2.width*0.9, height: cactus2.height*0.9 },
        { x: 275, y: 80, width: sign.width * 0.7, height: sign.height * 0.7 },
        { x: 540, y: 120, width: bigRock.width * 0.5, height: bigRock.height * 0.5 }, 
        { x: 215, y: 320, width: (campfireFrames[0] ? campfireFrames[0].width * 2 : 64), height: (campfireFrames[0] ? campfireFrames[0].height * 2 : 64) }, // Campfire bounds
        { x: 150, y: 10, width: (flagFrames[0] ? flagFrames[0].width * 1.6 : 64), height: (flagFrames[0] ? flagFrames[0].height * 1.6 : 64) }, // Flag bounds
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

    if (showStartArrow) {
        // Update arrow animation
        if (!isPaused) {
            arrowAnimationOffset = sin(millis() / 200) * 15;
        }
        
        path.drawStartArrow('green', arrowAnimationOffset);
        // Draw start arrow for secondary path too if it exists
        if (secondaryPath) {
            secondaryPath.drawStartArrow('orange', arrowAnimationOffset);
        }
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

    if (window.isPlacingTarget && window.targetingTurret) {
        push();
        imageMode(CENTER);
        tint(255, 255, 255, 150);
        image(targetImg, mouseX, mouseY, 60, 60);
        noTint();
        
        stroke(255, 165, 0);
        strokeWeight(2);
        line(window.targetingTurret.x, window.targetingTurret.y, mouseX, mouseY);
        pop();
    }

    if (health <= 0) {
        drawGameOver();
    }    if (isPaused) {
        push();
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        pop();
        
        // pause menu
        push();
        fill(50, 50, 50, 200);
        stroke(255, 165, 0);
        strokeWeight(3);
        rect(width/2 - 200, height/2 - 200, 400, 400, 15);
        
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text("GAME PAUSED", width/2, height/2 - 160);   
        fill(0, 0, 0, 100); 
        rect(width/2 - 150, height/2 - 135, 300, 25, 5);
        
        fill(255, 255, 255);
        noStroke();
        textSize(18);
        let currentDiff = isEasyMode ? "EASY" : isHardMode ? "HARD" : "NORMAL";
        text(`Current Difficulty: ${currentDiff}`, width/2, height/2 - 120);
        
        noStroke();
        fill(255);
        textSize(16);
        text("Change Difficulty:", width/2, height/2 - 95);
        if (mouseX > width/2 - 180 && mouseX < width/2 - 70 && 
            mouseY > height/2 - 75 && mouseY < height/2 - 35) {
            fill(76, 175, 80);  
        } else {
            fill(56, 142, 60);  
        }
        if (isEasyMode) {
            stroke(255, 255, 0); 
            strokeWeight(3);
        } else if (pendingDifficulty === 'easy') {
            stroke(0, 255, 255); 
            strokeWeight(3);
        } else {
            noStroke();
        }
        rect(width/2 - 180, height/2 - 75, 110, 40, 8);
        
        fill(255);
        textSize(14);
        text("EASY", width/2 - 125, height/2 - 55);
        if (mouseX > width/2 - 55 && mouseX < width/2 + 55 && 
            mouseY > height/2 - 75 && mouseY < height/2 - 35) {
            fill(255, 152, 0);  
        } else {
            fill(230, 126, 34);  
        }
        if (!isEasyMode && !isHardMode) {
            stroke(255, 255, 0); 
            strokeWeight(3);
        } else if (pendingDifficulty === 'normal') {
            stroke(0, 255, 255); 
            strokeWeight(3);
        } else {
            noStroke();
        }
        rect(width/2 - 55, height/2 - 75, 110, 40, 8);
        
        fill(255);
        textSize(14);
        text("NORMAL", width/2, height/2 - 55);
        
        if (mouseX > width/2 + 70 && mouseX < width/2 + 180 && 
            mouseY > height/2 - 75 && mouseY < height/2 - 35) {
            fill(244, 67, 54);  
        } else {
            fill(198, 40, 40);  
        }
        if (isHardMode) {
            stroke(255, 255, 0); 
            strokeWeight(3);
        } else if (pendingDifficulty === 'hard') {
            stroke(0, 255, 255); 
            strokeWeight(3);
        } else {
            noStroke();
        }
        rect(width/2 + 70, height/2 - 75, 110, 40, 8);
        
        fill(255);
        textSize(14);
        text("HARD", width/2 + 125, height/2 - 55);
        
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 - 10 && mouseY < height/2 + 40) {
            fill(76, 175, 80);  
        } else {
            fill(56, 142, 60);  
        }
        noStroke();
        rect(width/2 - 100, height/2 - 10, 200, 50, 10);
        
        fill(255);
        textSize(20);
        text("RESUME", width/2, height/2 + 15);

        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 + 60 && mouseY < height/2 + 110) {
            fill(244, 67, 54);  
        } else {
            fill(198, 40, 40);  
        }
        rect(width/2 - 100, height/2 + 60, 200, 50, 10);
          fill(255);
        textSize(20);
        text("RESTART", width/2, height/2 + 85);
        
        if (pendingDifficulty) {
            fill(0, 255, 255);
            textSize(14);
            let pendingDiffText = pendingDifficulty.toUpperCase();
            text(`Difficulty will change to ${pendingDiffText} next wave`, width/2, height/2 + 160);
        }
        
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
    
    // Draw dual path warning popup if active
    drawDualPathWarningPopup();
}

function filterArrays() {
    // Filter enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (enemy.finished || enemy.strength <= 0) {
            enemies.splice(i, 1);
        }
    }

    // Filter projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        if (!projectile.inWorld() || projectile.strength <= 0) {
            projectiles.splice(i, 1);
        }
    }
}

function isValidPlacementLocation(x, y, turretType) {
    const turretSize = turretsStaticInfo[turretType]?.size || 50; 

    if (path.onPath(x, y, turretSize / 2)) {
        return false;
    }
    
    if (!isEasyMode && secondaryPath && secondaryPath.onPath(x, y, turretSize / 2)) {
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
    
    // Apply pending difficulty change if any
    if (pendingDifficulty) {
        applyDifficultyChange(pendingDifficulty);
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
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (!enemy) continue; // Safety check

        for (let j = projectiles.length - 1; j >= 0; j--) {
            const projectile = projectiles[j];
            if (!projectile) continue; // Safety check

            if (CircleInCircle(enemy, projectile)) {
                // Handle Piercing Projectiles
                if (projectile instanceof PiercingProjectile) {
                    if (!projectile.hitEnemies.has(enemy)) {
                        const damage = Math.min(enemy.strength, projectile.strength);
                        enemy.strength -= damage;
                        
                        // Apply difficulty-based money calculation
                        if (isEasyMode) {
                            money += Math.round(damage * 0.7);
                        } else if (isHardMode) {
                            money += Math.round(damage * 0.4);
                        } else {
                            money += Math.round(damage * 0.5);
                        }
                        
                        projectile.hitEnemies.add(enemy);
                        projectile.totalDamageDealt += damage;
                        if (projectile.parentTurret) {
                            projectile.parentTurret.totalDamage += damage;
                            
                            // Track total shooter damage for evolution
                            if (projectile.parentTurret.type === 'shooter') {
                                totalShooterDamage += damage;
                            } else if (projectile.parentTurret.type === 'shooter2') {
                                totalShooterDamage += damage;
                            }
                        }
                    }
                // Handle Snowball Projectiles (which are destroyed on impact)
                } else if (projectile instanceof SnowballProjectile) {
                    const damage = Math.min(enemy.strength, projectile.strength);
                    enemy.strength -= damage;
                    
                    // Apply difficulty-based money calculation
                    if (isEasyMode) {
                        money += Math.round(damage * 0.7);
                    } else if (isHardMode) {
                        money += Math.round(damage * 0.4);
                    } else {
                        money += Math.round(damage * 0.5);
                    }
                    
                    // Track turret damage
                    if (projectile.parentTurret) {
                        projectile.parentTurret.totalDamage += damage;
                    }
                    
                    // Apply slow effect
                    enemy.isSlowed = true;
                    enemy.slowEndTime = millis() + projectile.slowDuration;
                    enemy.slowFactor = 0.65;
                    
                    // Apply stun effect (except for bosses)
                    if (projectile.stunDuration > 0 && enemy.type !== 'ship' && enemy.type !== 'boss' && 
                        enemy.type !== 'miniboss1' && enemy.type !== 'miniboss2' && enemy.type !== 'miniboss3') {
                        enemy.isStunned = true;
                        enemy.stunEndTime = millis() + projectile.stunDuration;
                    } else if (projectile.stunDuration > 0 && (enemy.type === 'ship' || enemy.type === 'boss' || 
                        enemy.type === 'miniboss1' || enemy.type === 'miniboss2' || enemy.type === 'miniboss3')) {
                        // Apply stronger slow effect instead of stun for bosses
                        enemy.slowFactor = 0.5; 
                        enemy.slowEndTime = millis() + projectile.slowDuration; 
                    }
                    
                    projectiles.splice(j, 1); // Remove snowball from game

                // Handle Regular Projectiles
                } else {
                    const damage = Math.min(enemy.strength, projectile.strength);
                    enemy.strength -= damage;
                    projectile.strength -= damage;
                    
                    // Apply difficulty-based money calculation
                    if (isEasyMode) {
                        money += Math.round(damage * 0.7);
                    } else if (isHardMode) {
                        money += Math.round(damage * 0.4);
                    } else {
                        money += Math.round(damage * 0.5);
                    }
                    
                    // Track turret damage and total shooter damage
                    if (projectile.parentTurret) {
                        projectile.parentTurret.totalDamage += damage;
                        
                        if (projectile.parentTurret.type === 'shooter') {
                            totalShooterDamage += damage;
                        } else if (projectile.parentTurret.type === 'shooter2') {
                            totalShooterDamage += damage;
                        }
                    }
                    
                    if (projectile.strength <= 0) {
                        projectiles.splice(j, 1); // Remove regular projectile
                    }
                }

                updateInfo(); // Call this once after damage is dealt

                if (enemy.strength <= 0 && !enemy.isExploding) {
                    enemy.explode();
                }
                
                // If projectile was destroyed, no need to check it against other enemies
                if (!projectiles[j]) break; 
            }
        }
    }
}


function mousePressed() {
    // Handle dual path warning popup
    if (isDualPathWarningActive) {
        // Check if clicked on dismiss button
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 + 80 && mouseY < height/2 + 130) {
            dismissDualPathWarning();
        }
        return; // Block other interactions while popup is active
    }
    
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
    }    if (isPaused) {
        // Easy difficulty button
        if (mouseX > width/2 - 180 && mouseX < width/2 - 70 && 
            mouseY > height/2 - 75 && mouseY < height/2 - 35) {
            changeDifficulty('easy');
            return;
        }
        
        // Normal difficulty button
        if (mouseX > width/2 - 55 && mouseX < width/2 + 55 && 
            mouseY > height/2 - 75 && mouseY < height/2 - 35) {
            changeDifficulty('normal');
            return;
        }
        
        // Hard difficulty button
        if (mouseX > width/2 + 70 && mouseX < width/2 + 180 && 
            mouseY > height/2 - 75 && mouseY < height/2 - 35) {
            changeDifficulty('hard');
            return;
        }
        
        // Resume button (fixed coordinates)
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 - 10 && mouseY < height/2 + 40) {
            togglePause();
            return;
        }
        
        // Restart button (fixed coordinates)
        if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
            mouseY > height/2 + 60 && mouseY < height/2 + 110) {
            restartGame();
            return;
        }

        return; // Prevent other actions while paused
    }

    if (mouseX > width - 60 && mouseX < width && mouseY > 10 && mouseY < 70 && !isPopupActive && !isGameOver && !isDualPathWarningActive) {
        togglePause();
        return;
    }

    if (isPaused) return;

    // Handle target placement FIRST, before any other popup logic
    if (window.isPlacingTarget && window.targetingTurret) {
        // Handle target placement
        if (mouseX >= 0 && mouseX <= 700 && mouseY >= 0 && mouseY <= 700) {
            window.targetingTurret.setFixedTarget(mouseX, mouseY);
            window.isPlacingTarget = false;
            const placedTurret = window.targetingTurret;
            window.targetingTurret = null;
            // Keep the turret selected and refresh the info panel to show the updated state
            turrets.forEach(t => t.selected = (t === placedTurret));
            showSelectedTurretInfo(placedTurret);
        }
        return;
    }

    if (isPlacingTurret && selectedTurretType) {
        // Handle normal turret placement
        if (mouseX >= 0 && mouseX <= 700 && mouseY >= 0 && mouseY <= 700) {
            placeSelectedTurret(mouseX, mouseY);
        }
        return;
    }

    if (isDualPathWarningActive) {
        return;
    }

    if (isPopupActive) { 
        const turretInfoPopup = document.getElementById('turretInfo');
        const isClickInsidePopup = turretInfoPopup && turretInfoPopup.contains(event.target);

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
        case 'shooter2':
            newTurret = new EvolvedShooterTurret(x, y, evolvedShooterFrames, evolvedShooterHolderImg, evolvedShooterProjectileImg, path.roads);
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
        const distanceSq = (x - turret.x) ** 2 + (y - turret.y) ** 2;
        const radiusSq = (turret.size / 2) ** 2;
        if (distanceSq < radiusSq) { 
            return turret;
        }
    }
    return null;
}


function keyPressed() {
    if (keyCode === ESCAPE) {
        if (isDualPathWarningActive) {
            dismissDualPathWarning();
        } else {
            isPaused = !isPaused;
        }
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
    enemies.forEach(enemy => enemy.updateGameSpeed(gameSpeed));    updateSpeedText();
}

function changeDifficulty(newDifficulty) {
    const currentDiff = isEasyMode ? "easy" : isHardMode ? "hard" : "normal";

    if (newDifficulty === currentDiff && !pendingDifficulty) {
        return;
    }

    pendingDifficulty = newDifficulty;
    
    const difficultyNames = {
        'easy': 'Easy',
        'normal': 'Normal', 
        'hard': 'Hard'
    };

    if (wave.active || enemies.length > 0) {
        showTemporaryMessage(`Difficulty will change to ${difficultyNames[newDifficulty]} next wave!`, "info");
        return;
    }

    applyDifficultyChange(newDifficulty);
}

function applyDifficultyChange(newDifficulty) {
    isEasyMode = false;
    isHardMode = false;
    if (newDifficulty === 'easy') {
        isEasyMode = true;
    } else if (newDifficulty === 'hard') {
        isHardMode = true;
    }
    
    if (!isEasyMode && !secondaryPath) {
        secondaryPath = new Path(secondPath, pathTile);
        prerenderBackground();
        if (!isPaused) {
            showPathWarning();
        }
    } else if (isEasyMode && secondaryPath) {
        secondaryPath = null;
        prerenderBackground();
    }
    
    const difficultyNames = {
        'easy': 'Easy',
        'normal': 'Normal', 
        'hard': 'Hard'
    };
    
    showTemporaryMessage(`Difficulty changed to ${difficultyNames[newDifficulty]}!`, "info");

    pendingDifficulty = null;

    updateInfo();
}

function mouseDragged() {
    // console.log('mouseDragged called'); 
    if (isPlacingTurret && selectedTurretType) { 
        if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
            closeTurretShop(true);
        }
    }
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
      secondaryPath = null;
      prerenderBackground();
      updateInfo();
    });
  
    normalButton.addEventListener('click', () => {
      isEasyMode = false;
      difficultyScreen.style.display = 'none';
      if (!secondaryPath) {
        secondaryPath = new Path(secondPath, pathTile);
        prerenderBackground();
      }
      showPathWarning();
      updateInfo();
    });

    hardButton.addEventListener('click', () => {
        isHardMode = true;
        isEasyMode = false;
        health = 20;
        difficultyScreen.style.display = 'none';
        if (!secondaryPath) {
          secondaryPath = new Path(secondPath, pathTile);
          prerenderBackground();
        }
        showPathWarning();
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
var selectedTurretType = null; 
var currentlySelectedTurret = null; // Track the currently selected turret for UI purposes
var isPlacingTurret = false; 

const turretsStaticInfo = {
    shooter: {
        name: "Shooter Turret",
        image: 'images/turrets/shooter.png', 
        pImage: null, 
        size: 50, 
        stats: { damage: "1-4", range: "150-250", firerate: "Medium", effect: "None", baseRange: 150 },
        canEvolve: true
    },
    shooter2: {
        name: "Evolved Shooter",
        image: 'images/turrets/shooter2.png',
        pImage: null,
        size: 50,
        stats: { damage: "0.65-2.6", range: "150-250", firerate: "Very Fast", effect: "Dual gun system", baseRange: 150 }
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

function showPathWarning() {
    if (!hasSeenDualPathWarning) {
        isDualPathWarningActive = true;
        isPopupActive = true;
        hasSeenDualPathWarning = true;
    }
}

function dismissDualPathWarning() {
    isDualPathWarningActive = false;
    isPopupActive = false;
}

function drawDualPathWarningPopup() {
    if (!isDualPathWarningActive) return;
    push();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    pop();

    push();
    fill(50, 50, 50, 220);
    stroke(255, 165, 0);
    strokeWeight(4);
    rect(width/2 - 250, height/2 - 150, 500, 300, 15);
    
    fill(255, 165, 0, 100);
    noStroke();
    rect(width/2 - 240, height/2 - 140, 480, 50, 10);
    
    fill(255, 255, 255);
    textAlign(CENTER, CENTER);
    textSize(24);
    textStyle(BOLD);
    text("WARNING", width/2, height/2 - 115);
    
    fill(255, 255, 255);
    textSize(16);
    textStyle(NORMAL);
    text("In Normal and Hard mode, enemies will spawn", width/2, height/2 - 60);
    text("from BOTH entrances!", width/2, height/2 - 35);
    
    fill(76, 175, 80); 
    text("🟢 Main Path (Green Arrow)", width/2, height/2 - 5);
    
    fill(255, 152, 0); 
    text("🟠 Secondary Path (Orange Arrow)", width/2, height/2 + 20);
    
    fill(255, 255, 255);
    text("Plan your turret placement accordingly!", width/2, height/2 + 50);
    
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && 
        mouseY > height/2 + 80 && mouseY < height/2 + 130) {
        fill(76, 175, 80);
    } else {
        fill(56, 142, 60);
    }
    noStroke();
    rect(width/2 - 100, height/2 + 80, 200, 50, 10);
    
    fill(255);
    textSize(18);
    text("GOT IT!", width/2, height/2 + 105);
    
    pop();
}