const {Router} = require('express');

const router = Router();

const {isAuth} = require('../middlewares/isAuth');

const {getTodo, getDocColeccion} = require('../controllers/busqueda');

router.get('/:busqueda', [isAuth], getTodo);

router.get('/coleccion/:tabla/:busqueda', [isAuth], getDocColeccion);

module.exports = router;