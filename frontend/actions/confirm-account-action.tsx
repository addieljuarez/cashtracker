"use server"

import { ErrorReponseSchema, SuccessSchema, TokenShema } from "@/src/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}
export async function confirmAccountAction(token: string, prevState: ActionStateType): Promise<ActionStateType> {
    // console.log('server action confirmA account')

    const confirmToken = TokenShema.safeParse(token)
    if(!confirmToken.success){
        return {
            errors: confirmToken.error.issues.map(issue => issue.message),
            success: ''
        }
    }
    // console.log(confirmToken.data)

    const url = `${process.env.API_URL}/api/auth/confirm-account`
    // console.log('url', url)
    // console.log('confirmToken.data ', confirmToken.data )
    
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: confirmToken.data 
        })
    })

    // console.log('req', req.json())
    const json = await req.json()
    // console.log('ok', req.ok)
    // console.log(json)
    if(!req.ok){
        const error = ErrorReponseSchema.parse(json)
        // console.log('error///', error)
        return {
            errors: [error.error],
            success: ''
        }
    }

        const success = SuccessSchema.parse(json)
    return {
        errors: [],
        success
    }
}