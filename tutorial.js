function toggleTutorialPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
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
    ];
  }


  
  function populateStatsTable() {
    const stats = populateStats();
    const statsSections = document.getElementById("stats-sections");
  
    stats.forEach((turret) => {
      const section = document.createElement("div");
      section.className = "turret-section";
  
      const header = document.createElement("h3");
      header.textContent = `${turret.name} Stats`;
      section.appendChild(header);
  
      const table = document.createElement("table");
      table.innerHTML = `
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
  
      const tbody = table.querySelector("tbody");
  
      for (let level = 1; level <= 4; level++) {
        const range = turret.baseRange + (level - 1) * (turret.name === "Wizard" ? 30 : 50);
        const strength = turret.baseStrength + (level - 1) * (turret.name === "Sniper" ? (4 + level) : turret.name === "Wizard" ? (2 + level) : 1);
        const cooldown = turret.baseCooldown - (level - 1) * (turret.name === "Sniper" ? 8 : turret.name === "Wizard" ? 5 : 3);
        const upgradeCost = level < 4 ? `$${turret.upgradeCost(level)}` : "Max";
        let specialAbility = turret.ability;
    
        if (turret.name === "Wizard" && level >= 3) {
            specialAbility = "Piercing Projectiles + Immune to Stun";
        }
        if (turret.name === "Froster" && level >= 3) {
          specialAbility = "Freeze + Slow Enemies";
      }
        if (turret.name === "Sniper" && level >= 3) {
          specialAbility = "Instant Hit + Target Invisible Enemies";
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
        tbody.appendChild(row);
    }
    
    section.appendChild(table);
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
      frames: {
        front: "images/enemies/robo1/front00",
        right: "images/enemies/robo1/right00",
        back: "images/enemies/robo1/back00"
      },
      frameCount: 3,
      abilities: "Basic enemy type",
      waves: "Every wave"
    },
    {
      type: "Heavy",
      frames: {
        front: "images/enemies/tank/front00",
        right: "images/enemies/tank/right00", 
        back: "images/enemies/tank/back00"
      },
      frameCount: 3,
      abilities: "130% health, 50% movement speed",
      waves: "Every 3rd wave"
    },
    {
      type: "Fast",
      frames: {
        front: "images/enemies/fast/front00",
        right: "images/enemies/fast/right00",
        back: "images/enemies/fast/back00"
      },
      frameCount: 3,
      abilities: "150% speed, 50% health", 
      waves: "Every 3rd wave"
    },
    {
      type: "Bomb",
      frames: {
        sprite: "images/enemies/bomb/frame"
      },
      frameCount: 6,
      abilities: "Explodes on death stunning nearby turrets",
      waves: "Every odd wave after wave 7"
    },
    {
      type: "Stealth",
      frames: {
        front: "images/enemies/stealth/front00",
        right: "images/enemies/stealth/right00",
        back: "images/enemies/stealth/back00"
      },
      frameCount: 3,
      abilities: "140% speed, periodically becomes invisible",
      waves: "Every 3rd wave after wave 4"
    },
    {
      type: "Healer",
      image: "images/enemies/healer.png",
      abilities: "Heals nearby enemies for 10% max health every 2s, 80% speed",
      waves: "Every 3rd wave after wave 4"
    },
    {
      type: "Miniboss",
      frames: {
        front: "images/enemies/miniboss1/front00",
        right: "images/enemies/miniboss1/right00",
        back: "images/enemies/miniboss1/back00" 
      },
      frameCount: 6,
      abilities: "170% health, 80% speed",
      waves: "Every 5th wave"
    },
    {
      type: "Boss",
      frames: {
        front: "images/enemies/boss/front00",
        right: "images/enemies/boss/right00",
        back: "images/enemies/boss/back00"
      },
      frameCount: 6,
      abilities: "300% health, 50% speed",
      waves: "Every 8th wave"
    }
  ];

  const container = document.getElementById("enemies-container");
  
  // Create canvas elements for animations
  enemies.forEach((enemy, index) => {
      const card = document.createElement("div");
      card.className = "enemy-card";
      
      let content = '';
      
      if (enemy.frames) {
        // Add canvas for animated enemies
        content += `<canvas id="enemyCanvas${index}" width="100" height="100"></canvas>`;
      } else {
        // Static image for non-animated enemies
        content += `<img src="${enemy.image}" alt="${enemy.type}">`;
      }
  
      content += `
        <h3>${enemy.type}</h3>
        <p><strong>Abilities:</strong> ${enemy.abilities}</p>
        <p><strong>Appears on:</strong> ${enemy.waves}</p>
      `;
  
      card.innerHTML = content;
      container.appendChild(card);
  
      // Set up animation if enemy has frames
      if (enemy.frames) {
        const canvas = document.getElementById(`enemyCanvas${index}`);
        const ctx = canvas.getContext('2d');
        let frame = 0;
        let frameCount = enemy.frameCount;
        const images = [];
        let counter = 0;
        const slowFactor = 12; // Slow down by 10x

        // Preload images
        for (let i = 0; i < frameCount; i++) {
          const img = new Image();
          if (enemy.frames.sprite) {
            img.src = `${enemy.frames.sprite}${i}.png`;
          } else {
            img.src = `${enemy.frames.front}${i}.png`;
          }
          images.push(img);
        }

        function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(images[frame], 0, 0, canvas.width, canvas.height);
          counter++;
          if (counter % slowFactor === 0) {
            frame = (frame + 1) % frameCount;
          }
          requestAnimationFrame(animate);
        }

        animate();
      }
    });
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
