import { Router } from 'express'
import {AuthController} from '../controllers/AuthController'
import {body, param} from 'express-validator'
import {handleInputErrors} from '../middlewares/validation'
import { limter } from '../config/limiter'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.use(limter)

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

router.post('/confirm-account',
    limter,
    body('token')
        .notEmpty()
        .isLength({
            min:6,
            max: 6
        })
        .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .notEmpty()
        .withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.login
)

router.post('/forgot-password',
    body('email')
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('Email no valido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty()
        .isLength({
            min:6,
            max: 6
        })
        .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/reset-password/:token',
    param('token')
        .notEmpty()
        .isLength({
            min:6,
            max: 6
        })
        .withMessage('Token no valido--'),
    body('password')
        .isLength({min: 8})
        .withMessage('El password es muy corto, minimo 8 caracteres'),
    
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get('/user', 
    authenticate,
    AuthController.user)

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty()
        .withMessage('El password es obligatorio')
        .isLength({min: 8})
        .withMessage('El password es muy corto, minimo 8 caracteres'),
    body('new_password')
        .notEmpty()
        .withMessage('El password es obligatorio')
        .isLength({min: 8})
        .withMessage('El password es muy corto, minimo 8 caracteres'),
    handleInputErrors,
    AuthController.updatePassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty()
        .withMessage('El password es obligatorio')
        .isLength({min: 8})
        .withMessage('El password es muy corto, minimo 8 caracteres'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router
