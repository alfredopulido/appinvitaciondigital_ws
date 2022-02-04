const {response} = require('express')
const bcrypt = require('bcryptjs')
const {generarJWT}=require('../helpers/jwt');

const {
    findOne,insertNew
} = require('../controllers/dynamo');

const crearUsuario = async(req,res=response)=>{
    const {name,email,password}= req.body

    try {
        const existe = await findOne('Users',{email});
        if(existe){
            return res.status(400).json({
                status:false,
                message:"Un usuario existe con ese correo",
                code:1
            })
        }

        //Encriptar contraseña
        const salt=bcrypt.genSaltSync();
        
        const newuser = {
            name,
            email,
            password:bcrypt.hashSync(password,salt)
        }
        const usuario = await insertNew('Users',newuser);

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
            message:error
        })
    }
}
const loginUsuario = async(req,res=response)=>{
    const {email,password}= req.body
    try {
        const usuario = await findOne('Users',{email});
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
    } catch (error) { console.log(error)
        res.status(500).json({
            status:false,
            message:"Por favor hable con el adminisrtador [ " + JSON.stringify(error)
        })
    }
}
const revalidarToken = async(req,res=response)=>{
    const {uid,name}= req;
    const token=await generarJWT(uid,name);

    res.status(201).json({
        status:true,
        uid:uid,
        name:name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}