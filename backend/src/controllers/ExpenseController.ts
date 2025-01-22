import type { Request, Response} from 'express'
import Expense from '../models/Expense'

export class ExpenseController {

    static create = async(req: Request, res: Response) => {
        try{
            const expense = new Expense(req.body)
            expense.budgetId = req.budget.id
            await expense.save()
            res.status(201).json({
                status: 'Expense creado correctamente'
            })
        }catch(error){
            console.log('error al crear expense', error)
            res.status(500).json({
                error: 'Error en create expense'
            })
        }
    }
    
    static getById = async(req: Request, res: Response) => {

    }
    
    static updateById = async(req: Request, res: Response) => {

    }
    
    static deleteById = async(req: Request, res: Response) => {

    }
}

export default ExpenseController
