class Wave {
    constructor() {
        this.number = 0;
        this.active = false;
        this.groupAmount = 10;
        this.groupSize = 1;
        this.timer = 0;
        this.groupDelay = 60;
        this.memberDelay = 30; // Increase spacing between enemies
        this.currentGroup = 0;
        this.currentMember = 0;
        this.enemyStrength = 1;
        this.enemyMaxHealth = 8;
        this.healthIncreasePerWave = 1.1;
        this.gameSpeed = gameSpeed;
        this.isBossWave = false;
        this.bonusGiven = false; // New flag
    }

    updateDifficulty() {
        this.groupSize = Math.ceil(this.number / 5);
        this.enemyMaxHealth = Math.round((Math.pow(this.number, 1.4) * this.healthIncreasePerWave) / (this.groupSize * 0.75)) + 1;
    }

    determineEnemyType() {
        if (this.isBossWave) return 'boss';
        if (this.number % 3 === 0 && this.currentGroup % 2 === 0) return 'heavy';
        if ((this.number + 1) % 3 === 0 && this.currentGroup % 2 === 0) return 'fast';
        return 'normal';
    }

    start() {
        if (!this.active && enemies.length === 0) {
            this.number++;
            waveNumber = this.number; // keep waveNumber in sync
            this.active = true;
            this.timer = 0;
            this.currentGroup = 0;
            this.currentMember = 0;
            this.isBossWave = this.number % 8 === 0;

            this.groupAmount = this.isBossWave ? 1 : 10;
            this.bonusGiven = false; // Reset flag

            this.updateDifficulty();
            checkWave();
        }
    }

    timeToSpawn(group, member) {
        const groupDuration = this.memberDelay * (this.groupSize - 1);
        const groupStart = group * (this.groupDelay + groupDuration);
        const memberStart = member * this.memberDelay;
        const spawnTime = groupStart + memberStart;
        const withinTime = this.timer >= spawnTime && this.timer < spawnTime + this.gameSpeed;

        return withinTime;
    }

    spawnEnemies() {
        // bomb
        if (
            this.number >= 7 && // Start at wave 7
            this.number % 2 === 1 && // Every 2 waves
            [2, 5, 8].includes(this.currentGroup) && // Groups 2, 5, 8
            this.currentMember === 0 
        ) {
            enemies.push(new Enemy(this.enemyMaxHealth, 3.2, levelOneNodes, this.enemyMaxHealth, 'bomb'));
            this.currentMember++; 
            return;
        }
        
        // normal
        if (this.timeToSpawn(this.currentGroup, this.currentMember)) {
            const type = this.determineEnemyType();
            let speed = 2.5;
            let health = this.enemyMaxHealth;
    
            switch (type) {
                case 'heavy':
                    speed *= 0.5;
                    health *= 1.3;
                    break;
                case 'fast':
                    speed *= 1.5;
                    health *= 0.5;
                    break;
                case 'boss':
                    health *= this.number;
                    break;
            }
    
            const newEnemy = new Enemy(health, speed, levelOneNodes, health, type);
            enemies.push(newEnemy);
            this.currentMember++;
    
            if (this.currentMember >= this.groupSize) {
                this.currentGroup++;
                this.currentMember = 0;
    
                if (this.isBossWave || this.currentGroup >= this.groupAmount) {
                    this.currentGroup = 0;
                    this.active = false;
                }
            }
        }
    }
    

    update() {
        if (this.active) {
            this.gameSpeed = gameSpeed;
            this.spawnEnemies();
            this.timer += 1 * this.gameSpeed;
            
        }
        // Give bonus after last enemy is destroyed
        else if (!this.active && enemies.length === 0 && !this.bonusGiven) {
            let rewardCash = 150;
            let healthIncrease = 2 * this.number;
            money += rewardCash;
            health += healthIncrease;
            showMoneyPopup(rewardCash);
            showHealthPopup(healthIncrease);
            updateInfo();
            this.bonusGiven = true;
        }
    }
}
