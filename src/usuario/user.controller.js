import { response, request } from  'express';
import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js'


export const userPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, ...resto } = req.body;

        const usuarioAutenticado = req.usuario;
        const idCoincide = usuarioAutenticado._id.toString() === id;
        const tienePermiso = usuarioAutenticado.role === 'USER_ROLE';

        if (!idCoincide || !tienePermiso) {
            return res.status(403).json({
                msg: 'Usted no esta autorizado para  realizar esta acción sobre este usuario',
            });
        }
        if (!password) {
            return res.status(400).json({
                msg: 'Escriba nuevamente la contraseña anterior para actualizar',
            });
        }
        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(400).json({
                msg: 'Este Usuario no fue encontrado',
            });
        }

        const contrasenaValida = await bcryptjs.compare(password, usuario.password);
        if (!contrasenaValida) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta',
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, resto, { new: true });
        
        res.status(200).json({
            msg: 'Se ha actualizó el perfil correctamente',
            usuario: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Por favor comunicarse con el administrador',
        });
    }
}


export const registrarse = async (req, res) => {
    const { nombre, email, password, role } = req.body;
    const usuario = new User({ nombre, email, password, role });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(200).json({
        usuario
    });
}

export const login = async (req, res) => {
    
    const { email, password } = req.body;
    
    try {
        
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Este correo no está registrado'
            });
        }
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El siguiente usuario no existe en la database'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await generarJWT(usuario.id);


        res.status(200).json({
            msg: 'Se inicio secion correctamen',
            usuario,
            token
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            msg: 'Error, comuniquese con el administrados'
        });
    }
}
