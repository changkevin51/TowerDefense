class Wave {
    constructor() {
        this.number = 0;
        this.active = false;
        this.groupAmount = 10;
        this.groupSize = 1;
        this.timer = 0;
        this.groupDelay = 60;
        this.memberDelay = 30; 
        this.currentGroup = 0;
        this.currentMember = 0;
        this.enemyStrength = 1;
        this.enemyMaxHealth = 8;
        this.healthIncreasePerWave = 0.75;
        this.gameSpeed = gameSpeed;
        this.isBossWave = false;
        this.bonusGiven = false; 
    }

    updateDifficulty() {
        this.groupSize = Math.ceil(this.number / 5);
        this.enemyMaxHealth = Math.round((Math.pow(this.number, 1.5) * this.healthIncreasePerWave) / (this.groupSize * 0.75)) + 1;
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
            waveNumber = this.number; 
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
        // Handle boss waves
        if (this.isBossWave && this.currentGroup === 0) {
            const bossCount = Math.floor(this.number / 8); 
            const bossHealthMultiplier = bossCount === 1 
                ? this.number / 2 
                : this.number / (2.6 + bossCount * 0.8);

            if (this.timeToSpawn(this.currentGroup, this.currentMember) && this.currentMember < bossCount) {
                let health = this.enemyMaxHealth * bossHealthMultiplier;
                
                if (isEasyMode) {
                    health = Math.ceil(health * 0.8);
                } else if (isHardMode) {
                    health = Math.ceil(health * 1.1);
                }

                enemies.push(new Enemy(health, 2.8, levelOneNodes, health, 'boss'));
                this.currentMember++;

                if (this.currentMember >= bossCount) {
                    this.currentGroup++;
                    this.currentMember = 0;
                    this.active = false;
                }
                return;
            }
        }

        // bomb
        const bombGroups = isEasyMode ? [4] : isHardMode ? [2, 5, 8] : [2, 7];
        if (
            this.number >= 7 && // Start at wave 7
            this.number % 2 === 1 && // Every 2 waves
            bombGroups.includes(this.currentGroup) && // Groups 2, 5, 8
            this.currentMember === 0 
        ) {
            enemies.push(new Enemy(this.enemyMaxHealth, 3.2, levelOneNodes, this.enemyMaxHealth, 'bomb'));
            this.currentMember++; 
            return;
        }
        
        // normal
        if (this.timeToSpawn(this.currentGroup, this.currentMember)) {
            const type = this.determineEnemyType();
            let speed = isEasyMode ? 2.1 : isHardMode ? 2.55 : 2.4;
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
                    health *= (this.number*this.bossHealthMultiplyer);
                    break;
            }
    
            if (isEasyMode) {
                health = Math.ceil(health * 0.8);
            } else if (isHardMode) {
                health = Math.ceil(health * 1.15);
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
        else if (!this.active && enemies.length === 0 && !this.bonusGiven) {
            let rewardCash = isEasyMode ? 200 : isHardMode ? 135 : 150;
            let healthIncrease = isHardMode ? this.number : 2 * this.number;
            money += rewardCash;
            health += healthIncrease;
            showMoneyPopup(rewardCash);
            showHealthPopup(healthIncrease);
            updateInfo();
            this.bonusGiven = true;
        }
    }
}
