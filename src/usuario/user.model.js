import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor ingresar nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor ingresar correo'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Por favor ingresar password']
    },
    estado: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ["USER_ROLE"]
    }
});


userSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}


export default mongoose.model('User', userSchema);