function toggleTutorialPopup() {
    const popup = document.getElementById("popup");
    const isOpening = popup.style.display === "none" || popup.style.display === "";
    popup.style.display = isOpening ? "block" : "none";

    document.querySelectorAll('.tab-button').forEach(button => button.style.display = ''); 

    if (isOpening) {
        const firstTabButton = document.querySelector('.tab-button');
        let defaultTabId = 'tutorial'; 
        if (firstTabButton) {
            
            const onclickAttr = firstTabButton.getAttribute('onclick');
            const match = onclickAttr ? onclickAttr.match(/showTab\\('([^']+)'\\)/) : null;
            if (match && match[1]) {
                defaultTabId = match[1];
            }
        }
        showTab(defaultTabId);
    }
}

function showTab(tabId) {
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none'; 
        tab.classList.remove('active');
    });

    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    
    const selectedTabContent = document.getElementById(tabId);
    if (selectedTabContent) {
        selectedTabContent.style.display = 'block'; 
        selectedTabContent.classList.add('active');
    }

    const selectedTabButton = document.querySelector(`.tab-button[onclick*="showTab('${tabId}')"]`);
    if (selectedTabButton) {
        selectedTabButton.classList.add('active');
    }
}
  
function closePopup() {
    document.getElementById('popup').style.display = 'none';
    
    document.querySelectorAll('.tab-button').forEach(button => button.style.display = ''); 
}
  

function populateStats() {
    return [
      {
        name: "Shooter",
        image: "images/turrets/shooter.png",
        baseRange: 150,
        baseStrength: 1,
        baseCooldown: 30,
        upgradeCost: (level) => (level + 1) * 120,
        ability: "Basic projectile turret",
        description: "A reliable, all-purpose turret that fires single projectiles at enemies. Great for beginners and early waves.",
        levelAbilities: {
          1: "Basic projectile turret with standard targeting",
          2: "Improved reload speed and slightly faster projectiles",
          3: "Shoots even faster projectiles",
          4: "Optimized for better accuracy and range"
        },
        statGrowth: {
          range: level => 150 + (level * 30), // +30 range per level
          damage: level => 1 + (level * 1),   // +1 damage per level
          cooldown: level => Math.max(15, 30 - (level * 5)) // -5 cooldown per level, min 15
        }
      },
      {
        name: "Sniper",
        image: "images/turrets/sniper.png", 
        baseRange: 400,
        baseStrength: 4,
        baseCooldown: 100,
        upgradeCost: (level) => (level + 1) * 250,
        ability: "Instant Hit",
        description: "Long-range precision turret with high damage. Perfect for taking down tough enemies and bosses from a distance.",
        levelAbilities: {
          1: "Instant hit projectiles with extreme range",
          2: "Improved damage and slightly faster reload",
          3: "Can target and hit invisible/stealth enemies",
          4: "Armor piercing rounds that deal extra damage to heavy enemies"
        },
        statGrowth: {
          range: level => 400 + (level * 50), // +50 range per level
          damage: level => 4 + (level * 8),   // +8 damage per level
          cooldown: level => Math.max(70, 100 - (level * 10)) // -10 cooldown per level, min 70
        }
      },
      {
        name: "Wizard",
        image: "images/turrets/wizard.png",
        baseRange: 400,
        baseStrength: 3,
        baseCooldown: 280,
        upgradeCost: (level) => (level + 1) * 260,
        ability: "Piercing Projectiles",
        description: "Magical turret that fires projectiles through multiple enemies. Excellent for handling groups of weaker enemies.",
        levelAbilities: {
          1: "Piercing projectiles that hit multiple enemies in a line",
          2: "Burn effect that deals damage over time",
          3: "Immune to stun effects from Bomb enemies",
          4: "Faster reload and increased damage"
        },
        // Stat growth per level
        statGrowth: {
          range: level => 400 + (level * 25), // +25 range per level
          damage: level => 3 + (level * 6),   // +6 damage per level
          cooldown: level => Math.max(200, 280 - (level * 20)) // -20 cooldown per level, min 200
        }
      },
      {
        name: "Froster",
        image: "images/turrets/froster.png",
        baseRange: 300,
        baseStrength: 2,
        baseCooldown: 100,
        upgradeCost: (level) => (level + 1) * 270,
        ability: "Slow Enemies",
        description: "Ice-based turret that slows enemies while dealing damage. Great for crowd control and supporting other turrets.",
        levelAbilities: {
          1: "Slows enemies by 30% for a short duration",
          2: "Increased slow effect (40%) and longer duration",
          3: "Freezes enemies completely for 0.8 seconds instead of slowing",
          4: "Increased freeze duration (1 second)"
        },
        statGrowth: {
          range: level => 300 + (level * 10),
          damage: level => 2 + (level * 1),
          cooldown: level => Math.max(70, 100 - (level * 10)),
          slowEffect: level => 0.7 - (level * 0.1) 
        }
      },
      {
        name: "Machinegun",
        image: "images/turrets/machinegun.png",
        baseRange: Infinity,
        baseStrength: 0.6,
        baseCooldown: 7,
        upgradeCost: (level) => (level + 1) * 180,
        ability: "Targets Mouse Cursor",
        description: "High-speed automatic turret that follows your mouse cursor. Requires manual aiming but offers rapid fire rate.",
        levelAbilities: {
          1: "Manual targeting with unlimited range and rapid fire",
          2: "Reduced recoil and improved accuracy",
          3: "Lock Mode + improved accuracy",
          4: "Even faster shooting and reload!"
        },
        statGrowth: {
          range: level => Infinity,
          damage: level => 0.6 + (level * 0.6), 
          cooldown: level => Math.max(4, 7 - level) 
        }
      },
    ];
  }
