"use client"
import { confirmAccountAction } from '@/actions/confirm-account-action'
import { PinInput, PinInputField } from '@chakra-ui/pin-input'
import { useActionState, useEffect, useState } from 'react'
import ErrorMessage from '../ui/ErrorMessage'
import SuccessMessage from '../ui/SuccessMessage'
export default function ConfirmAccountForm() {
    const [isComplete, setIsComplete] = useState(false)
    const [token, setToken] = useState("")

    

    const confirmAccountWithToken = confirmAccountAction.bind(null, token)
    const [state, dispatch] = useActionState(confirmAccountWithToken, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        
        if(isComplete) {
            dispatch()
        }
        
    }, [isComplete])

    const handleChange = (token: string) => {
        setToken(token)
    } 

    const handleComplete = async() => {
        // dispatch()
        setIsComplete(true)
    }
    return(
        <>
            {state.errors.map((error, index) => <ErrorMessage key={index}>{error}</ErrorMessage>)}
            {state.success && <SuccessMessage>{state.success}</SuccessMessage>}
            <div className='flex justify-center gap-5 my-10'>
                
                <PinInput
                    value={token}
                    onChange={handleChange}
                    onComplete={handleComplete}
                >
                    <PinInputField 
                        className='h-10 
                            w-10 border 
                            border-gray-300 
                            placeholder-white 
                            shadow 
                            rounded-lg
                            text-center
                        '
                    />
                    <PinInputField 
                        className='h-10 
                            w-10 border 
                            border-gray-300 
                            placeholder-white 
                            shadow 
                            rounded-lg
                            text-center
                        '
                    />
                    <PinInputField 
                        className='h-10 
                            w-10 border 
                            border-gray-300 
                            placeholder-white 
                            shadow 
                            rounded-lg
                            text-center
                        '
                    />
                    <PinInputField 
                        className='h-10 
                            w-10 border 
                            border-gray-300 
                            placeholder-white 
                            shadow 
                            rounded-lg
                            text-center
                        '
                    />
                    <PinInputField 
                        className='h-10 
                            w-10 border 
                            border-gray-300 
                            placeholder-white 
                            shadow 
                            rounded-lg
                            text-center
                        '
                    />
                    <PinInputField 
                        className='h-10 
                            w-10 border 
                            border-gray-300 
                            placeholder-white 
                            shadow 
                            rounded-lg
                            text-center
                        '
                    />
                </PinInput>
            </div>
        </>
    )
}