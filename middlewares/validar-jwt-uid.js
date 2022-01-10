const {response}=require('express')
const jwt=require('jsonwebtoken')

const validarJWT_UID=(req,res=response,next)=>{
    const token=req.header('x-token')
    if(!token){
        return res.status(401).json({
            status:false,
            message:"No hay token en la petición"
        })
    }

    try {
        const {uid,name} =jwt.verify(token,process.env.SECRET_JWT_SEED)
        //Paso la verificacion
        //Validamos si coincide el uid
        if(req.body.uid===uid){
            req.uid=uid
            req.name=name
        } else {
            return res.status(401).json({
                status:false,
                message:'Token de usuario no válido'
            })    
        }
    } catch (error) {
        return res.status(401).json({
            status:false,
            message:'Token no válido'
        })
    }
    
    next();
}

module.exports={
    validarJWT_UID
}