function populateStatsTable() {
    const stats = populateStats();
    const statsSections = document.getElementById("stats-sections");
    statsSections.innerHTML = ''; 
    const turretGrid = document.createElement("div");
    turretGrid.className = "turret-overview-grid";
    
    stats.forEach((turret, index) => {
        const card = document.createElement("div");
        card.className = "turret-card";

        const levelSelector = document.createElement("div");
        levelSelector.className = "level-selector";
        levelSelector.innerHTML = `
            <h4>Upgrade Level</h4>
            <div class="level-buttons">
                <button class="level-btn active" data-level="1" data-turret="${index}">1</button>
                <button class="level-btn" data-level="2" data-turret="${index}">2</button>
                <button class="level-btn" data-level="3" data-turret="${index}">3</button>
                <button class="level-btn" data-level="4" data-turret="${index}">4</button>
            </div>
        `;
        
        const statsContainer = document.createElement("div");
        statsContainer.className = "turret-stats-container";
        statsContainer.id = `turret-stats-${index}`;
        updateTurretCardStats(statsContainer, turret, 1);
        
        card.innerHTML = `
            <div class="turret-card-header">
                <img src="${turret.image}" alt="${turret.name}" class="turret-card-image">
                <h3 class="turret-card-name">${turret.name}</h3>
            </div>
            <div class="turret-card-content">
                <p class="turret-description">${turret.description}</p>
            </div>
        `;
        
        const cardContent = card.querySelector('.turret-card-content');
        cardContent.appendChild(levelSelector);
        cardContent.appendChild(statsContainer);
        
        turretGrid.appendChild(card);
    });
    
    statsSections.appendChild(turretGrid);
    
    document.querySelectorAll('.level-btn').forEach(button => {
        button.addEventListener('click', function() {
            const level = parseInt(this.getAttribute('data-level'));
            const turretIndex = parseInt(this.getAttribute('data-turret'));
            const parentButtons = this.parentElement.querySelectorAll('.level-btn');
            parentButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const statsContainer = document.getElementById(`turret-stats-${turretIndex}`);
            updateTurretCardStats(statsContainer, stats[turretIndex], level);
        });
    });
}

function updateTurretCardStats(container, turret, level) {
    const range = turret.statGrowth.range(level - 1);
    const damage = turret.statGrowth.damage(level - 1);
    const cooldown = turret.statGrowth.cooldown(level - 1);
    const cost = turret.upgradeCost(level - 1);

    const levelAbility = turret.levelAbilities[level] || turret.ability;
    
    const slowEffect = turret.name === "Froster" 
        ? `<div class="quick-stat">
            <span class="stat-label">Slow Effect:</span>
            <span class="stat-value">${(100 - turret.statGrowth.slowEffect(level - 1) * 100).toFixed(0)}% slower</span>
           </div>` 
        : '';
    
    container.innerHTML = `
        <h4 class="stats-level-indicator">Level ${level} Stats</h4>
        <div class="level-ability-display">
            <span class="ability-label">Level ${level} Ability</span>
            <span class="ability-text">${levelAbility}</span>
        </div>
        <div class="turret-quick-stats">
            <div class="quick-stat">
                <span class="stat-label">Range:</span>
                <span class="stat-value">${range === Infinity ? '∞' : range}</span>
            </div>
            <div class="quick-stat">
                <span class="stat-label">Damage:</span>
                <span class="stat-value">${damage}</span>
            </div>
            <div class="quick-stat">
                <span class="stat-label">Fire Rate:</span>
                <span class="stat-value">${getSpeedRating(cooldown)}</span>
            </div>
            <div class="quick-stat">
                <span class="stat-label">Cost:</span>
                <span class="stat-value">$${cost}</span>
            </div>
            ${slowEffect}
        </div>
        <div class="shots-per-second">
            <span>${getFireRateDescription(cooldown)}</span>
        </div>
    `;
}


