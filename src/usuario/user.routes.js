import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { userPut, registrarse, login } from './user.controller.js';
import { existenteEmail } from '../helpers/db-validators.js';


const router = new Router();

router.put("/:id", [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id'),
    validarCampos
], userPut
);

router.post(
    '/registro', [
    check('nombre', 'Por favor ingresar nombre').not().isEmpty(),
    check('password', 'Su password debe ser mayor a 6 digitos').isLength({ min: 6 }),
    check('email', 'Este correo no es válido').isEmail(),
    check('email').custom(existenteEmail),
    validarCampos
], registrarse
);


router.post('/login',
    [
        check('email', 'Este email no es un valido').isEmail(),
        check('password', 'Por favor ingresar una contraseña').not().isEmpty(),
        validarCampos
    ], login
    );



export default router;