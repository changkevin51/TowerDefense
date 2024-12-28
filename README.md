# Tower Defense Game

NOTE: THIS GAME IS DESIGNED TO BE HARD. STRATEGY IS REQUIRED TO GET THROUGH FURTHER WAVES. 

A fun tower defense game made with JavaScript and p5.js. Players defend their base by placing turrets, earning money, and surviving waves of enemies.

Personal Record: Wave 40

---

## Features
- **Core Mechanics**:
  - Place turrets to stop enemies from advancing.
  - Upgrade turrets for better efficiency/damage.
  - Earn money by damaging enemies and surviving waves.
  - **NEW**: Adjust game speed between normal (1x), medium (1.5x) and fast (2x).
- **UI Integration**:
  - Display stats like money, health, wave status, and turret prices.
  - Buttons for buying and upgrading turrets.
  - Health and wave indicators for enemies and bosses.
- **Gameplay**:
  - Enemies grow stronger with each wave.
  - Collision system between projectiles and enemies.
  - Turret prices increase as you progress!

---

## How to Play
1. **Start the Game**:
   - You begin with $1000, 100 health, and a free turret :)
2. **Place Turrets**:
   - Click "Buy Turret" to purchase a turret (requires money).
   - Place the turret on valid spots in the game area (Think about strategic placements).
3. **Upgrade Turrets**:
   - Select a turret and click "Upgrade" to enhance its stats.
4. **Switch Target Modes**:
   - Use arrow keys to change turret target modes:
     - **Mode 0**: Targets the closest enemy.
     - **Mode 1**: Targets the strongest enemy.
     - **Mode 2**: Targets the first enemy.
5. **Start Waves**:
   - Click "Start Wave" when the current wave is ready.
   - Defeat enemies before they deplete your health.
   - **NEW**: Waves will auto start by default when "Start Wave" is clicked. You can disable this by clicking the button again while wave is active.
6. **Adjust Game Speed**:
   - Use the "Toggle Speed" button to switch between 1x, 1.5x, and 2x speed.

---

## Key Stats
- **Money**: Starts at 1000 and increases by 100 every wave. Used to buy and upgrade turrets.
- **Health**: Starts at 100 and increases by 20 every wave. The game is over when health reaches 0.
- **Turret Prices**: Starts at $150, increases with each turret bought.
- **Wave Number**: Tracks your progress through enemy waves.

---

## Controls
- **Mouse**:
  - Click to place turrets.
  - Click on turrets to select them for upgrades or targeting changes.
- **Keyboard**:
  - Left/Right Arrow: Change targeting mode of the selected turret.
- **Buttons**:
  - Buy Turret: Purchase a new turret.
  - Upgrade: Upgrade the selected turret.
  - Start Wave: Begin the next wave.
  - Toggle Speed: Switch between normal and fast gameplay.

---

## Setup
1. Clone the repository:
```bash
git clone https://github.com/changkevin51/Tower-Defense-Game.git
```
2. Run `index.html ` in a web browser
```bash
start index.html
```
or use Live Preview extension in VS Code

## Future ideas
- ✅ <del>Boss waves 
- ✅ <del>Auto start waves
- Add more turret types with unique abilities.
  - ✅ Sniper
- Introduce different enemy types.
- Implement animations and sound effects.
  - ✅ Sniper hit effect
- Add maps and levels
- Increase max upgrade level
- Add Tutorial




