import type { Request, Response, NextFunction } from 'express'
import { validationResult, param } from 'express-validator'

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    await param('id')
        .isInt()
        .withMessage('el ID debe ser un numero')
        .custom(value => value > 0)
        .withMessage('El numero debe ser positivo')
        .run(req)

    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()

}
