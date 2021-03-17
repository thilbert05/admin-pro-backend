const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');

//AUTH Controllers
const { login, googleSignIn } = require('../controllers/auth');

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


router.post('/login/google',
  [
    check('token', 'El token es obligatorio').not().isEmpty(),
    validarCampos
  ]
 , 
 googleSignIn);

module.exports = router;
