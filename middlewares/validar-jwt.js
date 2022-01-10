const {response}=require('express')
const jwt=require('jsonwebtoken')

const validarJWT=(req,res=response,next)=>{
    const token=req.header('x-token')
    if(!token){
        return res.status(401).json({
            status:false,
            message:"No hay token en la petición"
        })
    }

    try {
        const {uid,name} =jwt.verify(token,process.env.SECRET_JWT_SEED)
        req.uid=uid
        req.name=name
    } catch (error) {
        return res.status(401).json({
            status:false,
            message:'Token no válido'
        })
    }
    
    next();
}

module.exports={
    validarJWT
}