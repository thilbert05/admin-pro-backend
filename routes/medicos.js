const {Router} = require('express');
const {check} = require('express-validator');

const {isAuth} = require('../middlewares/isAuth');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico
} = require('../controllers/medicos');

const router = Router();

router.get('/', getMedicos);

router.post(
  '/',
  [
    isAuth,
    check('nombre', 'El nombre del médico es requerido').not().isEmpty(),
    check('hospital', 'El id del hospital debe ser válido').isMongoId(),
    validarCampos,
  ],
  crearMedico
);

router.put('/:id', [], actualizarMedico);

router.delete('/:id', [], borrarMedico);

module.exports = router;