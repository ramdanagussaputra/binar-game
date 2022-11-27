const serverSocket = require('socket.io');
const roomsGame = require('../utils/roomsGame');
const userGame = require('../utils/usersGame');

module.exports = () => {
    const io = serverSocket(3000, {
        cors: {
            origin: ['http://localhost:7000'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`${socket.client.id} connected`);

        // CREATE ROOM | player 1 in
        socket.on('create-room', (roomId) => {
            // Check room
            const message = 'Room already exist';
            if (roomsGame.rooms[roomId]) return socket.emit('error-enter-room', message);

            // Create room
            roomsGame.createRoom(roomId, socket.client.id);
            socket.emit('room-created', roomId);

            // Join player
            socket.join(roomId);

            // Connect player
            userGame.connectPlayer(socket.client.id);
            io.emit('player-1-connected');
        });

        // JOIN ROOM | player 2 in
        socket.on('join-room', (roomId) => {
            // Check room
            const message = 'Room does not exist';
            if (!roomsGame.rooms[roomId]) return socket.emit('error-enter-room', message);

            // Create room
            roomsGame.joinRoom(roomId, socket.client.id);
            socket.emit('room-joined', roomId);

            // Join player
            socket.join(roomId);

            // Connect player
            userGame.connectPlayer(socket.client.id);
            io.emit('player-2-connected');

            // Initialize choice array
            userGame.initializeChoice(roomId);
        });

        // PLAYER MOVE
        socket.on('make-move', (roomId, playerId, playerChoice) => {
            // Player make move
            userGame.makeChoices(roomId, playerId, playerChoice);

            // Check if both player already choose
            if (!userGame.choice[roomId][0] || !userGame.choice[roomId][1]) return;

            // Asign player choice
            const player1Choice = userGame.choice[roomId][0];
            const player2Choice = userGame.choice[roomId][1];

            // Check if draw
            if (userGame.choice[roomId][0] === userGame.choice[roomId][1]) {
                io.emit('draw');

                // Check if player 1 win
            } else if (userGame.moves[player1Choice] === player2Choice) {
                io.emit('player-1-win');

                // Check if player 2 win
            } else {
                io.emit('player-2-win');
            }

            io.emit('enemy-choice', player1Choice, player2Choice);

            userGame.choice[roomId] = ['', ''];
        });

        // PLAYER DISCONECT
        socket.on('disconnect', () => {
            if (!userGame.connectedPlayer[socket.client.id]) return;
            let player;

            Object.keys(roomsGame.rooms).forEach((roomId) => {
                const player1Id = roomsGame.rooms[roomId][0];
                const player2Id = roomsGame.rooms[roomId][1];

                if (player1Id === socket.client.id || player2Id === socket.client.id) {
                    player = roomsGame.rooms[roomId][0] === socket.client.id ? 1 : 2;

                    if (player === 1) {
                        socket.broadcast.emit('player-1-disconnected');
                        roomsGame.rooms[roomId][0] = '';
                        return;
                    }
                    userGame.choice[roomId];

                    socket.broadcast.emit('player-2-disconnected');
                    roomsGame.rooms[roomId][1] = '';
                }

                if (
                    !(
                        userGame.connectedPlayer[player1Id] &&
                        userGame.connectedPlayer[player2Id]
                    )
                )
                    delete roomsGame.rooms[roomId];
            });

            delete userGame.connectedPlayer[socket];
        });

        // PLAYER RESET
        socket.on('resetTrigger', () => {
            io.emit('reset');
        });
    });
};
