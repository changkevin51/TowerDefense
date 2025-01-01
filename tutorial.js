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
        const cooldown = turret.baseCooldown - (level - 1) * (turret.name === "Sniper" ? 8 : turret.name === "Wizard" ? 5 : 5);
        const upgradeCost = level < 4 ? `$${turret.upgradeCost(level)}` : "Max";
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${level}</td>
          <td>${range}</td>
          <td>${strength}</td>
          <td>${cooldown}</td>
          <td>${upgradeCost}</td>
          <td>${turret.ability}</td>
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
      type: "Normal",
      image: "images/enemies/normal1.png",
      abilities: "None",
      waves: "Every wave",
    },
    {
      type: "Heavy",
      image: "images/enemies/heavy1.png",
      abilities: "High health but slower speed",
      waves: "Every 3 waves, starting on wave 3",
    },
    {
      type: "Fast",
      image: "images/enemies/fast1.png",
      abilities: "Increased speed but lower health",
      waves: "Every 3 waves, starting on wave 2",
    },
    {
      type: "Bomb",
      image: "images/enemies/bomb.png",
      abilities: "Explodes on death, stunning nearby turrets",
      waves: "Every odd-numbered wave (Starting on wave 7)",
    },
    {
      type: "Boss1",
      image: "images/enemies/boss1.png",
      abilities: "Extremely high health and powerful",
      waves: "Boss waves (every 8th wave)",
    },
  ];

  const container = document.getElementById("enemies-container");
  enemies.forEach((enemy) => {
    const card = document.createElement("div");
    card.className = "enemy-card";

    card.innerHTML = `
      <img src="${enemy.image}" alt="${enemy.type}">
      <h3>${enemy.type}</h3>
      <p><strong>Abilities:</strong> ${enemy.abilities}</p>
      <p><strong>Appears on:</strong> ${enemy.waves}</p>
    `;

    container.appendChild(card);
  });
}

// Populate the enemies tab on DOMContentLoaded
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
