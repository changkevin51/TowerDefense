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

const EVOLUTION_DAMAGE_THRESHOLD = 3000; // CHANGE THIS

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
    
    const powerUpShopMoney = document.getElementById("powerUpShopMoney");
    const powerUpShopHealth = document.getElementById("powerUpShopHealth");
    const powerUpShopWave = document.getElementById("powerUpShopWave");
    
    if (powerUpShopMoney) powerUpShopMoney.innerHTML = `$${money}`;
    if (powerUpShopHealth) powerUpShopHealth.innerHTML = health;
    if (powerUpShopWave) powerUpShopWave.innerHTML = waveNumber;
    
    updatePowerUpCosts();
    
    // Update button displays
    checkSpeed();
    checkTargetMode();
    updateWaveButtonText();
    
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
            } else if (turret instanceof EvolvedShooterTurret) {
                text += 200 + (turret.upgrades * 150);
            } else {
                text += (turret.upgrades + 2) * 120; 
            }
        }
    } else {
        text = "No Turret Selected!";
    }

    const upgradeButton = document.getElementById("upgradeButton");
    upgradeButton.textContent = text;
    
    if (turret !== null) {
        const upgradeCost = turret instanceof SniperTurret ? (turret.upgrades + 2) * 250 : 
                            turret instanceof WizardTurret ? (turret.upgrades + 2) * 260 : 
                            turret instanceof FrosterTurret ? (turret.upgrades + 2) * 270 : 
                            turret instanceof EvolvedShooterTurret ? 200 + (turret.upgrades * 150) : 
                            (turret.upgrades + 2) * 120;
        if (turret.upgrades >= turret.maxUpgrades || money < upgradeCost) {
            upgradeButton.classList.remove('blue');
            upgradeButton.classList.add('red');
            upgradeButton.disabled = true;
        } else {
            upgradeButton.classList.remove('red');
            upgradeButton.classList.add('blue');
            upgradeButton.disabled = false;
        }
    } else {
        upgradeButton.classList.remove('blue');
        upgradeButton.classList.add('red');
        upgradeButton.disabled = true;
    }
}

function updateWaveButtonText() {
    const autoStartText = document.querySelector('.autoStartToggle');
    autoStartText.textContent = `Auto Start Toggle: ${autoStart ? "True" : "False"}`;

    const waveButton = document.querySelector('#startWaveButton');
    if (waveButton) {
        waveButton.setAttribute('data-wave-ready', wave.active ? "false" : "true");
    }
}

