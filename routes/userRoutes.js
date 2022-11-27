const router = require('express').Router();
const userController = require('../controller/userController');
const historyRouter = require('../routes/historyRoutes');
const authController = require('../controller/authController');

router.use('/:userId/history', historyRouter);

// prettier-ignore
router
    .route('/signup')
    .post(authController.signup)

// prettier-ignore
router
    .route('/login')
    .post(authController.login);

// router.use(authController.protect);

// prettier-ignore
router
    .route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

// prettier-ignore
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