function getSpeedRating(cooldown) {
    if (cooldown < 10) return "Very Fast";
    if (cooldown < 40) return "Fast";
    if (cooldown < 120) return "Medium";
    if (cooldown < 200) return "Slow";
    return "Very Slow";
}


function getFireRateDescription(cooldown) {
    const shotsPerSecond = Math.round((60 / cooldown) * 10) / 10;
    return `${shotsPerSecond}/sec (${getSpeedRating(cooldown)})`;
}

function populatePowerUps() {
    const powerUps = [
        {
            name: "Speed Boost",
            image: "images/abilities/speedboost.png",
            description: "Increases all turret fire rates by 50% for 5 seconds",
            baseCost: 150,
            costIncrease: 35,
            duration: "5 seconds",
            effect: "+50% fire rate",
            tips: "Best used during heavy enemy waves or boss fights"
        },
        {
            name: "Health Reduction", 
            image: "images/abilities/healthreduced.png",
            description: "Instantly reduces health of all enemies by 70% (30% for bosses/minibosses)",
            baseCost: 150,
            costIncrease: 35,
            duration: "Instant",
            effect: "-70% enemy HP (-30% bosses)",
            tips: "Perfect for clearing overwhelming waves or weakening tough enemies"
        }
    ];

    const container = document.getElementById("powerups-container");
    container.innerHTML = '';

    const powerUpGrid = document.createElement("div");
    powerUpGrid.className = "powerup-overview-grid";

    powerUps.forEach((powerUp) => {
        const card = document.createElement("div");
        card.className = "powerup-card";
        
        card.innerHTML = `
            <div class="powerup-card-header">
                <img src="${powerUp.image}" alt="${powerUp.name}" class="powerup-card-image">
                <h3 class="powerup-card-name">${powerUp.name}</h3>
            </div>
            <div class="powerup-card-content">
                <p class="powerup-description">${powerUp.description}</p>
                <div class="powerup-stats">
                    <div class="powerup-stat">
                        <span class="stat-label">Duration:</span>
                        <span class="stat-value">${powerUp.duration}</span>
                    </div>
                    <div class="powerup-stat">
                        <span class="stat-label">Effect:</span>
                        <span class="stat-value">${powerUp.effect}</span>
                    </div>
                    <div class="powerup-stat">
                        <span class="stat-label">Base Cost:</span>
                        <span class="stat-value">$${powerUp.baseCost}</span>
                    </div>
                    <div class="powerup-stat">
                        <span class="stat-label">Cost Growth:</span>
                        <span class="stat-value">+$${powerUp.costIncrease}/wave</span>
                    </div>
                </div>
                <div class="powerup-tips">
                    <span class="tips-label">💡 Tip:</span>
                    <span class="tips-text">${powerUp.tips}</span>
                </div>
            </div>
        `;
        
        powerUpGrid.appendChild(card);
    });

    container.appendChild(powerUpGrid);

    const usageGuide = document.createElement("div");
    usageGuide.className = "powerup-usage-guide";
    usageGuide.innerHTML = `
        <h2 class="section-header">🎮 How to Use Power-ups</h2>
        <div class="usage-steps">
            <div class="usage-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h4>Purchase</h4>
                    <p>Click the "Buy Power-up" button in the game menu</p>
                </div>
            </div>
            <div class="usage-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>Select</h4>
                    <p>Choose the power-up you want from the shop</p>
                </div>
            </div>
            <div class="usage-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Activate</h4>
                    <p>Click on the power-up to activate it instantly</p>
                </div>
            </div>
        </div>
        <div class="powerup-notes">
            <h3>📋 Important Notes</h3>
            <ul>
                <li>Power-up costs increase with each wave</li>
                <li>Only one of each type can be active at a time</li>
                <li>Speed Boost affects all placed turrets</li>
                <li>Health Reduction affects all enemies currently on the map</li>
            </ul>
        </div>
    `;
    
    container.appendChild(usageGuide);
}

  document.addEventListener("DOMContentLoaded", () => {
    populateStatsTable();
    populatePowerUps();
  });
  
