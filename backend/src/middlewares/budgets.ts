import type { Request, Response, NextFunction } from 'express'
import { validationResult, param, body } from 'express-validator'

import Budget from '../models/Budget'

declare global{
    namespace Express{
        interface Request{
            budget?: Budget
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    await param('budgetId')
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
        const { budgetId } = req.params
        const budget = await Budget.findByPk(budgetId)
        if(!budget){
            const error = new Error('Budget no encontrado')
            return res.status(404).json({
                error: error.message
            });
        }
        req.budget = budget
        next()
    }catch(error){
        console.log('error getById', error)
        res.status(500).json({
            error: 'Hubo un error en getByID'
        })
    }
}

export const validateBudgetInput = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    await body('name')
        .notEmpty()
        .withMessage('El nombre del presupuesto no puede ir vacio')
        .run(req)
    await body('amount')
        .notEmpty()
        .withMessage('El monto no puede quedar vacio')
        .isNumeric()
        .withMessage('el monto debe ser un numero')
        .custom((value) => {
           return value > 0
        })
        .withMessage('El numero debe ser valor a 0')
        .run(req)

    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()

}

export const hasAcess = (req: Request, res: Response, next: NextFunction) => {
    if(req.budget.userId !== req.user.id){
        const error = new Error('Accion no valida')
        return res.status(401).json({
            error: error.message
        })
    }
    next()
}

