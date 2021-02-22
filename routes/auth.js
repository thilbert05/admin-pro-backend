const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');

//AUTH Controllers
const { login } = require('../controllers/auth');

const router = Router();

// POST LOGIN

router.post('/login',
  [
    check('email', 'El email es requerido').isEmail(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    validarCampos
  ]
 , 
 login);

module.exports = router;
