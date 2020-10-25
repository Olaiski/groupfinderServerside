const router = require('express').Router();
const HomeController = require('../controllers/HomeController');


router.get('/home',  HomeController.getUser);



module.exports = router;