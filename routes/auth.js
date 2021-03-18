const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');

//AUTH Controllers
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { isAuth } = require('../middlewares/isAuth');

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

 router.get('/login/renew',
  [
    isAuth
  ]
 , 
 renewToken);

module.exports = router;
