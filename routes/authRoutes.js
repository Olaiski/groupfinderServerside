const router = require('express').Router();
const AuthenticationController = require('../controllers/AuthenticationController')

router.post('/loginStudent',  AuthenticationController.login, (req,res,next) =>{});

router.post('/registerStudent', AuthenticationController.register, (req,res,next) =>{});



module.exports = router;