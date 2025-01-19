import type { Request, Response } from 'express'

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        console.log('desde el controller /api/budgets')
    } 
}
