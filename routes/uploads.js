const {Router} = require('express');

const router = Router();

const { fileUpload, retornaImagen } = require('../controllers/uploads');

const expressFileUpload = require('express-fileupload');

const {isAuth} = require('../middlewares/isAuth');

router.use(expressFileUpload());

router.put('/:tipo/:id', [isAuth], fileUpload);

router.get('/:tipo/:img', retornaImagen);


module.exports = router;