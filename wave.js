class Wave {
    constructor() {
        this.number = 0;
        this.active = false;
        this.groupAmount = 10;
        this.groupSize = 1;
        this.timer = 0;
        this.groupDelay = 60;
        this.memberDelay = 5;
        this.currentGroup = 0;
        this.currentMember = 0;
        this.enemyStrength = 1;
        this.enemyMaxHealth = 10;
        this.healthIncreasePerWave = 2;
    }

    updateDifficulty() {
        this.groupSize = Math.ceil(this.number / 3);
        this.enemyMaxHealth = Math.round((9 + (this.number - 1) * this.healthIncreasePerWave) / (this.groupSize * 0.75));
    }

    start() {
        if (!this.active && enemies.length === 0) {
            this.number++;
            this.active = true;
            this.timer = 0;
            this.currentGroup = 0;
            this.currentMember = 0;
            this.updateDifficulty();
            checkWave();
        }
    }

    timeToSpawn(group, member) {
        const groupDuration = this.memberDelay * (this.groupSize - 1);
        const groupStart = group * (this.groupDelay + groupDuration);
        const memberStart = member * this.memberDelay;
        return this.timer === groupStart + memberStart;
    }

    spawnEnemies() {
        if (this.timeToSpawn(this.currentGroup, this.currentMember)) {
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

    update() {
        if (this.active) {
            this.spawnEnemies();
            this.timer++;
        }
    }
}
