const express = require('express');
const router = express.Router();
const routesController = require('./routesController')
const middleware = require('../public/js/middlewares/middleware')


//Routes

router.get('/',routesController.index_GET);
router.get('/login/:id', middleware.loginVerify, routesController.login);
router.get('/acceso_denegado',routesController.accesoDenegado_GET);
router.get('/mainMenu',middleware.verifyToken, routesController.mainMenu_GET);
router.post('/userAccess', routesController.userAccess_POST);

module.exports = router;