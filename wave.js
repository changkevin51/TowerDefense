class Wave {
    constructor() {
        this.number = 0;
        this.active = false;
        this.groupAmount = 10;
        this.groupSize = 1;
        this.timer = 0;
        this.groupDelay = 60;
        this.memberDelay = 20;
        this.currentGroup = 0;
        this.currentMember = 0;
        this.enemyStrength = 1;
        this.enemyMaxHealth = 8;
        this.healthIncreasePerWave = 1.2;
        this.gameSpeed = gameSpeed;
        this.isBossWave = false;
    }

    updateDifficulty() {
        this.groupSize = Math.ceil(this.number / 5);
        this.enemyMaxHealth = Math.round((Math.pow(this.number, 1.53) * this.healthIncreasePerWave) / (this.groupSize * 0.7));
    }

    start() {
        if (!this.active && enemies.length === 0) {
            this.number++;
            this.active = true;
            this.timer = 0;
            this.currentGroup = 0;
            this.currentMember = 0;

            // Check if it's a boss wave
            this.isBossWave = this.number % 8 === 0;

            this.updateDifficulty();
            checkWave();
        }
    }

    timeToSpawn(group, member) {
        const groupDuration = this.memberDelay * (this.groupSize - 1);
        const groupStart = group * (this.groupDelay + groupDuration);
        const memberStart = member * this.memberDelay; // Adjusted for speed
        return Math.abs(this.timer - (groupStart + memberStart)) < 1; // Frame-based tolerance
    }

    spawnEnemies() {
        if (this.timeToSpawn(this.currentGroup, this.currentMember)) {
            if (this.isBossWave) {
                // Boss wave logic

                const bossCount = Math.floor(this.number / 8);
                const bossHealthMultiplier = bossCount === 1 
                ? this.number / 2 
                : this.number / (3.5 + bossCount * 0.2);

                if (this.currentMember < bossCount) {
                    enemies.push(new Enemy(this.enemyMaxHealth * bossHealthMultiplier, 3, levelOneNodes, this.enemyMaxHealth * bossHealthMultiplier));
                    this.currentMember++;
                } else {
                    this.active = false; // End boss wave after all bosses are spawned
                }
            } else {
                // Normal enemy spawn logic
                enemies.push(new Enemy(this.enemyMaxHealth, 3, levelOneNodes, this.enemyMaxHealth));
                this.currentMember++;
                if (this.currentMember >= this.groupSize) {
                    this.currentGroup++;
                    this.currentMember = 0;

                    if (this.currentGroup >= this.groupAmount) {
                        this.currentGroup = 0;
                        this.active = false;
                    }
                }
            }
        }
    }

    update() {
        if (this.active) {
            this.gameSpeed = gameSpeed; // Synchronize local gameSpeed with global
            this.spawnEnemies();
            this.timer += 1 * this.gameSpeed; // Increment based on actual gameSpeed
        }
    }
}
