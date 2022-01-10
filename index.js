const express= require('express');
const cors = require('cors');
require('dotenv').config();

const app=express();

//Cors
app.use(cors())

//Directorio publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json())

app.use('/api/auth',require('./routes/auth'));

let port=(process.env.PORT)?process.env.PORT:4000;

app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto ${port}`)
});