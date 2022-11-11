const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 15;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let chosenMaxLife = setChosenNumberByPromot();
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

function attackMonster(attackMode) {
    if (currentMonsterHealth == 0) return;

    let maxDamage;
    let logEvent;

    if (attackMode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (attackMode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;

    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
}

function attackPlayer() {
    if (currentPlayerHealth == 0) return;

    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
    attackPlayer();
    checkGameStateHandler();
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
    attackPlayer();
    checkGameStateHandler();
}

function healHandler() {
    if (currentPlayerHealth == chosenMaxLife) {
        alert("You have a full health!");
        return;
    }
    attackPlayer();
    healPlayer();
    checkGameStateHandler();
}

function healPlayer() {
    if (currentPlayerHealth + HEAL_VALUE > chosenMaxLife) {
        setPlayerHealth(chosenMaxLife);
        currentPlayerHealth = chosenMaxLife;
    } else {
        increasePlayerHealth(HEAL_VALUE);
        currentPlayerHealth += HEAL_VALUE;
    }

    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        HEAL_VALUE,
        currentMonsterHealth,
        currentPlayerHealth
    );
}

function useBonusLife() {
    hasBonusLife = false;
    removeBonusLife();
    setPlayerHealth(chosenMaxLife);
    currentPlayerHealth = chosenMaxLife;
}

function resetGameAndHealth() {
    chosenMaxLife = setChosenNumberByPromot();
    resetGame(chosenMaxLife);
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    hasBonusLife = true;
    battleLog = [];
}

function checkGameStateHandler() {
    if (currentPlayerHealth <= 0 && hasBonusLife) {
        useBonusLife();
        alert("You are alive and the Bonus Life has been used!");
        writeToLog(
            "Bonus_Life",
            chosenMaxLife,
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        currentMonsterHealth = 0;
        alert("You won!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "You won!",
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        currentPlayerHealth = 0;
        alert("You lost!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "You lost!",
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        currentPlayerHealth = 0;
        currentMonsterHealth = 0;
        alert("You have a draw!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "You have a draw!",
            currentMonsterHealth,
            currentPlayerHealth
        );
    }

    if (
        currentMonsterHealth <= 0 ||
        (currentPlayerHealth <= 0 && hasBonusLife === false)
    ) {
        alert("Game is restarted");
        resetGameAndHealth();
    }
}

function setChosenNumberByPromot() {
    let value = "";
    while (true) {
        value = parseInt(
            prompt(
                "Enter maximum life for you and the monster. (100-500)",
                "100"
            )
        );

        if (!isNaN(value) && value >= 100 && value < 500) break;
    }
    return value;
}

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
    };

    if (ev === LOG_EVENT_PLAYER_ATTACK) logEntry.target = "MONSTER";
    else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) logEntry.target = "MONSTER";
    else if (ev === LOG_EVENT_MONSTER_ATTACK) logEntry.target = "PLAYER";
    else if (ev === LOG_EVENT_PLAYER_HEAL) logEntry.target = "PLAYER";
    else if (ev === LOG_EVENT_GAME_OVER) logEntry.target = "None";

    battleLog.push(logEntry);
}

function printLogHandler() {
    console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", printLogHandler);