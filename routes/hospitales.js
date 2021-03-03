const { Router } = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {isAuth} = require('../middlewares/isAuth');

const {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
} = require('../controllers/hospitales');

const router = Router();

router.get('/', getHospitales);

router.post(
  '/',
  [
    isAuth,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos,
  ],
  crearHospital
);

router.put('/:id', [], actualizarHospital);

router.delete('/:id', borrarHospital);

module.exports = router;