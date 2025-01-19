import type { Request, Response } from 'express'

export class BudgetController {
    static getAll = async(req: Request, res: Response) => {
        console.log('desde el controller /api/budgets')
    } 

    static create = async(req: Request, res: Response) => {
        // console.log('desde controller create')
        console.log(req.body)

    }

    static getById = async(req: Request, res: Response) => {
        console.log('desde controller getById')
    }

    static updateById = async(req: Request, res: Response) => {
        console.log('desde budgetController updateById')
    }

    static deletById = async(req: Request, res: Response) => {
        console.log('desde BudgetController deleteById')
    }
}
