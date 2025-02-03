import { exit } from 'node:process'
import { db } from "../config/db"

const clearData = async() => {
    // console.log('desde clear data')
    try{
        await db.sync({force: true})
        console.log('datos eliminados exitosamente')
        exit(0)
    }catch {
        exit(1)
    }
}

// se lee desde donbde se llama el script pretest
console.log(process.argv)
console.log(process.argv[2])

if(process.argv[2] === '--clear'){
    clearData()
}