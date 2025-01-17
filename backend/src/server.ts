import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import { db } from  './config/db'
const app = express()


const connectDB = async () => {
    try{
        await db.authenticate()
        db.sync()     
        console.log(colors.blue.bold('Conexion exitosa a la base de datos'))
    } catch(error){
        // console.log('error en DB', error)
        console.log(colors.red.bold('Conexion Fallida a la base de datos'))
    }
}

connectDB()

// middlewares

app.use(morgan('dev'))
app.use(express.json())


export default app
