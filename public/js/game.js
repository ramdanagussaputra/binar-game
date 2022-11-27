const enterRoomEl = document.querySelector('.enter-room');
const generateRoomEl = document.querySelector('.generate-room');
const joinRoomEl = document.querySelector('.join-room');
const generateFormEl = document.querySelector('.generate-form');
const joinFormEl = document.querySelector('.join-form');
const generateInputEl = document.querySelector('.generate-input');
const joinInputEl = document.querySelector('.join-input');
const gameEl = document.querySelector('.game');
const resultMessageBoxEl = document.querySelector('.middle-text');
const resultMessageEl = document.querySelector('.winner-text');
const enemyNameEl = document.querySelector('.player-text--enemy');
const youNameEl = document.querySelector('.player-text--you');
const scoreYouEl = document.querySelector('.score-player');
const scoreEnemyEl = document.querySelector('.score-com');

const btnEnterGenerateRoom = document.querySelector('.btn--room--generate-room');
const btnEnterJoinRoom = document.querySelector('.btn--room--Join-room');
const btnCreateRoom = document.querySelector('.btn--create-room');
const btnJoinRoom = document.querySelector('.btn--join-room');
const btnCancel = document.querySelectorAll('.btn--cancel');
const btnReset = document.querySelector('.img-refresh');
const btnSaveScore = document.querySelector('.btn-score');

const rockP1 = document.querySelector('.p1-rock');
const paperP1 = document.querySelector('.p1-paper');
const scissorP1 = document.querySelector('.p1-scissor');
const rockEnemy = document.querySelector('.com-rock');
const paperEnemy = document.querySelector('.com-paper');
const scissorEnemy = document.querySelector('.com-scissor');

const socket = io('http://localhost:3000');

class CreateJoinRoom {
    roomId;
    playerId;

    constructor() {
        btnEnterGenerateRoom.addEventListener('click', this._openGenerate);
        btnEnterJoinRoom.addEventListener('click', this._openJoin);

        generateFormEl.addEventListener('submit', this._createRoom.bind(this));
        joinFormEl.addEventListener('submit', this._joinRoom.bind(this));

        btnCancel.forEach((btn) => {
            btn.addEventListener('click', this._cancelRoom);
        });

        socket.on('room-created', this._openGame);
        socket.on('room-joined', this._openGame);
    }

    _openGenerate() {
        enterRoomEl.style.display = 'none';
        generateRoomEl.style.display = 'block';
    }

    _cancelRoom() {
        enterRoomEl.style.display = 'block';
        generateRoomEl.style.display = 'none';
        joinRoomEl.style.display = 'none';
    }

    _openJoin() {
        joinRoomEl.style.display = 'block';
        enterRoomEl.style.display = 'none';
    }

    _createRoom(e) {
        e.preventDefault();

        // Get room id value and set player 1
        this.roomId = generateInputEl.value;
        this.playerId = 1;
        generateInputEl.value = '';

        // Emit create room event
        socket.emit('create-room', this.roomId, socket.id);
    }

    _joinRoom(e) {
        e.preventDefault();

        // Get roomId value and set player 2
        this.roomId = joinInputEl.value;
        this.playerId = 2;
        joinInputEl.value = '';

        // Emit join room event
        socket.emit('join-room', this.roomId, socket.id);
    }

    _openGame() {
        // Change display to game
        generateRoomEl.style.display = 'none';
        joinRoomEl.style.display = 'none';
        gameEl.style.display = 'block';
    }
}

class YouChoice {
    _p1Array = [rockP1, paperP1, scissorP1];
    isActive = true;

    constructor() {
        rockP1.addEventListener('click', this._rockP1.bind(this));
        paperP1.addEventListener('click', this._paperP1.bind(this));
        scissorP1.addEventListener('click', this._scissorP1.bind(this));
    }

    _rockP1() {
        this._choice(rockP1, 'rock');
    }

    _paperP1() {
        this._choice(paperP1, 'paper');
    }

    _scissorP1() {
        this._choice(scissorP1, 'scissor');
    }

