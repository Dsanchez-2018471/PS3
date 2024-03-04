'use strict'

import mongoose from 'mongoose';

export const dbConnection = async () => {
    try{
        mongoose.connection.on('error', () => {
            console.log('MongoDB | No se ha Podido Realizar la Coneccion con MongoDB')
            mongoose.disconnect();
        })
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Intentando Conectar');
        })
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | Coneccion con MongoDB');
        })
        mongoose.connection.once('open', () =>{
            console.log('MongoDB | Coneccion con la dabase')
        })
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconectando con MongoDB')
        })
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Desconectado')
        })

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });
    }catch(e){
        console.log('La coneccion con la Database ha fallado', err)
    }
}