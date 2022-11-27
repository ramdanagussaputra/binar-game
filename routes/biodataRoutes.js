const router = require('express').Router();
const biodataController = require('../controller/biodataController');
const authController = require('../controller/authController');

// router.use(authController.protect);

// prettier-ignore
router
    .route('/')
    .get(biodataController.getBiodatas);

// prettier-ignore
router
    .route('/:id')
    .patch(biodataController.updateBiodata)
    .get(biodataController.getBiodata);

module.exports = router;
