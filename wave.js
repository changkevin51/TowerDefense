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
        this.healthIncreasePerWave = 1.5;
        this.gameSpeed = gameSpeed;
    }

    updateDifficulty() {
        this.groupSize = Math.ceil(this.number / 4) + 1;
        // this.enemyMaxHealth = Math.round((5 + (this.number - 1) * this.healthIncreasePerWave) / (this.groupSize * 0.75))+3;
        this.enemyMaxHealth = Math.round((5 + Math.pow(this.number, 1.4) * this.healthIncreasePerWave) / (this.groupSize * 0.75)) + 3;

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
        const groupDuration = (this.memberDelay * (this.groupSize - 1));
        const groupStart = group * (this.groupDelay + groupDuration);
        const memberStart = member * (this.memberDelay); // Adjusted for speed
        return Math.abs(this.timer - (groupStart + memberStart)) < 1; // Frame-based tolerance
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
            this.gameSpeed = gameSpeed; // Synchronize local gameSpeed with global
            this.spawnEnemies();
            this.timer += 1 * this.gameSpeed; // Increment based on actual gameSpeed
        }
    }
}
