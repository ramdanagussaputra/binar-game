const rooms = {};

const createRoom = function (roomId, player1Id) {
    rooms[roomId] = [player1Id, ''];
};

const joinRoom = function (roomId, player2Id) {
    rooms[roomId][1] = player2Id;
};

const exitRoom = function (roomId, playerId) {
    if (playerId === 1) {
        delete rooms[roomId];
        return;
    }

    rooms[roomId][1] = '';
};

module.exports = { rooms, createRoom, joinRoom, exitRoom };
