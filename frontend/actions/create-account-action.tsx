"use server"

export async function register(formData: FormData){
    console.log('desde server action,formData', formData)
    const registerData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }
}