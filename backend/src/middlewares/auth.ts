import type { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import User from "../models/User"

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const bearer = req.headers.authorization
        if(!bearer){
            const error = new Error('No autorizado')
            return res.status(401).json({
                error: error.message
            })
        }

        const [, token] = bearer.split(' ')

        if(!token){
            const error = new Error('token jwt no valido')
            return res.status(401).json({
                error: error.message
            })
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if(typeof decoded === 'object' && decoded.id){
                const user = await User.findByPk(decoded.id, {
                    attributes: ['id', 'name', 'email']
                })
                // res.json(user)
                req.user = user
                next()
            }
        }catch(error){
            res.status(500).json({
                error: 'Token no valido en user'
            })
        }
}