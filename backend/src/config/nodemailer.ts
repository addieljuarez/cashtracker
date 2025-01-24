import nodemailer from 'nodemailer'
import 'dotenv/config'

interface TransportConfig {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    }
}

const config = (): TransportConfig => {
    return {
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
}
export const transport = nodemailer.createTransport(config());
