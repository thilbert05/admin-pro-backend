const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares
const { validarCampos } = require('../middlewares/validar-campos');

//Controladores
const { getUsuarios, postUsuarios, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { isAuth, isAdmin, isAdminOrSameUser } = require('../middlewares/isAuth');

const router = Router();

// GET USUARIOS
router.get('/', [isAuth, isAdmin], getUsuarios);

//POST USUARIOS
router.post(
  '/', 
[
  check('nombre', 'El nombre es requerido.').not().isEmpty(),
  check('password', 'El password es requerido.').not().isEmpty(),
  check('email', 'El formato de email no es válido.').isEmail(),
  validarCampos
], 
postUsuarios);

//PUT USUARIOS

router.put(
  '/:id',
  [
    isAuth,
    isAdminOrSameUser,
    check('nombre', 'El nombre es requerido.').not().isEmpty(),
    check('role', 'El rol es requerido.').not().isEmpty(),
    check('email', 'El formato de email no es válido.').isEmail(),
    validarCampos
  ], 
 actualizarUsuario
);

// DELETE USUARIO

router.delete('/:id', [isAuth, isAdmin], borrarUsuario);

module.exports = router;