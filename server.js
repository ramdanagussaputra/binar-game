const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
const activateSocket = require('./utils/socket');

process.on('uncaughtException', (err) => {
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

// SET CONFIG ENV PATH
dotenv.config({ path: './config.env' });

// CONNECT MONGODB
(async () => {
    const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
    const con = await mongoose.connect(db);

    console.log(`MongoDB connected on: ${con.connection.host}`);
})();

// START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
    console.log(`Server running on: http://localhost:${port}`)
);

activateSocket();

process.on('unhandledRejection', (err) => {
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

/*
TEST ACCOUNT FOR LOGIN
username: ramdanaguss16
password: 1111
*/
