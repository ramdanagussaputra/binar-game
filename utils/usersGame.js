const connectedPlayer = {};
const choice = {};

const moves = {
    rock: 'scissor',
    paper: 'rock',
    scissor: 'paper',
};

const connectPlayer = function (playerId) {
    connectedPlayer[playerId] = true;
};

const initializeChoice = function (roomId) {
    choice[roomId] = ['', ''];
};

const makeChoices = function (roomId, playerId, playerChoice) {
    choice[roomId][playerId - 1] = playerChoice;
};

module.exports = {
    connectedPlayer,
    choice,
    moves,
    connectPlayer,
    initializeChoice,
    makeChoices,
};
