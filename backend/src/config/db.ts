import { Sequelize } from 'sequelize-typescript'
import 'dotenv/config'


export const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + './../models/**/*'],
    /*
     *con este ya no se generan las columnas automaticamente 
     *
    define: {
        timestamps: false
    },

    // ese es para los logs 
    logging: false,
    */
    logging: false,
    dialectOptions: {
        ssl: {
            require: false
        }
    }
})
