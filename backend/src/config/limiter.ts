import { rateLimit } from 'express-rate-limit'

export const limter = rateLimit({
    windowMs: 60000,
    limit: 10,
    message: {
        error: "Has alcanzado el limite de peticiones"
    }
})