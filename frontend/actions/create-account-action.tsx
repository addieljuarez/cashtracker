"use server"

import { RegisterSchema } from "@/src/schemas"

export async function register(formData: FormData): Promise<any> {
    // console.log('desde server action,formData', formData)
    const registerData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    const register = RegisterSchema.safeParse(registerData)
    // console.log(register.error?.errors)
    const errors = register.error?.errors.map(error => error.message)
    console.log(errors)
    if(!register.success){
        return {}
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
    console.log(json)
    return {};
} 