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

router.post('/verify_hashRedis', routesController.verify_hashRedis_POST);


// ##############Vulcanized##################
router.get('/consultaVUL',middleware.verifyToken, routesController.consultaVUL_GET);
router.post("/getUbicacionesVULMaterial",middleware.verifyToken, middleware.macFromIP, routesController.getUbicacionesVULMaterial_POST);
router.post("/getUbicacionesVULMandrel",middleware.verifyToken, middleware.macFromIP, routesController.getUbicacionesVULMandrel_POST);
router.post("/getUbicacionesVULSerial",middleware.verifyToken, middleware.macFromIP, routesController.getUbicacionesVULSerial_POST);
router.get('/transferVUL',middleware.verifyToken, middleware.macFromIP, routesController.transferVUL_GET);
router.post('/transferVUL_Confirmed',middleware.verifyToken, middleware.macFromIP, routesController.transferVUL_Confirmed);
router.get('/auditoriaProduccionVUL', middleware.verifyToken, middleware.macFromIP, routesController.auditoriaProduccion_GET);
router.post('/auditoriaVUL',middleware.verifyToken, middleware.macFromIP, routesController.auditoriaVUL_POST);
router.get('/conteo_ciclico/:storage_type',middleware.verifyToken, middleware.macFromIP, routesController.conteoC_GET);
router.post("/getBinStatusReport",middleware.verifyToken, middleware.macFromIP, routesController.getBinStatusReport_POST);
router.post("/postCycleSU",middleware.verifyToken, middleware.macFromIP, routesController.postCycleSU_POST);
module.exports = router;