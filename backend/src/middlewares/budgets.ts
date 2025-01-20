import type { Request, Response, NextFunction } from 'express'
import { validationResult, param } from 'express-validator'
import Budget from '../models/Budget'

declare global{
    namespace Express{
        interface Request{
            budget?: Budget
        }
    }
}

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

export const validateBudgetExists = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        const { id } = req.params
        const budgetId = await Budget.findByPk(id)
        if(!budgetId){
            const error = new Error('Budget no encontrado')
            return res.status(404).json({
                error: error.message
            });
        }
        req.budget = budgetId
        next()
    }catch(error){
        console.log('error getById', error)
        res.status(400).json({
            error: 'Hubo un error en getByID'
        })
    }

}