function populateEnemies() {
  const enemies = [
    {
      type: "Robo",
      variants: [ 
        { name: "Robo1", basePath: "images/enemies/robo1/front00", frameCount: 3 },
        { name: "Robo2", basePath: "images/enemies/robo2/front00", frameCount: 3 },
        { name: "Robo3", basePath: "images/enemies/robo3/front00", frameCount: 3 },
      ],
      abilities: "Basic enemy type, multiple visual variants",
      waves: "Every wave",
      healthMultiplier: 1,
      speedMultiplier: 1,
    },
    {
      type: "Heavy",
      frames: {
        front: "images/enemies/tank/front00",
        right: "images/enemies/tank/right00", 
        back: "images/enemies/tank/back00"
      },
      frameCount: 3,
      abilities: "High health, slow speed",
      waves: "Every 3rd wave",
      healthMultiplier: 1.3,
      speedMultiplier: 0.5,
    },
    {
      type: "Fast",
      frames: {
        front: "images/enemies/fast/front00",
        right: "images/enemies/fast/right00",
        back: "images/enemies/fast/back00"
      },
      frameCount: 3,
      abilities: "Low health, very fast speed", 
      waves: "Every 3rd wave",
      healthMultiplier: 0.5,
      speedMultiplier: 1.5,
    },
    {
      type: "Bomb",
      frames: {
        sprite: "images/enemies/bomb/frame"
      },
      frameCount: 6,
      abilities: "Explodes on death, stunning nearby turrets",
      waves: "Every odd wave after wave 7",
      healthMultiplier: 0.8,
      speedMultiplier: 0.9,
    },
    {
      type: "Stealth",
      frames: {
        front: "images/enemies/stealth/front00",
        right: "images/enemies/stealth/right00",
        back: "images/enemies/stealth/back00"
      },
      frameCount: 3,
      abilities: "Periodically becomes invisible, fast",
      waves: "Every 3rd wave after wave 4",
      healthMultiplier: 0.9,
      speedMultiplier: 1.4,    },
    {
      type: "Healer",
      frames: {
        front: "images/enemies/healer/front00",
        right: "images/enemies/healer/right00",
        back: "images/enemies/healer/back00"
      },
      frameCount: 3,
      abilities: "Heals nearby enemies",
      waves: "Every 3rd wave after wave 4",
      healthMultiplier: 1,
      speedMultiplier: 0.8,
    },    {
      type: "Miniboss",
      frames: {
        front: "images/enemies/miniboss1/front00",
        right: "images/enemies/miniboss1/right00",
        back: "images/enemies/miniboss1/back00" 
      },
      frameCount: 6,
      abilities: "Very high health, moderate speed",
      waves: "Every 5th wave",
      healthMultiplier: 1.7,
      speedMultiplier: 0.8,
    },    {
      type: "Boss",
      frames: {
        front: "images/enemies/boss/front00",
        right: "images/enemies/boss/right00",
        back: "images/enemies/boss/back00" 
      },
      frameCount: 6,
      abilities: "Very high health, Nonchalant",
      waves: "Every 5th wave",
      healthMultiplier: 2.2,
      speedMultiplier: 0.6,
    },
    {
      type: "Ship Boss",
      frames: {
        front: "images/enemies/ship/tile00",
        right: "images/enemies/ship/tile00",
        back: "images/enemies/ship/tile00"
      },
      frameCount: 6,
      abilities: "Massive ship with extremely high health, spawns minions",
      waves: "Every 10th wave",
      healthMultiplier: 2.65,
      speedMultiplier: 0.5,
    }
  ];

  const container = document.getElementById("enemies-container");
  container.innerHTML = ''; 

  const table = document.createElement('table');
  table.className = 'enemies-table'; 
  table.innerHTML = `
    <thead>
      <tr>
        <th>Animation</th>
        <th>Type</th>
        <th>Abilities</th>
        <th>Appears On</th>
        <th>Health Mod</th>
        <th>Speed Mod</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;
  const tbody = table.querySelector('tbody');

  enemies.forEach((enemy, index) => {
    const row = document.createElement('tr');
    
    const imageCell = document.createElement('td');
    
    if (enemy.type === "Robo" && enemy.variants) {
      const variantContainer = document.createElement('div');
      variantContainer.style.display = 'flex'; 
      variantContainer.style.gap = '5px'; 

      enemy.variants.forEach((variant, variantIndex) => {
        const canvas = document.createElement('canvas');
        
        canvas.id = `enemyCanvasTutorial${index}_variant${variantIndex}`; 
        canvas.width = 50; 
        canvas.height = 50;
        variantContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let currentFrame = 0;
        const frameCount = variant.frameCount;
        const images = [];
        let loadedImagesCount = 0;
        let animationStarted = false;
        let animationLoopCounter = 0;
        const slowFactor = 12;

        function animateVariantInTable() {
          if (!canvas.isConnected) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const imgToDraw = images[currentFrame];
          if (imgToDraw && imgToDraw.complete && imgToDraw.naturalHeight !== 0) {
            ctx.drawImage(imgToDraw, 0, 0, canvas.width, canvas.height);
          }
          animationLoopCounter++;
          if (animationLoopCounter % slowFactor === 0) {
            currentFrame = (currentFrame + 1) % (images.length || 1); 
          }
          requestAnimationFrame(animateVariantInTable);
        }

        function attemptStartVariantAnimation() {
          if (!animationStarted && loadedImagesCount === frameCount && images.length === frameCount) {
            animationStarted = true;
            if (images.length > 0) {
              animateVariantInTable();
            }
          }
        }

        for (let i = 0; i < frameCount; i++) {
          const img = new Image();

          img.src = `${variant.basePath}${i}.png`; 
          img.onload = () => {
            loadedImagesCount++;
            attemptStartVariantAnimation();
          };
          img.onerror = () => {
            
            loadedImagesCount++;
            attemptStartVariantAnimation();
          };
          images.push(img);
        }
        if (images.length === frameCount && loadedImagesCount === frameCount && !animationStarted) {
          attemptStartVariantAnimation();
        }
      });
      imageCell.appendChild(variantContainer);

    } else if (enemy.frames && enemy.frameCount > 0) { 
      const canvas = document.createElement('canvas');
      canvas.id = `enemyCanvasTutorial${index}`;
      canvas.width = 80; 
      canvas.height = 80;
      imageCell.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      let currentFrame = 0; 
      const frameCount = enemy.frameCount;
      const images = [];
      let loadedImagesCount = 0;
      let animationStarted = false;
      let animationLoopCounter = 0; 
      const slowFactor = 12;

      function animateEnemyInTable() {
        if (!canvas.isConnected) return; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const imgToDraw = images[currentFrame];
        if (imgToDraw && imgToDraw.complete && imgToDraw.naturalHeight !== 0) {
            ctx.drawImage(imgToDraw, 0, 0, canvas.width, canvas.height);
        }
        animationLoopCounter++;
        if (animationLoopCounter % slowFactor === 0) {
          currentFrame = (currentFrame + 1) % (images.length || 1);
        }
        requestAnimationFrame(animateEnemyInTable);
      }

      function attemptStartAnimation() {
        if (!animationStarted && loadedImagesCount === frameCount && images.length === frameCount) {
          animationStarted = true;
          if (images.length > 0) { 
            animateEnemyInTable();
          }
        }
      }
      
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        let imgSrc = '';
        if (enemy.frames.sprite) {
          imgSrc = `${enemy.frames.sprite}${i}.png`;
        } else {
          const basePath = enemy.frames.front || enemy.frames.right || enemy.frames.back;
          if (basePath) {
            
            imgSrc = `${basePath}${i}.png`; 
          } else {
            loadedImagesCount++; 
            images.push(img); 
            if (i === frameCount - 1) attemptStartAnimation(); 
            continue;
          }
        }
        img.src = imgSrc;
        img.onload = () => {
          loadedImagesCount++;
          attemptStartAnimation();
        };
        img.onerror = () => {
          loadedImagesCount++; 
          attemptStartAnimation();
        };
        images.push(img);
      }
      if (images.length === frameCount && loadedImagesCount === frameCount && !animationStarted) {
          attemptStartAnimation();
      }

    } else if (enemy.image) { 
      const img = document.createElement('img');
      img.src = enemy.image;
      img.alt = enemy.type;
      img.style.width = '80px'; 
      img.style.height = '80px';
      imageCell.appendChild(img);
    }
    row.appendChild(imageCell);

    
    const typeCell = document.createElement('td');
    typeCell.textContent = enemy.type;
    row.appendChild(typeCell);

    const abilitiesCell = document.createElement('td');
    abilitiesCell.textContent = enemy.abilities;
    row.appendChild(abilitiesCell);

    const wavesCell = document.createElement('td');
    wavesCell.textContent = enemy.waves;
    row.appendChild(wavesCell);

    const healthModCell = document.createElement('td');
    healthModCell.textContent = `x${enemy.healthMultiplier}`;
    row.appendChild(healthModCell);

    const speedModCell = document.createElement('td');
    speedModCell.textContent = `x${enemy.speedMultiplier}`;
    row.appendChild(speedModCell);
    
    tbody.appendChild(row);
  });

  container.appendChild(table);
}
document.addEventListener("DOMContentLoaded", () => {
  populateEnemies();
});


function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
  } else {
      dropdown.style.display = "block";
  }
}
