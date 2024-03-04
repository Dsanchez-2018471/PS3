import Usuario from '../usuario/user.model.js';

export const existenteEmail = async (email = '') => {
    const existeEmail = await Usuario.findOne({email});
    if(existeEmail){
        throw new Error(`Este email ${ email } ya esta registrado en la database`);
    }
}

export const existeUsuarioById = async ( id = '') => {
    const existeUsuario = await Usuario.findOne({id});
    if(existeUsuario){
        throw new Error(`El usuario con el id: ${ id } no existe o no esta resgistrado en la database`);
    }
}