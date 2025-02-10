import {transport} from "../config/nodemailer"

type EmailType = {
    name: string
    email: string
    token: string
}

class AuthEmail {

    static sendConfirmationEmail = async(user: EmailType) => {
        const email = await transport.sendMail({
            from: 'Cash Traker <test@demomailtrap.com>',
            to: user.email,
            subject: 'cashtracker',
            html: `
                <style type="text/css">

                    .header {
                    background: #8a8a8a;
                    }

                    .header .columns {
                    padding-bottom: 0;
                    }

                    .header p {
                    color: #fff;
                    margin-bottom: 0;
                    }

                    .header .wrapper-inner {
                    padding: 20px; /*controls the height of the header*/
                    }

                    .header .container {
                    background: #8a8a8a;
                    }

                    .wrapper.secondary {
                    background: #f3f3f3;
                    }

                </style>
                <!-- move the above styles into your custom stylesheet -->


                <wrapper class="header" bgcolor="#8a8a8a">
                    <container>
                        <row class="collapse">
                        <columns small="6" valign="middle">
                            <p class="text-right">BASIC</p>
                        </columns>
                        </row>
                    </container>
                </wrapper>

                <container>

                <spacer size="16"></spacer>
                
                <row>
                    <columns>
                    
                    <h1>Hi, ${user.name}</h1>
                    <p>codigo ${user.token}</p>
                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account"}>Confirma tu cuenta</a>
                    <callout class="primary">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit repellendus natus, sint ea optio dignissimos asperiores inventore a molestiae dolorum placeat repellat excepturi mollitia ducimus unde doloremque ad, alias eos!</p>
                    </callout>

                    </columns>
                </row>
                
                <wrapper class="secondary">
                    <spacer size="16"></spacer>
                    <row>
                    <columns small="12" large="6">
                        <h5>Connect With Us:</h5>
                        <menu class="vertical">
                        <item style="text-align: left;" href="#">Twitter</item>
                        <item style="text-align: left;" href="#">Facebook</item>
                        <item style="text-align: left;" href="#">Google +</item>
                        </menu>
                    </columns>
                    <columns small="12" large="6">
                        <h5>Contact Info:</h5>
                        <p>Phone: 408-341-0600</p>
                        <p>Email: <a href="mailto:foundation@zurb.com">foundation@zurb.com</a></p>
                    </columns>
                    </row>
                </wrapper>

                </container>
            `
        })
        console.log(`mesasage ID: ${email.messageId}`)
    }

    static sendPasswordResetToken = async(user: EmailType) => {
        const email = await transport.sendMail({
            from: 'Cash Traker <test@demomailtrap.com>',
            to: user.email,
            subject: 'Cashtracker - reset password',
            html:`
                <style type="text/css">

                    .header {
                    background: #8a8a8a;
                    }

                    .header .columns {
                    padding-bottom: 0;
                    }

                    .header p {
                    color: #fff;
                    margin-bottom: 0;
                    }

                    .header .wrapper-inner {
                    padding: 20px; /*controls the height of the header*/
                    }

                    .header .container {
                    background: #8a8a8a;
                    }

                    .wrapper.secondary {
                    background: #f3f3f3;
                    }

                </style>
                <!-- move the above styles into your custom stylesheet -->


                <wrapper class="header" bgcolor="#8a8a8a">
                    <container>
                        <row class="collapse">
                        <columns small="6" valign="middle">
                            <p class="text-right">BASIC</p>
                        </columns>
                        </row>
                    </container>
                </wrapper>

                <container>

                <spacer size="16"></spacer>
                
                <row>
                    <columns>
                    
                    <h1>Hi, ${user.name}</h1>
                    <p>codigo ${user.token}</p>
                    <a href="${process.env.FRONTEND_URL}/auth/new-password"}>Nueva Contraseña</a>
                    <callout class="primary">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit repellendus natus, sint ea optio dignissimos asperiores inventore a molestiae dolorum placeat repellat excepturi mollitia ducimus unde doloremque ad, alias eos!</p>
                    </callout>

                    </columns>
                </row>
                
                <wrapper class="secondary">
                    <spacer size="16"></spacer>
                    <row>
                    <columns small="12" large="6">
                        <h5>Connect With Us:</h5>
                        <menu class="vertical">
                        <item style="text-align: left;" href="#">Twitter</item>
                        <item style="text-align: left;" href="#">Facebook</item>
                        <item style="text-align: left;" href="#">Google +</item>
                        </menu>
                    </columns>
                    <columns small="12" large="6">
                        <h5>Contact Info:</h5>
                        <p>Phone: 408-341-0600</p>
                        <p>Email: <a href="mailto:foundation@zurb.com">foundation@zurb.com</a></p>
                    </columns>
                    </row>
                </wrapper>

                </container>
            `
        })
    }
}

export default AuthEmail
