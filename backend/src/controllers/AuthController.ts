import type { Request, Response } from 'express'
import User from '../models/User'

export class AuthController {
    
    static createAccount  = async (req: Request, res: Response): Promise<any> => {
        
        const {email} = req.body
        const userExists = await User.findOne({
            where: {email}
        })

        if(userExists){
            const error = new Error('El usuario ya existe')
            return res.status(409).json({
                error: error.message
            })
        }

        try{
            const user = new User(req.body)
            const response = await user.save()
            res.json({
                status: 'Cuenta creada',
                response
            })
        }catch(error){
            console.log('error en createAccount', error)
            res.status(500).json({
                error: 'hubo en error en createAccount'
            })
        }
    }
}

