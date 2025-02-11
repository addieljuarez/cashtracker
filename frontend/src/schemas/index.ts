import { z } from 'zod'

export const RegisterSchema = z.object({
    email: z.string()
        .min(1, {message: 'Tu email es obligatorio'})
        .email({message: 'Email no valido'}),
    name: z.string()
        .min(1, {message: 'Tu nombre no puede ir vacio'}),
    password: z.string()
        .min(1, {message: 'La contraseña es minimo de 8 caracteres'}),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no son iguales',
    path: ['password_confirmation'] // es donde se mostrara el error 
})

export const SuccessSchema = z.string().min(1, {
    message: 'Valor no valido'
})

export const ErrorReponseSchema = z.object({
    error: z.string()
})

export const TokenShema = z.string({
    message: 'Token no valido'
})
.min(6, {
    message: 'Token no valido'
})
.max(6, {
    message: 'Token no valido'
})