const router = require('express').Router({ mergeParams: true });
const historyController = require('../controller/historyController');
const authController = require('../controller/authController');

// router.use(authController.protect);

router
    .route('/')
    .get(historyController.getHistories)
    .post(historyController.createHistory);

router
    .route('/:id')
    .patch(historyController.updateHistory)
    .get(historyController.getHistory);

module.exports = router;
