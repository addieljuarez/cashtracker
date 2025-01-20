import type { Request, Response } from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static getAll = async(req: Request, res: Response) => {
        try{
            const budgets = await Budget.findAll({})
            res.status(201).json(budgets)
        } catch(error){
            res.status(500).json({
                error: 'Hubo un error en getAll'
            })
        }
    } 

    static create = async(req: Request, res: Response) => {
        // console.log('desde controller create')
        try{
            console.log(req.body)
            // res.send(req.body)
            const budget = new Budget(req.body)
            await budget.save()
            res.status(201).json({
                'respuesta': 'creado correctamente'
            })
        }
        catch(error){
            console.log('error--', error)
            res.status(500).json({
                error: 'hubo un error'
            })
        }

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
