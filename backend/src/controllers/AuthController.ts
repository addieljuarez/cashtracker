import type { Request, Response } from 'express'
import User from '../models/User'
import {hashPassword} from '../utils/auth'
import {generateToken} from '../utils/token'
import AuthEmail from '../emails/AuthEmail'

export class AuthController {
    
    static createAccount  = async (req: Request, res: Response): Promise<any> => {
        
        const {email, password} = req.body
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
            user.password = await hashPassword(password)
            user.token = generateToken()
            const response = await user.save()
            
            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })

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

