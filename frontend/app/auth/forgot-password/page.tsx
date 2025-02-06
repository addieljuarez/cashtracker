import type { Metadata } from 'next'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
    title: 'CashTracker - Olvidé mi contraseña',
    description: 'CashTracker - Olvidé mi contraseña'
}
export default function ForgotPassword(){
    return(
        <>
            <h1 className='font-black text-6xl text-purple-950'>
                Olvidaste tu contraseña?
            </h1>
            <p className="text-3xl font-bold">aquí puedes <span className="text-amber-500">reestablecerla</span></p>

            <ForgotPasswordForm />
        </>
    )
}