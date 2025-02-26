const express = require('express');
const { signUp, login, rentalCars } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/my-profile', myProfile);
router.post('/rentalCars', rentalCars);

module.exports = router;