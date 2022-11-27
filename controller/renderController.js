const axios = require('axios');

exports.renderHomepage = function (req, res) {
    res.render('index');
};

exports.renderGame = function (req, res) {
    res.render('game');
};

exports.renderRegister = function (req, res) {
    res.render('signup');
};

exports.renderUserDashboard = async function (req, res) {
    const response = await axios.get('http://localhost:7000/api/user-game');

    const { data } = response.data.data;

    res.render('userDashboard', { users: data });
};

exports.renderBiodataDashboard = async function (req, res) {
    const response = await axios.get(
        `http://localhost:7000/api/user-game-biodata/${req.query.id}`
    );

    const { data } = response.data.data;

    res.render('biodataDashboard', { biodata: data });
};

exports.renderHistoryDashboard = async function (req, res) {
    const response = await axios.get(
        `http://localhost:7000/api/user-game/${req.query.id}/history`
    );

    const { data } = response.data.data;

    res.render('historyDashboard', { histories: data });
};
