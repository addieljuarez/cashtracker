import type { Request, Response, NextFunction} from 'express'
import { param, validationResult, body } from 'express-validator'
import Expense from '../models/Expense'

declare global{
    namespace Express{
        interface Request{
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async(req:Request, res: Response, next: NextFunction): Promise<any> => {
    
    await body('name')
        .notEmpty()
        .withMessage('El nombre del expense no puede ir vacio')
        .run(req)

    await body('amount')
        .notEmpty()
        .withMessage('La cantidad no puede ir vacia')
        .isNumeric()
        .withMessage('Cantidad no valida')
        .custom(value => value > 0)
        .withMessage('El gasto debe ser mayor a 0')
        .run(req)

    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}

export const validateExpenseId = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    await param('expenseId')
        .isInt()
        .withMessage('El Id del expense debe ser un numero')
        .custom(value => value > 0)
        .withMessage('El id debe ser positivo')
        .run(req)

    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}

export const validateExpenseExists = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        const {expenseId} = req.params
        const expense = await Expense.findByPk(expenseId)

        if(!expense){
            const error = new Error('Expense no encontrado')
            return res.status(404).json({
                error: error.message
            })
        }

        req.expense = expense
        next()
    }catch(error){
        console.log('error en validateExpenseExists')
        res.status(500).json({
            error: 'Hubo un error en validateExpenseExists'
        })
    }
}


