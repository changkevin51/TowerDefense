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
        baseRange: 150,
        baseStrength: 1,
        baseCooldown: 30,
        upgradeCost: (level) => (level + 1) * 120,
        ability: "None",
      },
      {
        name: "Sniper",
        baseRange: 400,
        baseStrength: 4,
        baseCooldown: 100,
        upgradeCost: (level) => (level + 1) * 250,
        ability: "Instant Hit",
      },
      {
        name: "Wizard",
        baseRange: 400,
        baseStrength: 3,
        baseCooldown: 280,
        upgradeCost: (level) => (level + 1) * 260,
        ability: "Piercing Projectiles",
      },
      {
        name: "Froster",
        baseRange: 300,
        baseStrength: 2,
        baseCooldown: 100,
        upgradeCost: (level) => (level + 1) * 270,
        ability: "Slow Enemies",
      },
      {
        name: "Machinegun",
        baseRange: Infinity,
        baseStrength: 0.6,
        baseCooldown: 7,
        upgradeCost: (level) => (level + 1) * 180,
        ability: "Targets Mouse Cursor",
      },
    ];
  }


  
  function populateStatsTable() {
    const stats = populateStats();
    const statsSections = document.getElementById("stats-sections");
    statsSections.innerHTML = ''; 
    const table = document.createElement("table");
    table.className = "stats-table"; 
    table.innerHTML = `
        <thead>
            <tr>
                <th>Turret Name</th>
                <th>Base Range</th>
                <th>Base Strength</th>
                <th>Base Cooldown</th>
                <th>Upgrade Cost (Lvl 1)</th>
                <th>Base Special Ability</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    stats.forEach((turret) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${turret.name}</td>
            <td>${turret.baseRange}</td>
            <td>${turret.baseStrength}</td>
            <td>${turret.baseCooldown}</td>
            <td>$${turret.upgradeCost(1)}</td>
            <td>${turret.ability}</td>
        `;
        tbody.appendChild(row);
    });
    statsSections.appendChild(table);

    
    stats.forEach((turret) => {
        const section = document.createElement("div");
        section.className = "turret-level-details";

        const header = document.createElement("h4"); 
        header.textContent = `${turret.name} - Level Up Stats`;
        section.appendChild(header);

        const levelTable = document.createElement("table");
        levelTable.className = "level-stats-table";
        levelTable.innerHTML = `
            <thead>
                <tr>
                    <th>Level</th>
                    <th>Range</th>
                    <th>Projectile Strength</th>
                    <th>Shoot Cooldown*</th>
                    <th>Upgrade Cost</th>
                    <th>Special Ability</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const levelTbody = levelTable.querySelector("tbody");        for (let level = 1; level <= 4; level++) {
            let range;
            if (turret.name === "Machinegun") {
                range = "Infinite";
            } else {
                range = turret.baseRange + (level - 1) * (turret.name === "Wizard" ? 30 : turret.name === "Froster" ? 10 : 50);
            }
            
            let rawStrength = turret.baseStrength + (level - 1) * (
                turret.name === "Sniper" ? (4 + level) : 
                turret.name === "Wizard" ? (2 + level) : 
                turret.name === "Machinegun" ? 0.6 : 
                1
            );

            const strength = Number.isInteger(rawStrength) ? rawStrength : parseFloat(rawStrength.toFixed(1));

            // Calculate cooldown based on turret type
            const cooldown = turret.baseCooldown - (level - 1) * (
                turret.name === "Sniper" ? 8 : 
                turret.name === "Wizard" ? 5 : 
                turret.name === "Froster" ? 8 : 
                turret.name === "Machinegun" ? 0.5 : 
                3
            );

            const upgradeCost = level < 4 ? `$${turret.upgradeCost(level)}` : "Max";
            let specialAbility = turret.ability;

            if (turret.name === "Wizard" && level >= 3) {
                specialAbility = "Piercing Projectiles + Immune to Stun";
            }
            if (turret.name === "Froster" && level >= 3) {
              specialAbility = "Freeze Enemies (Slow on bosses)";
            }
            if (turret.name === "Sniper" && level >= 3) {
              specialAbility = "Instant Hit + Target Invisible Enemies";
            }
            if (turret.name === "Machinegun" && level >= 2) {
              specialAbility = "Targets Mouse Cursor + Improved Accuracy";
            }

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${level}</td>
                <td>${range}</td>
                <td>${strength}</td>
                <td>${cooldown}</td>
                <td>${upgradeCost}</td>
                <td>${specialAbility}</td>
            `;
            levelTbody.appendChild(row);
        }
        section.appendChild(levelTable);
        statsSections.appendChild(section);
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    populateStatsTable();
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
      speedMultiplier: 1.4,
    },
    {
      type: "Healer",
      image: "images/enemies/healer.png",
      abilities: "Heals nearby enemies",
      waves: "Every 3rd wave after wave 4",
      healthMultiplier: 1,
      speedMultiplier: 0.8,
    },
    {
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
    },
    {
      type: "Boss",
      frames: {
        front: "images/enemies/boss/front00",
        right: "images/enemies/boss/right00",
        back: "images/enemies/boss/back00"
      },
      frameCount: 6,
      abilities: "Extremely high health, spawns minions once in a while",
      waves: "Every 8th wave",
      healthMultiplier: 3,
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