function checkTargetMode() {
    let turret = getTurretBeingSelected();
    let text = "";
    
    if (turret) {
        if (turret.targetMode === 0) text = "Closest";
        else if (turret.targetMode === 1) text = "Strongest";
        else if (turret.targetMode === 2) text = "First";
        else if (turret.targetMode === 3) text = "Last";
    } else {
        text = "Select a turret";
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

function showSelectedTurretInfo(turret) {
    const infoDiv = document.getElementById('turretInfo');
    const header = document.getElementById('turretDetailsHeader');
    window.currentlySelectedTurret = turret;
    
    if (!turret) {
        infoDiv.style.display = 'none';
        isPopupActive = false;
        if (window.isPlacingTarget) {
            window.isPlacingTarget = false;
            window.targetingTurret = null;
        }
        // Update target mode display when no turret is selected
        checkTargetMode();
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
    const displayName = turret.type === 'shooter2' ? 'Evolved Turret' : turret.type.charAt(0).toUpperCase() + turret.type.slice(1);
    header.textContent = `${displayName} Details`;
    const stats = populateStats(); 
    const turretStats = stats.find(s => s.name.toLowerCase() === turret.type);
    if (!turretStats) {
        console.error("No stats found for turret type:", turret.type);
        return;
    }

    const level = turret.upgrades + 1;
    const range = turretStats.baseRange + turret.upgrades * (turret.type === "wizard" ? 30 : 50);
    const strength = Math.round((turretStats.baseStrength + turret.upgrades *
        (turret.type === "sniper" ? (4 + level) : 
         turret.type === "wizard" ? (2 + level) : 
         turret.type === "froster" ? 1 : 
         turret.type === "shooter2" ? 0.65 : 1)) * 100) / 100; // Round to 2 decimal places
    const cooldown = turretStats.baseCooldown - turret.upgrades *
        (turret.type === "sniper" ? 8 : 
         turret.type === "wizard" ? 5 : 
         turret.type === "froster" ? 8 : 
         turret.type === "shooter2" ? 3 : 3);
    const specialAbility = (turret.type === "wizard" && turret.upgrades >= 2) ? "+ Immune to Stun" :
                           (turret.type === "froster" && turret.upgrades >= 2) ? "+ Stun Enemies" :
                           (turret.type === "shooter2") ? "Dual Gun System" :
                           turretStats.ability;

    const currentStatsElement = document.getElementById('turretCurrentStats');
    currentStatsElement.setAttribute('data-level', `LEVEL ${level}`);
    
    currentStatsElement.innerHTML = `
        Range: ${range}<br>
        Damage: ${strength}<br>
        Cooldown: ${cooldown}<br>
        Special Ability: ${specialAbility}
    `;
    
    let nextText = "Maxed Out";
    if (level < 4) {
        const nextRange = range + (turret.type === "wizard" ? 30 : turret.type === "froster" ? 10 : 50);
        const nextStrength = Math.round((strength + (turret.type === "sniper" ? (4 + level + 1) : 
                                         turret.type === "wizard" ? (2 + level + 1) : 
                                         turret.type === "froster" ? 1 : 
                                         turret.type === "machinegun" ? 0.6 : 
                                         turret.type === "shooter2" ? 0.65 : 1)) * 100) / 100; // Round to 2 decimal places
        const nextCooldown = cooldown - (turret.type === "sniper" ? 8 : 
                                        turret.type === "wizard" ? 5 : 
                                        turret.type === "froster" ? 8 : 
                                        turret.type === "machinegun" ? 0.5 : 
                                        turret.type === "shooter2" ? 3 : 3);
        let nextSpecialAbility = turretStats.ability;
        if (turret.type === "wizard" && level === 2) {
            nextSpecialAbility = "+ Immune to Stun";
        } else if (turret.type === "froster" && level === 2) {
            nextSpecialAbility = "+ Freeze and Slow Enemies";
        } else if (turret.type === "sniper" && level === 2) {
            nextSpecialAbility = "+ Target Invisible Enemies and Instant Hit";
        }
        nextText = `
            Range: ${nextRange}<br>
            Damage: ${nextStrength}<br>
            Cooldown: ${nextCooldown}<br>
            Special Ability: ${nextSpecialAbility}
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
        } else if (turret.type === 'shooter2') {
            upgradeCost = 200 + (turret.upgrades * 150);
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
                         turret.type === 'machinegun' ? 360 : 
                         turret.type === 'shooter2' ? 400 : 150;
    const upgradeFactor = turret.type === 'sniper' ? 250 : 
                          turret.type === 'wizard' ? 260 : 
                          turret.type === 'froster' ? 270 : 
                          turret.type === 'machinegun' ? 180 : 120;
    
    let totalSpent;
    if (turret.type === 'shooter2') {
        // Special calculation for evolved shooter: 200 + (150 * 1) + (150 * 2) + ... 
        totalSpent = initialPrice;
        for (let i = 0; i < turret.upgrades; i++) {
            totalSpent += 200 + (i * 150);
        }
    } else {
        totalSpent = initialPrice + turret.upgrades * upgradeFactor;
    }
    const sellPrice = Math.round(totalSpent * 0.8);
    sellButton.textContent = `Sell for $${sellPrice}`;

    const damageCounter = document.querySelector('.damage-counter');
    if (damageCounter) {
        damageCounter.textContent = `Damage: ${Math.round(turret.totalDamage)}`;
    }

    const infoContainer = document.querySelector('.info-container');
    let targetButton = document.getElementById('setTargetButton');
    
    if (turret.type === 'machinegun' || turret.type === 'wizard') {
        if (!targetButton) {
            targetButton = document.createElement('button');
            targetButton.id = 'setTargetButton';
            // Remove inline styles to let CSS handle positioning
            targetButton.style.cssText = '';
            
            // Append to turret info container for absolute positioning
            const turretInfo = document.querySelector('.turret-info');
            if (turretInfo) {
                turretInfo.appendChild(targetButton);
            }
        }
        
        const newTargetButton = targetButton.cloneNode(true);
        targetButton.parentNode.replaceChild(newTargetButton, targetButton);
        targetButton = newTargetButton;
        
        targetButton.addEventListener('click', () => {
            if (turret.hasFixedTarget) {
                turret.clearFixedTarget();
                window.isPlacingTarget = false;
                window.targetingTurret = null;
                if (typeof showSelectedTurretInfo === 'function') {
                    showSelectedTurretInfo(turret);
                }
            } else {
                window.isPlacingTarget = true;
                window.targetingTurret = turret;
                targetButton.textContent = 'Click on map to set target';
                targetButton.style.backgroundColor = '#007bff';
                targetButton.onmouseover = () => targetButton.style.backgroundColor = '#0056b3';
                targetButton.onmouseout = () => targetButton.style.backgroundColor = '#007bff';
            }
        });
        
        if (turret.hasFixedTarget) {
            targetButton.textContent = 'Clear Target';
            targetButton.style.backgroundColor = '#dc3545';
            targetButton.onmouseover = () => targetButton.style.backgroundColor = '#c82333';
            targetButton.onmouseout = () => targetButton.style.backgroundColor = '#dc3545';
        } else {
            targetButton.textContent = 'Set Target';
            targetButton.style.backgroundColor = '#ffa500';
            targetButton.onmouseover = () => targetButton.style.backgroundColor = '#ff8c00';
            targetButton.onmouseout = () => targetButton.style.backgroundColor = '#ffa500';
        }
        
        targetButton.style.display = 'block';
    } else {
        if (targetButton) {
            targetButton.style.display = 'none';
        }
    }
    
    // Update target mode display when a turret is selected
    checkTargetMode();
}

function updateTurretHoverInfo() {
    const mouseOverTurret = getTurretBeingHovered();
    const turretHoverInfo = document.querySelector('.turret-hover-info');
    
    if (!turretHoverInfo) return;
    
    if (mouseOverTurret && !isPlacingTurret && !isPopupActive) {
        const turretType = mouseOverTurret.type || 'shooter';
        const turretStats = populateStats().find(s => s.name.toLowerCase() === turretType);
          if (!turretStats) return;
        
        const level = mouseOverTurret.upgrades + 1;
        
        let range;
        if (turretType === "machinegun") {
            range = "Infinite";
        } else {
            range = turretStats.baseRange + mouseOverTurret.upgrades * 
                (turretType === "wizard" ? 30 : turretType === "froster" ? 10 : 50);
        }
        
        const strength = Math.round((turretStats.baseStrength + mouseOverTurret.upgrades *
            (turretType === "sniper" ? (4 + level) : 
             turretType === "wizard" ? (2 + level) : 
             turretType === "froster" ? 1 : 
             turretType === "machinegun" ? 0.3 : 
             turretType === "shooter2" ? 0.65 : 1)) * 100) / 100; 
        const cooldown = turretStats.baseCooldown - mouseOverTurret.upgrades *
            (turretType === "sniper" ? 8 : 
             turretType === "wizard" ? 5 : 
             turretType === "froster" ? 8 : 
             turretType === "machinegun" ? 1 : 
             turretType === "shooter2" ? 3 : 3);
        
        let fireRateText = "Medium";
        if (cooldown < 10) fireRateText = "Very Fast";
        else if (cooldown < 20) fireRateText = "Fast";
        else if (cooldown < 50) fireRateText = "Medium";
        else if (cooldown > 80) fireRateText = "Slow";
        const specialAbility = (turretType === "wizard" && mouseOverTurret.upgrades >= 2) ? 
            "Immune to Stun" : (turretType === "froster" && mouseOverTurret.upgrades >= 2) ? 
            "Freeze Enemies" : (turretType === "sniper" && mouseOverTurret.upgrades >= 2) ? 
            "Target Invisible" : (turretType === "machinegun" && mouseOverTurret.upgrades >= 1) ? 
            "Improved Accuracy" : (turretType === "shooter2") ? 
            "Dual Gun System" : "None";
        const displayTitle = turretType === 'shooter2' ? 'Evolved Turret' : turretType.charAt(0).toUpperCase() + turretType.slice(1) + ' Turret';
        
        turretHoverInfo.innerHTML = `
            <div class="turret-hover-title">${displayTitle}</div>
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
        
        turretHoverInfo.style.left = mouseX + 50 + 'px';
        turretHoverInfo.style.top = mouseY - 150 + 'px';
        turretHoverInfo.style.display = 'block';
        
        hoveredTurret = mouseOverTurret;
    } else if (hoveredTurret !== null) {
        turretHoverInfo.style.display = 'none';
        hoveredTurret = null;
    }
}

function getTurretBeingHovered() {
    for (var turret of turrets) {
        const distanceSq = (mouseX - turret.x) ** 2 + (mouseY - turret.y) ** 2;
        const radiusSq = (turret.size / 2) ** 2;
        if (distanceSq < radiusSq && turret.placed) {
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
        
        // Create shop header with back button and title
        const shopTitleContainer = document.createElement('div');
        shopTitleContainer.className = 'shop-title-container';
        
        const backButton = document.createElement('div');
        backButton.className = 'shop-back-button';
        backButton.onclick = () => closeTurretShop();
        
        const backImg = document.createElement('img');
        backImg.src = 'images/back-button.png';
        backImg.alt = 'Back';
        backButton.appendChild(backImg);
        
        const shopTitle = document.createElement('div');
        shopTitle.className = 'shop-title';
        shopTitle.textContent = 'TURRET SHOP';
        
        shopTitleContainer.appendChild(backButton);
        shopTitleContainer.appendChild(shopTitle);
        turretMenu.appendChild(shopTitleContainer);
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
            shooter2: "Enhanced dual-gun turret. Fires twice as fast with lower damage per shot.",
            sniper: "Long-range turret with high damage. Best against strong enemies.",
            wizard: "Area damage turret. Effective against groups of enemies.",
            froster: "Slows down enemies. Great for strategic control.",
            machinegun: "Infinite range, rapid fire turret that shoots where your cursor points. Low damage but very fast."
        };
        
        const turretsToShow = [];
        for (const type in turretsStaticInfo) {
            if (type === 'shooter2') continue; // Handle evolved shooter specially
            
            const turretInfo = turretsStaticInfo[type];
            const currentCost = getCurrentTurretCost(type);
            const canAfford = money >= currentCost;
            
            const turretData = {
                type: type,
                info: turretInfo,
                cost: currentCost,
                canAfford: canAfford,
                description: turretDescriptions[type],
                hasEvolution: turretInfo.canEvolve,
                evolutionUnlocked: type === 'shooter' && totalShooterDamage >= EVOLUTION_DAMAGE_THRESHOLD
            };
            
            turretsToShow.push(turretData);
        }
        
        for (const turretData of turretsToShow) {
            const item = document.createElement('div');
            item.className = 'turret-shop-item';
            if (!turretData.canAfford) {
                item.className += ' disabled';
            }
            
            if (turretData.hasEvolution) {
                const evolutionBadge = document.createElement('div');
                evolutionBadge.className = 'evolution-badge';
                evolutionBadge.textContent = 'Evolved';
                evolutionBadge.onclick = (e) => {
                    e.stopPropagation();
                    toggleEvolutionCard(item, turretData.type);
                };
                
                if (turretData.evolutionUnlocked) {
                    evolutionBadge.classList.add('unlocked');
                } else {
                    evolutionBadge.classList.add('locked');
                }
                
                item.appendChild(evolutionBadge);
            }
            
            item.onclick = turretData.canAfford ? () => selectTurretToPlace(turretData.type) : null;
            
            const img = document.createElement('img');
            img.src = turretData.info.image;
            img.alt = turretData.info.name;
            img.className = 'turret-image';
            
            const name = document.createElement('div');
            name.className = 'turret-name';
            name.textContent = turretData.info.name;
            
            const price = document.createElement('div');
            price.className = 'price-tag';
            price.textContent = `$${turretData.cost}`;
            
            item.appendChild(img);
            item.appendChild(name);
            item.appendChild(price);
            
            const tooltip = document.createElement('div');
            tooltip.className = 'turret-tooltip';
            
            // Handle tooltip for evolution progress
            if (turretData.type === 'shooter' && !turretData.evolutionUnlocked) {
                tooltip.innerHTML = `
                    <div class="tooltip-title">${turretData.info.name}</div>
                    <div class="tooltip-description">${turretData.description}</div>
                    <div class="tooltip-stats">
                        <div class="stat-label">Damage:</div>
                        <div class="stat-value">${turretData.info.stats.damage}</div>
                        
                        <div class="stat-label">Range:</div>
                        <div class="stat-value">${turretData.info.stats.range}</div>
                        
                        <div class="stat-label">Fire Rate:</div>
                        <div class="stat-value">${turretData.info.stats.firerate}</div>
                        
                        <div class="stat-label">Effect:</div>
                        <div class="stat-value">${turretData.info.stats.effect}</div>
                    </div>
                `;
            } else {
                tooltip.innerHTML = `
                    <div class="tooltip-title">${turretData.info.name}</div>
                    <div class="tooltip-description">${turretData.description}</div>
                    <div class="tooltip-stats">
                        <div class="stat-label">Damage:</div>
                        <div class="stat-value">${turretData.info.stats.damage}</div>
                        
                        <div class="stat-label">Range:</div>
                        <div class="stat-value">${turretData.info.stats.range}</div>
                        
                        <div class="stat-label">Fire Rate:</div>
                        <div class="stat-value">${turretData.info.stats.firerate}</div>
                        
                        <div class="stat-label">Effect:</div>
                        <div class="stat-value">${turretData.info.stats.effect}</div>
                    </div>
                `;
            }
            
            item.appendChild(tooltip);
            shopGrid.appendChild(item);
        }
        turretMenu.appendChild(shopGrid);
    }
}

function selectTurretToPlace(type) {
    const currentCost = getCurrentTurretCost(type);
    
    if (type === 'shooter2' && totalShooterDamage < EVOLUTION_DAMAGE_THRESHOLD) {
        showTemporaryMessage(`Evolution requirement not met! Need ${EVOLUTION_DAMAGE_THRESHOLD - Math.round(totalShooterDamage)} more shooter damage.`, "error");
        return;
    }
    
    if (money >= currentCost) {
        selectedTurretType = type;
        isPlacingTurret = true;
        closeTurretShop(false);
        document.getElementById('gameCanvas').style.cursor = 'copy';
        updateCancelSelectionOverlay(); 
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

    if (menuButtons) {
        Array.from(menuButtons.children).forEach(button => {
            if (button.id !== 'turretMenu') {
                button.style.display = ''; 
            }
        });
    }
    const buyTextButton = document.getElementById('buyText');
    if (buyTextButton) buyTextButton.style.display = '';


    if (resetPlacement) {
        isPlacingTurret = false;
        selectedTurretType = null;
        document.getElementById('gameCanvas').style.cursor = 'default';
        updateCancelSelectionOverlay(); 
    }
}

function getCurrentTurretCost(type) {
    switch (type) {
        case 'shooter': return turretPrice;
        case 'shooter2': return evolvedShooterPrice;
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
        case 'shooter2':
            evolvedShooterPrice = Math.round(evolvedShooterPrice * evolvedShooterPriceIncreaseFactor);
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
                    : turret.type === 'shooter2'
                        ? 400
                        : 150;
    const upgradeCost = turret.type === 'sniper' ? 250 : 
                        turret.type === 'wizard' ? 260 : 
                        turret.type === 'froster' ? 270 : 
                        turret.type === 'machinegun' ? 180 : 
                        turret.type === 'shooter2' ? 200 : 120;
    const totalSpent = initialPrice + turret.upgrades * upgradeCost;

    const sellPrice = Math.round(totalSpent * 0.8);
    money += sellPrice;

    const turretIndex = turrets.indexOf(turret);
    if (turretIndex > -1) {
        // Clear target if this turret has one
        if (turret.hasFixedTarget && typeof turret.clearFixedTarget === 'function') {
            turret.clearFixedTarget();
        }
        turrets.splice(turretIndex, 1);
    }    if (turret.type === 'shooter') {
        turretPrice = Math.round(turretPrice / turretPriceIncreaseFactor);
    } else if (turret.type === 'shooter2') {
        evolvedShooterPrice = Math.round(evolvedShooterPrice / evolvedShooterPriceIncreaseFactor);
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
    turretPriceMachinegun = 350;
    
    totalShooterDamage = 0;
    evolvedShooterPrice = 400;
    
    isEasyMode = false;
    isHardMode = false;
    
    hasSeenDualPathWarning = false;
    isDualPathWarningActive = false;
    
    const difficultyScreen = document.getElementById('difficultyScreen');
    difficultyScreen.style.display = 'flex';
    
    const turretInfo = document.getElementById('turretInfo');
    turretInfo.style.display = 'none';
      const turretMenu = document.getElementById('turretMenu');
    if (turretMenu) {
       closeTurretShop(true); 
    }
    
    // Reset power-up states
    const powerUpMenu = document.getElementById('powerUpMenu');
    if (powerUpMenu) {
        closePowerUpShop();
    }    activeSpeedBoost.active = false;
    activeSpeedBoost.endTime = 0;
    activeSpeedBoost.originalCooldowns.clear();
    
    activeHealthReduction.active = false;
    activeHealthReduction.affectedEnemies.clear();
    activeHealthReduction.tintEndTime = 0;
    
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
    const range = turretPreviewInfo.stats.baseRange;

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
        case 'shooter2':
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

function checkWave() {
    const waveButton = document.getElementById("startWaveButton");
    if (waveButton) {
        const isReady = !wave.active && enemies.length === 0;
        waveButton.setAttribute('data-wave-ready', isReady ? "true" : "false");
    }
}

function toggleAutoStart() {
    autoStart = !autoStart;
    updateWaveButtonText();

    if (autoStart && !wave.active && enemies.length === 0 && !isWaveCooldown) {
        startWave();
    }
}

function unselectAllTurrets() {
    turrets.forEach(t => t.selected = false);

    updateInfo(); 
    // console.log("All turrets deselected / Unplaced turrets removed (if any).");
}

function changeTargetMode() {
    let turret = getTurretBeingSelected();
    if (turret != null) {
        turret.targetMode = (turret.targetMode + 1) % 4;  
        checkTargetMode();  
    }
}

// Power-up store
let selectedPowerUpType = null;
let isActivatingPowerUp = false;

const powerUpsStaticInfo = {
    'speedBoost': {
        name: 'Speed Boost',
        description: 'Makes all turrets shoot 50% faster for 5 seconds (scaled with game speed)',
        getCost: () => 75 + waveNumber * 20,
        image: 'images/abilities/speedboost.png',
        icon: 'speedboost.png',
        type: 'speedBoost'
    },
    'healthReduction': {
        name: 'Health Reduction',
        description: 'Reduces health of all enemies by 70% (30% for bosses/minibosses)',
        getCost: () => 150 + waveNumber * 35,
        image: 'images/abilities/healthreduced.png',
        icon: 'healthreduced.png',
        type: 'healthReduction'
    }
};

let activeSpeedBoost = {
    active: false,
    endTime: 0,
    originalCooldowns: new Map()
};

let activeHealthReduction = {
    active: false,
    affectedEnemies: new Set(),
    tintEndTime: 0
};

function handleBuyPowerUpClick() {
    const powerUpMenu = document.getElementById('powerUpMenu');
    const gameMenu = document.getElementById('gameMenu');
    const menuButtons = document.getElementById('menuButtons');
    
    if (powerUpMenu.classList.contains('power-up-shop-active')) {
        closePowerUpShop();
    } else {
        if (isPopupActive) {
            showSelectedTurretInfo(null);
        }
        turrets.forEach(t => t.selected = false);
        powerUpMenu.innerHTML = '';
        powerUpMenu.classList.add('power-up-shop-active');
        if (gameMenu) gameMenu.classList.add('shop-open');
        if (menuButtons) {
            Array.from(menuButtons.children).forEach(button => {
                if (button.id !== 'powerUpText' && button.id !== 'powerUpMenu') { 
                    button.style.display = 'none';
                }
            });
        }
        const powerUpTextButton = document.getElementById('powerUpText');
        if (powerUpTextButton) powerUpTextButton.style.display = 'none';
        
        // Create shop header with back button and title
        const shopTitleContainer = document.createElement('div');
        shopTitleContainer.className = 'shop-title-container';
        
        const backButton = document.createElement('div');
        backButton.className = 'shop-back-button';
        backButton.onclick = () => closePowerUpShop();
        
        const backImg = document.createElement('img');
        backImg.src = 'images/back-button.png';
        backImg.alt = 'Back';
        backButton.appendChild(backImg);
        
        const shopTitle = document.createElement('div');
        shopTitle.className = 'shop-title';
        shopTitle.textContent = 'POWER-UPS';
        
        shopTitleContainer.appendChild(backButton);
        shopTitleContainer.appendChild(shopTitle);
        powerUpMenu.appendChild(shopTitleContainer);
        
        const shopHeader = document.createElement('div');
        shopHeader.className = 'turret-shop-header';
        const moneyDisplay = document.createElement('div');
        moneyDisplay.className = 'shop-stat';
        moneyDisplay.innerHTML = `
            <img src="images/money.png" alt="Money">
            <div id="powerUpShopMoney" class="shop-stat-value">$${money}</div>
        `;
        const healthDisplay = document.createElement('div');
        healthDisplay.className = 'shop-stat';
        healthDisplay.innerHTML = `
            <img src="images/health.png" alt="Health">
            <div id="powerUpShopHealth" class="shop-stat-value">${health}</div>
        `;
        const waveDisplay = document.createElement('div');
        waveDisplay.className = 'shop-stat';
        waveDisplay.innerHTML = `
            <img src="images/wave.png" alt="Wave">
            <div id="powerUpShopWave" class="shop-stat-value">${waveNumber}</div>
        `;
        shopHeader.appendChild(moneyDisplay);
        shopHeader.appendChild(healthDisplay);
        shopHeader.appendChild(waveDisplay);
        powerUpMenu.appendChild(shopHeader);
        
        const shopGrid = document.createElement('div');
        shopGrid.className = 'power-up-shop-grid';
        
        for (const type in powerUpsStaticInfo) {
            const powerUpInfo = powerUpsStaticInfo[type];
            const currentCost = powerUpInfo.getCost();
            const canAfford = money >= currentCost;
            const isActive = (type === 'speedBoost' && activeSpeedBoost.active) || 
                            (type === 'healthReduction' && activeHealthReduction.active);
            
            const item = document.createElement('div');
            item.className = 'power-up-shop-item';
            if (!canAfford || isActive) {
                item.className += ' disabled';
            }
            item.onclick = (canAfford && !isActive) ? () => activatePowerUp(type) : null;
            
            const img = document.createElement('img');
            img.src = powerUpInfo.image;
            img.alt = powerUpInfo.name;
            
            const name = document.createElement('div');
            name.className = 'turret-name';
            name.textContent = powerUpInfo.name;
            
            const description = document.createElement('div');
            description.className = 'power-up-description';
            description.textContent = powerUpInfo.description;
            
            const price = document.createElement('div');
            price.className = 'price-tag';
            if (isActive) {
                price.textContent = 'ACTIVE';
                price.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            } else {
                price.textContent = `$${currentCost}`;
            }
            
            item.appendChild(img);
            item.appendChild(name);
            item.appendChild(description);
            item.appendChild(price);
              const tooltip = document.createElement('div');
            tooltip.className = 'turret-tooltip';
            
            let tooltipStats = '';
            if (type === 'speedBoost') {
                tooltipStats = `
                    <div class="stat-label">Duration:</div>
                    <div class="stat-value">5 seconds</div>
                    
                    <div class="stat-label">Effect:</div>
                    <div class="stat-value">+50% fire rate</div>
                `;
            } else if (type === 'healthReduction') {
                tooltipStats = `
                    <div class="stat-label">Duration:</div>
                    <div class="stat-value">Instant</div>
                    
                    <div class="stat-label">Effect:</div>
                    <div class="stat-value">-70% enemy HP (-30% bosses)</div>
                `;
            }
            
            tooltip.innerHTML = `
                <div class="tooltip-title">${powerUpInfo.name}</div>
                <div class="tooltip-description">${powerUpInfo.description}</div>
                <div class="tooltip-stats">
                    <div class="stat-label">Cost:</div>
                    <div class="stat-value">$${currentCost}</div>
                    
                    ${tooltipStats}
                </div>
            `;
            item.appendChild(tooltip);
            shopGrid.appendChild(item);
        }
        powerUpMenu.appendChild(shopGrid);
    }
}

function activatePowerUp(type) {
    const powerUpInfo = powerUpsStaticInfo[type];
    const currentCost = powerUpInfo.getCost();
    
    if (money >= currentCost) {
        if (type === 'speedBoost') {
            activateSpeedBoost();
        } else if (type === 'healthReduction') {
            activateHealthReduction();
        }
        money -= currentCost;
        updateInfo();
        closePowerUpShop();
        showTemporaryMessage(`${powerUpInfo.name} activated!`, "info");
    } else {
        showTemporaryMessage(`Not enough money for ${powerUpInfo.name}`, "error");
    }
}

function activateSpeedBoost() {
    if (activeSpeedBoost.active) return;
    
    activeSpeedBoost.active = true;
    activeSpeedBoost.endTime = millis() + (5000 / gameSpeed); // Scale duration with game speed
    activeSpeedBoost.originalCooldowns.clear();
    
    // Store original cooldowns and reduce them by 50%
    for (let turret of turrets) {
        if (turret.placed) {
            activeSpeedBoost.originalCooldowns.set(turret, turret.shootCooldown);
            turret.shootCooldown = turret.shootCooldown * 0.5; // 50% faster
        }
    }
}

function activateHealthReduction() {
    activeHealthReduction.active = true;
    activeHealthReduction.tintEndTime = millis() + 500; // Red tint for 0.5 seconds
    activeHealthReduction.affectedEnemies.clear();
    
    for (let enemy of enemies) {
        if (enemy.strength <= 0 || enemy.isExploding) continue;
        
        let reductionPercent = 0.7; 
        
        if (enemy.type === 'boss' || enemy.type === 'ship' || 
            enemy.type === 'miniboss1' || enemy.type === 'miniboss2' || enemy.type === 'miniboss3') {
            reductionPercent = 0.3; 
        }

        const healthReduction = Math.ceil(enemy.strength * reductionPercent);
        enemy.strength = Math.max(1, enemy.strength - healthReduction);
        activeHealthReduction.affectedEnemies.add(enemy);
    }
    
    setTimeout(() => {
        activeHealthReduction.active = false;
        activeHealthReduction.affectedEnemies.clear();
    }, 500);
}

function updateSpeedBoostEffect() {
    if (activeSpeedBoost.active && millis() >= activeSpeedBoost.endTime) {
        for (let turret of turrets) {
            if (activeSpeedBoost.originalCooldowns.has(turret)) {
                turret.shootCooldown = activeSpeedBoost.originalCooldowns.get(turret);
            }
        }
        activeSpeedBoost.active = false;
        activeSpeedBoost.originalCooldowns.clear();
        showTemporaryMessage("Speed Boost ended", "info");
    }
    
    if (activeSpeedBoost.active) {
        for (let turret of turrets) {
            if (turret.placed && !activeSpeedBoost.originalCooldowns.has(turret)) {
                activeSpeedBoost.originalCooldowns.set(turret, turret.shootCooldown);
                turret.shootCooldown = turret.shootCooldown * 0.5;
            }
        }
    }
}

function closePowerUpShop() {
    const powerUpMenu = document.getElementById('powerUpMenu');
    const gameMenu = document.getElementById('gameMenu');
    const menuButtons = document.getElementById('menuButtons');

    powerUpMenu.classList.remove('power-up-shop-active');
    if (gameMenu) gameMenu.classList.remove('shop-open');
    powerUpMenu.innerHTML = '';
    if (menuButtons) {
        Array.from(menuButtons.children).forEach(button => {
            if (button.id !== 'powerUpMenu') {
                button.style.display = '';
            }
        });
    }
    const powerUpTextButton = document.getElementById('powerUpText');
    if (powerUpTextButton) powerUpTextButton.style.display = '';
}

function updateCancelSelectionOverlay() {
    const overlay = document.getElementById('cancelSelectionOverlay');
    if (!overlay) return;
    
    const gameMenuButtons = [
        document.getElementById('buyText'),
        document.getElementById('powerUpText'),
        document.getElementById('startWaveButton'),
        ...Array.from(document.querySelectorAll('#menuButtons .hoverButton')).filter(btn => 
            btn.id !== 'buyText' && btn.id !== 'powerUpText' && btn.id !== 'startWaveButton'
        )
    ].filter(btn => btn !== null);  
    if (isPlacingTurret && selectedTurretType) {
        overlay.style.display = 'flex';
        overlay.classList.add('active');
        gameMenuButtons.forEach(button => {
            button.disabled = true;
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.5';
        });
    } else {
        overlay.style.display = 'none';
        overlay.classList.remove('active');
        gameMenuButtons.forEach(button => {
            button.disabled = false;
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        });
    }
}

let currentMouseX = 0;
let currentMouseY = 0;

function updateCancelOverlayHoverEffect() {
    const overlay = document.getElementById('cancelSelectionOverlay');
    const gameMenu = document.getElementById('gameMenu');
    if (!overlay || !gameMenu) return;
    if (isPlacingTurret && selectedTurretType && overlay.classList.contains('active')) {
        const rect = overlay.getBoundingClientRect();
        const isHovering = currentMouseX >= rect.left && currentMouseX <= rect.right && 
                          currentMouseY >= rect.top && currentMouseY <= rect.bottom;
        
        if (isHovering) {
            overlay.classList.add('hover-red');
            gameMenu.classList.add('red-blur');
        } else {
            overlay.classList.remove('hover-red');
            gameMenu.classList.remove('red-blur');
        }
    } else {
        overlay.classList.remove('hover-red');
        gameMenu.classList.remove('red-blur');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('cancelSelectionOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            closeTurretShop(true); 
        });
        
        overlay.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    }
    
    document.addEventListener('mousemove', function(event) {
        currentMouseX = event.clientX;
        currentMouseY = event.clientY;
    });
});

function checkOverlayVisibility() {
    updateCancelSelectionOverlay();
}

function updatePowerUpCosts() {
    const powerUpMenu = document.getElementById('powerUpMenu');
    if (!powerUpMenu || !powerUpMenu.classList.contains('power-up-shop-active')) {
        return; 
    }
    
    const shopItems = powerUpMenu.querySelectorAll('.turret-shop-item');
    
    let itemIndex = 0;
    for (const type in powerUpsStaticInfo) {
        if (itemIndex >= shopItems.length) break;
        
        const powerUpInfo = powerUpsStaticInfo[type];
        const currentCost = powerUpInfo.getCost();
        const canAfford = money >= currentCost;
        const isActive = (type === 'speedBoost' && activeSpeedBoost.active) || 
                        (type === 'healthReduction' && activeHealthReduction.active);
        
        const item = shopItems[itemIndex];
        const priceTag = item.querySelector('.price-tag');
        const tooltip = item.querySelector('.turret-tooltip');
        
        if (isActive) {
            priceTag.textContent = 'ACTIVE';
            priceTag.style.color = '#4CAF50';
        } else {
            priceTag.textContent = `$${currentCost}`;
            priceTag.style.color = ''; 
        }
        
        if (!canAfford || isActive) {
            item.className = 'turret-shop-item disabled';
            item.onclick = null;
        } else {
            item.className = 'turret-shop-item';
            item.onclick = () => activatePowerUp(type);
        }
        
        if (tooltip) {
            const costStatValue = tooltip.querySelector('.stat-value');
            if (costStatValue) {
                costStatValue.textContent = `$${currentCost}`;
            }
        }
        
        itemIndex++;
    }
}

function toggleEvolutionCard(cardElement, turretType) {
    if (turretType !== 'shooter') return;
    
    const isEvolved = cardElement.classList.contains('evolved');
    const evolutionUnlocked = totalShooterDamage >= EVOLUTION_DAMAGE_THRESHOLD;
    
    if (isEvolved) {
        cardElement.classList.remove('evolved');
        const img = cardElement.querySelector('.turret-image');
        const name = cardElement.querySelector('.turret-name');
        const price = cardElement.querySelector('.price-tag');
        const tooltip = cardElement.querySelector('.turret-tooltip');
        
        img.src = turretsStaticInfo.shooter.image;
        name.textContent = turretsStaticInfo.shooter.name;
        price.textContent = `$${getCurrentTurretCost('shooter')}`;
        
        // Update tooltip - normal shooter stats
        tooltip.innerHTML = `
            <div class="tooltip-title">${turretsStaticInfo.shooter.name}</div>
            <div class="tooltip-description">Basic turret with balanced stats. Good for early waves.</div>
            <div class="tooltip-stats">
                <div class="stat-label">Damage:</div>
                <div class="stat-value">${turretsStaticInfo.shooter.stats.damage}</div>
                
                <div class="stat-label">Range:</div>
                <div class="stat-value">${turretsStaticInfo.shooter.stats.range}</div>
                
                <div class="stat-label">Fire Rate:</div>
                <div class="stat-value">${turretsStaticInfo.shooter.stats.firerate}</div>
                
                <div class="stat-label">Effect:</div>
                <div class="stat-value">${turretsStaticInfo.shooter.stats.effect}</div>
            </div>
        `;
        
        cardElement.onclick = money >= getCurrentTurretCost('shooter') ? () => selectTurretToPlace('shooter') : null;
    } else {
        // Flip to evolved shooter
        cardElement.classList.add('evolved');
        const img = cardElement.querySelector('.turret-image');
        const name = cardElement.querySelector('.turret-name');
        const price = cardElement.querySelector('.price-tag');
        const tooltip = cardElement.querySelector('.turret-tooltip');
        
        img.src = turretsStaticInfo.shooter2.image;
        name.textContent = turretsStaticInfo.shooter2.name;
        price.textContent = `$${getCurrentTurretCost('shooter2')}`;
        
        if (evolutionUnlocked) {
            tooltip.innerHTML = `
                <div class="tooltip-title">${turretsStaticInfo.shooter2.name}</div>
                <div class="tooltip-description">Enhanced dual-gun turret. Fires twice as fast with lower damage per shot.</div>
                <div class="tooltip-stats">
                    <div class="stat-label">Damage:</div>
                    <div class="stat-value">${turretsStaticInfo.shooter2.stats.damage}</div>
                    
                    <div class="stat-label">Range:</div>
                    <div class="stat-value">${turretsStaticInfo.shooter2.stats.range}</div>
                    
                    <div class="stat-label">Fire Rate:</div>
                    <div class="stat-value">${turretsStaticInfo.shooter2.stats.firerate}</div>
                    
                    <div class="stat-label">Effect:</div>
                    <div class="stat-value">${turretsStaticInfo.shooter2.stats.effect}</div>
                </div>
            `;
            cardElement.onclick = money >= getCurrentTurretCost('shooter2') ? () => selectTurretToPlace('shooter2') : null;
        } else {
            tooltip.innerHTML = `
                <div class="tooltip-title">${turretsStaticInfo.shooter2.name}</div>
                <div class="tooltip-description">Enhanced dual-gun turret. Fires twice as fast with lower damage per shot.</div>
                <div class="evolution-progress">
                    <div class="evolution-progress-title">Evolution Requirement</div>
                    <div class="evolution-progress-bar">
                        <div class="evolution-progress-fill" style="width: ${Math.min(100, (totalShooterDamage / EVOLUTION_DAMAGE_THRESHOLD) * 100)}%"></div>
                    </div>
                    <div class="evolution-progress-text">${Math.round(totalShooterDamage)}/${EVOLUTION_DAMAGE_THRESHOLD} damage</div>
                </div>
            `;
            cardElement.onclick = () => {
                showTemporaryMessage(`Evolution requirement not met! Need ${EVOLUTION_DAMAGE_THRESHOLD - Math.round(totalShooterDamage)} more shooter damage.`, "error");
            };
        }
    }
    
    // Add flip animation
    cardElement.classList.add('flipping');
    setTimeout(() => {
        cardElement.classList.remove('flipping');
    }, 600);
}


