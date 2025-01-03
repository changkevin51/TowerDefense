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
 let explosionImage;
 var turrets;
 var projectiles;
 var money = 1050;
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
 const wizardPriceIncreaseFactor = 4;
 var autoStart = false;
 var showStartArrow = true; 
 var turretPriceSniper = 300;
 var turretPriceWizard = 400;
 let isPopupActive = false;
 
 function preload() {
    orbImage = loadImage('images/OrbProjectile.gif');
    powImage = loadImage('images/pow.png'); 
    bombImg = loadImage('images/enemies/bomb.png');
    stunImg = loadImage('images/stun.png');
    sandImg = loadImage("images/sand.jpg");

    for (let i = 1; i <= 3; i++) {
        normalEnemyImages.push(loadImage(`images/enemies/normal${i}.png`));
    }
    heavyEnemyImage = loadImage('images/enemies/heavy1.png');
    fastEnemyImage = loadImage('images/enemies/fast1.png');
    bossEnemyImage = loadImage('images/enemies/boss1.png');
    bombEnemyImage = loadImage('images/enemies/bomb.png');
    explosionImage = loadImage('images/explosion.png');
}



 function setup() {
    canvas = createCanvas(700, 700).parent("gameCanvas");
    frameRate(frameRateBase); 
    path = new Path(levelOneNodes);
    enemies = [];
    turrets = [];
    projectiles = [];
    wave = new Wave();
    updateInfo();

    document.getElementById('turretInfo').style.display = 'none';
    isPopupActive = false;

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
                text += (turret.upgrades + 2) * 250;
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
                        money += Math.round(damage * 0.5);
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
    if (isPopupActive) {
        if (mouseY < 560) {
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
                (turret.type === 'wizard' && money >= turretPriceWizard)) {
                
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
        console.log('Checking turret cancellation conditions');
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
    const range = turretStats.baseRange + (level - 1) * (turret.type === "wizard" ? 30 : 50);
    const strength = turretStats.baseStrength + (level - 1) *
        (turret.type === "sniper" ? (4 + level) : turret.type === "wizard" ? (2 + level) : 1);
    const cooldown = turretStats.baseCooldown - (level - 1) *
        (turret.type === "sniper" ? 8 : turret.type === "wizard" ? 5 : 3);

    document.getElementById('turretCurrentStats').innerHTML = `
        Level: ${level}<br>
        Range: ${range}<br>
        Damage: ${strength}<br>
        Cooldown: ${cooldown}<br>
        Special Ability: ${turretStats.ability}
    `;

    let nextText = "Maxed Out";
    if (level < 4) {
        const nextRange = range + (turret.type === "wizard" ? 30 : 50);
        const nextStrength = strength + (turret.type === "sniper" ? (4 + level + 1) : turret.type === "wizard" ? (2 + level + 1) : 1);
        const nextCooldown = cooldown - (turret.type === "sniper" ? 8 : turret.type === "wizard" ? 5 : 3);
        nextText = `
            Next Level:<br>
            → Range: ${nextRange}<br>
            → Damage: ${nextStrength}<br>
            → Cooldown: ${nextCooldown}
        `;
    }
    document.getElementById('turretNextStats').innerHTML = nextText;

    const upgradeCostLabel = document.getElementById('upgradeButton');
    const upgradeCost = (level < 4) ? turretStats.upgradeCost(level) : "Maxed";
    upgradeCostLabel.textContent = (upgradeCost === "Maxed")
        ? "No further upgrades"
        : `Upgrade ($${upgradeCost})`;

    const upgradeButton = document.getElementById('upgradeButton');
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
    const initialPrice = turret.type === 'sniper' ? 300 : turret.type === 'wizard' ? 400 : 150;
    const totalSpent = initialPrice + turret.upgrades * (turret.type === 'sniper' || turret.type === 'wizard' ? 250 : 120);
    const sellPrice = Math.round(totalSpent * 0.8);
    sellButton.textContent = `Sell for $${sellPrice}`;
}

function sellTurret() {
    const turret = getTurretBeingSelected();
    if (!turret) return;

    const initialPrice = turret.type === 'sniper'
        ? 300
        : turret.type === 'wizard'
            ? 400
            : 150;
    const upgradeCost = (turret.type === 'sniper' || turret.type === 'wizard') ? 250 : 120;
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
    }

    updateInfo();
    updateTurretMenuText();
    showSelectedTurretInfo(null);
}



function upgradeTurret() {
    const turret = getTurretBeingSelected();
    if (!turret) return;

    let cost;
    if (turret.type === 'sniper' || turret.type === 'wizard') {
        cost = (turret.upgrades + 2) * 250;
    } else {
        cost = (turret.upgrades + 2) * 120;
    }

    if (money >= cost && turret.upgrades < turret.maxUpgrades) {
        money -= cost;
        turret.upgrades += 1;
        turret.range += 30;
        turret.damage += 1;
        turret.cooldown -= 3;
        updateInfo();
    }

    showSelectedTurretInfo(turret);
}






document.addEventListener('DOMContentLoaded', () => {
    const upgradeButton = document.getElementById('upgradeButton');
    const sellButton = document.getElementById('sellButton');
    const turretInfo = document.getElementById('turretInfo');

    turretInfo.addEventListener('click', (event) => {
        console.log('Popup clicked');
        event.stopPropagation();
    });
    
    upgradeButton.addEventListener('click', (event) => {
        console.log('Upgrade button clicked');
        event.preventDefault();
        upgradeTurret();
    });
    
    sellButton.addEventListener('click', (event) => {
        console.log('Sell button clicked');
        event.preventDefault();
        sellTurret();
    });
});