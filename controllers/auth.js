const {response} = require('express')
const bcrypt = require('bcryptjs')
const Users =require('../models/Users')
const {generarJWT}=require('../helpers/jwt');

const {
    getALL,
} = require('../controllers/dynamo');

const crearUsuario = async(req,res=response)=>{
    const {name,email,password}= req.body

    try {
        let existe=await Users.findOne({email});
        if(existe){
            return res.status(400).json({
                status:false,
                message:"Un usuario existe con ese correo"
            })
        }

        const usuario = new Users(req.body);

        //Encriptar contraseña
        const salt=bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync(password,salt)
    
        await usuario.save();

        const token=await generarJWT(usuario.id,usuario.name);
    
        res.status(201).json({
            status:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error"
        })
    }
}
const loginUsuario = async(req,res=response)=>{
    const {email,password}= req.body
    
    try {
        const usuario=await Users.findOne({email});
        if(!usuario){
            return res.status(400).json({
                status:false,
                message:"Usuario o contraseña incorrectos"
            })
        }
        const validPassword=bcrypt.compareSync(password,usuario.password)

        if(!validPassword){
            return res.status(400).json({
                status:false,
                message:"Contraseña incorrecta"
            })
        }
        const token=await generarJWT(usuario.id,usuario.name);
        res.json({
            status:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"My name is Por favor hable con el adminisrtador [ " + JSON.stringify(error)
        })
    }
}
const revalidarToken = async(req,res=response)=>{
    const {uid,name}= req
    const token=await generarJWT(uid,name);

    res.status(201).json({
        status:true,
        uid:uid,
        name:name,
        token
    })
}

const characters = async(req,res=response)=>{
    try {
        const characters = await getALL('hpCharacters');
        res.status(200).json({
            status:true,
            characters
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
    characters
}