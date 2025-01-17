import { Sequelize } from 'sequelize-typescript'
import 'dotenv/config'


export const db = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: false
        }
    }
})
