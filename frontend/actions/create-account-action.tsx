"use server"

export async function register(formData: FormData){
    console.log('desde server action,formData', formData)
    const registerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        passowrd: formData.get('password')
    }
}