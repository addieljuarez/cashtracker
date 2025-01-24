
type EmailType = {
    name: string
    email: string
    token: string
}

class AuthEmail {

    static sendConfirmationEmail = async(user: EmailType) => {
        console.log('user')
    }

}

export default AuthEmail
