import type { Request, Response } from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import AuthEmail from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'

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
            const user = await User.create(req.body)
            user.password = await hashPassword(password)
            const token = generateToken()
            user.token = token

            if(process.env.NODE!== 'production'){
                globalThis.cashTrackerToken = token
            }
            
            const response = await user.save()
            
            // await AuthEmail.sendConfirmationEmail({
            //     name: user.name,
            //     email: user.email,
            //     token: user.token
            // })

            res.status(201)
            .json({
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

    static confirmAccount = async(req: Request, res: Response): Promise<any> => {

        const {token} = req.body
        const user = await User.findOne({where: {token}})
        if(!user){
            const error = new Error('Token no valido')
            return res.status(401).json({
                error: error.message
            })
        }
        user.confirmed = true
        user.token = null
        await user.save()

        res.json('cuenta confirmada correctamente')
    }

    static login = async(req: Request, res: Response): Promise<any> => {
        const { email, password } = req.body
        const user = await User.findOne({
            where: {email}
        })
        if(!user){
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({
                error: error.message
            })
        }

        if(!user.confirmed){
            const error = new Error('La cuenta no ha sido confirmada')
            return res.status(403).json({
                error: error.message
            })
        }

        const passwordIsCheck = await checkPassword(password, user.password);
        if(!passwordIsCheck){
            const error = new Error('Password incorrecto')
            return res.status(401).json({
                error: error.message
            })
        }

        const token = generateJWT(user.id)
        console.log('token', token)
        res.json({
            user,
            token
        })
    }

    static forgotPassword = async(req: Request, res: Response): Promise<any> => {
        const { email } = req.body
        const user = await User.findOne({
            where: {email}
        })
        if(!user){
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({
                error: error.message
            })
        }

        user.token = generateToken()
        await user.save()

        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        })

        res.json('revisa el correo para instrucciones')
    }

    static validateToken = async(req: Request, res: Response): Promise<any> => {
        const { token } = req.body
        const user = await User.findOne({
            where: {token}
        })
        if(!user){
            const error = new Error('Token no valido')
            return res.status(401).json({
                error: error.message
            })
        }

        res.json('Token valido')
    }

    static resetPasswordWithToken = async(req: Request, res: Response): Promise<any> => {
        const { token } = req.params
        const { password } = req.body
        const user = await User.findOne({
            where: {token}
        })
        if(!user){
            const error = new Error('Token no valido ---')
            return res.status(401).json({
                error: error.message
            })
        }

        user.password = await hashPassword(password)
        user.token = null
        await user.save()

        res.json('Password actualizado correctamente')
    }

    static user = async(req: Request, res: Response): Promise<any> => {
        res.json(req.user)
    }

    static updatePassword = async(req: Request, res: Response): Promise<any> => {
        const { id } = req.user
        const { current_password, new_password } = req.body
        
        const user = await User.findByPk(id)
        const passwordIsCheck = await checkPassword(current_password, user.password)
        if(!passwordIsCheck){
            const error = new Error('Password incorrecto')
            return res.status(401).json({
                error: error.message
            })
        }

        user.password = await hashPassword(new_password)
        await user.save()

        res.json('Password actualizado correctamente')
    }

    static checkPassword = async(req: Request, res: Response): Promise<any> => {
        const { password } = req.body
        const { id } = req.user
        const user = await User.findByPk(id)
        const passwordIsCheck = await checkPassword(password, user.password)
        if(!passwordIsCheck){
            const error = new Error('Password incorrecto')
            return res.status(401).json({
                error: error.message
            })
        }

        res.json('Password correcto')
    }
}