    _choice(choiceEl, choiceStr) {
        if (!(this.isActive && userConnect.player1Connect && userConnect.player2Connect))
            return;

        this._p1Array.forEach((el) => {
            if (el === choiceEl) return el.classList.add('active');

            el.classList.remove('active');
        });

        socket.emit('make-move', room.roomId, room.playerId, choiceStr);

        this.isActive = false;
    }
}

class EnemyChoice {
    _enemyArray = [rockEnemy, paperEnemy, scissorEnemy];

    constructor() {
        socket.on('enemy-choice', this._enemyChoice.bind(this));
    }

    _enemyChoice(player1Choice, player2Choice) {
        if (room.playerId === 1) this._option(player2Choice);
        if (room.playerId === 2) this._option(player1Choice);
    }

    _choice(choiceEl) {
        this._enemyArray.forEach((el) => {
            if (!(el === choiceEl)) return;
            el.classList.add('active');
        });
    }

    _option(playerChoice) {
        if (playerChoice === 'rock') this._choice(rockEnemy);
        if (playerChoice === 'paper') this._choice(paperEnemy);
        if (playerChoice === 'scissor') this._choice(scissorEnemy);
    }
}

class Result {
    // 0: win, 1: lose, 2: draw
    score = [0, 0, 0];
    constructor() {
        socket.on('player-1-win', this._player1Win.bind(this));
        socket.on('player-2-win', this._player2win.bind(this));
        socket.on('draw', this._draw.bind(this));
    }

    _player1Win() {
        if (room.playerId === 1) this._youWin();
        if (room.playerId === 2) this._enemyWin();
    }

    _player2win() {
        if (room.playerId === 1) this._enemyWin();
        if (room.playerId === 2) this._youWin();
    }

    _draw() {
        resultMessageBoxEl.classList.add('win');
        resultMessageEl.textContent = 'draw';
        this.score[2]++;
    }

    _enemyWin() {
        resultMessageBoxEl.classList.add('win');
        resultMessageEl.textContent = 'Enemy Win';

        this.score[1]++;
        this._updateScore();
    }

    _youWin() {
        resultMessageBoxEl.classList.add('win');
        resultMessageEl.textContent = 'You Win!';

        this.score[0]++;
        this._updateScore();
    }

    _updateScore() {
        scoreYouEl.textContent = this.score[0];
        scoreEnemyEl.textContent = this.score[1];
    }
}

class UserConnection {
    player1Connect = false;
    player2Connect = false;
    constructor() {
        socket.on('player-1-connected', this._player1Connection.bind(this));
        socket.on('player-2-connected', this._player2Connection.bind(this));
        socket.on('player-1-disconnected', this._player1Disconnected.bind(this));
        socket.on('player-2-disconnected', this._player2Disconnected.bind(this));
    }

    _player1Connection() {
        this.player1Connect = true;
        if (room.playerId === 1) return;
        youNameEl.textContent = 'You';
        enemyNameEl.textContent = 'Enemy';
    }

    _player2Connection() {
        this.player2Connect = true;
        if (room.playerId === 2) return;
        youNameEl.textContent = 'You';
        enemyNameEl.textContent = 'Enemy';
    }

    _player1Disconnected() {
        this.player1Connect = false;
        enemyNameEl.textContent = 'Waiting the enemy';
    }

    _player2Disconnected() {
        this.player2Connect = false;
        enemyNameEl.textContent = 'Waiting the enemy';
    }
}

class Reset {
    _componentArray = [rockP1, paperP1, scissorP1, rockEnemy, paperEnemy, scissorEnemy];
    constructor() {
        btnReset.addEventListener('click', this._resetTrigger);
        socket.on('reset', this._reset.bind(this));
    }

    _resetTrigger() {
        socket.emit('resetTrigger');
    }

    _reset() {
        you.isActive = true;
        this._componentArray.forEach((el) => {
            el.classList.remove('active');
        });
        resultMessageBoxEl.classList.remove('win');
    }
}

class ErrorEnterRoom {
    constructor() {
        socket.on('error-enter-room', this._errorHandle);
    }

    _errorHandle(message) {
        alert(message);
    }
}

const room = new CreateJoinRoom();
const you = new YouChoice();
const enemy = new EnemyChoice();
const result = new Result();
const reset = new Reset();
const error = new ErrorEnterRoom();
const userConnect = new UserConnection();
