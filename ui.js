// Popup and message functions
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

// Info and display functions
function updateInfo() {
    document.getElementById("Money").innerHTML = money;
    document.getElementById("Wave").innerHTML = wave.number;
    document.getElementById("Health").innerHTML = health;
    
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

function checkSpeed() {
    const speedText = document.getElementById('speedText');
    speedText.textContent = `Current Speed: ${gameSpeed}x`;
}

function updateSpeedText() {
    const speedText = document.getElementById('speedText');
    speedText.textContent = `Current Speed: ${gameSpeed}x`;
}

// Turret UI functions
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
        } else if (turret.type === "sniper" && level === 2) {
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

// Shop functions
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

// Game management UI functions
function sellTurret() {
    const turret = getTurretBeingSelected();
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

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        showTemporaryMessage("Game Paused", "info");
    } else {
        showTemporaryMessage("Game Resumed", "info");
    }
}

// Drawing and visual UI functions
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

// Wave and game state UI functions
function checkWave() {
    var text = "";
    if (wave.active == false && enemies.length == 0) {
        text = "Wave Ready";
    } else {
        text = "Wave Not Ready";
    }
    document.getElementById("waveText").textContent = text;
}

function toggleAutoStart() {
    autoStart = !autoStart;
    updateWaveButtonText();

    if (autoStart && !wave.active && enemies.length === 0 && !isWaveCooldown) {
        startWave();
    }
}

// Turret management UI functions
function unselectAllTurrets() {
    turrets.forEach(t => t.selected = false);

    updateInfo(); // Update UI if deselection affects it
    // console.log("All turrets deselected / Unplaced turrets removed (if any).");
}

function changeTargetMode() {
    let turret = getTurretBeingSelected();
    if (turret != null) {
        turret.targetMode = (turret.targetMode + 1) % 4;  
        checkTargetMode();  
    }
}