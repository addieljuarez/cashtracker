"use server"

import { ErrorReponseSchema, RegisterSchema, SuccessSchema } from "@/src/schemas"

// interface typeReturn {
//     status: string;
// }

type ActionStateTypr = {
    errors: string[],
    success: string
} 



export async function register(prevState: ActionStateTypr, formData: FormData): Promise<ActionStateTypr> {
    // console.log(formData)
    // // console.log('desde server action,formData', formData)
    const registerData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    const register = RegisterSchema.safeParse(registerData)
    // console.log(register.error?.errors)
    
    

    if(!register.success){
        const errors = register.error.errors.map(error => error.message)
        console.log(errors)
        return {
            errors,
            success: prevState.success // es es el va;or inicial
        }
    }

    

    const url = `${process.env.API_URL}/api/auth/create-account`
    console.log('url', url)

    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: register.data.name,
            email: register.data.email,
            password: register.data.password
        })
    })
    
    console.log('request', req)
    const json = await req.json()

    if(req.status === 409){
        const error = ErrorReponseSchema.parse(json)

        return {
            errors: [error.error],
            success: ''
        }
    }

    
    console.log(json)
    const success = SuccessSchema.parse(json.status)
    console.log(success)
    return {
        errors: [],
        success
    }
} 