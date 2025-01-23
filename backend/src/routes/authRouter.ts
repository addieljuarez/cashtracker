import { Router } from 'express'
import {AuthController} from '../controllers/AuthController'
import {body} from 'express-validator'
import {handleInputErrors} from '../middlewares/validation'

const router = Router()

router.post('/create-account', 
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),
    body('password')
        .isLength({min: 8})
        .withMessage('El password es muy corto, minimo 8 carcateres'),
    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    handleInputErrors,
    AuthController.createAccount)

export default router
