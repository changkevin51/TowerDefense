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
        baseStrength: 4,
        baseCooldown: 180,
        upgradeCost: (level) => (level + 1) * 250,
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
        const strength = turret.baseStrength + (level - 1) * (turret.name === "Sniper" || turret.name === "Wizard" ? 4 + level : 1);
        const cooldown = turret.baseCooldown - (level - 1) * (turret.name === "Sniper" ? 8 : turret.name === "Wizard" ? 2 : 5);
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
  


function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
  } else {
      dropdown.style.display = "block";
  }
}
