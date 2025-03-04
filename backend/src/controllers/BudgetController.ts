import type { Request, Response } from 'express'
import Budget from '../models/Budget'
import Expense from '../models/Expense'

export class BudgetController {
    static getAll = async(req: Request, res: Response) => {
        try{
            const budgets = await Budget.findAll({
                 order: [
                    ['createdAt', 'DESC']
                ],
                limit: 100,
                where: {
                    userId: req.user.id
                }
                // where: {
                //     name: 'anything'
                // }
            })
            res.json(budgets)
        } catch(error){
            // console.log('error:---', error)
            res.status(500).json({
                error: 'Hubo un error en getAll'
            })
        }
    } 

    static create = async(req: Request, res: Response) => {
        // console.log('desde controller create')
        try{
            // console.log(req.body)
            // res.send(req.body)
            const budget = await Budget.create(req.body)
            budget.userId = req.user.id
            await budget.save()
            res.status(201).json({
                respuesta: 'creado correctamente'
            })
        }
        catch(error){
            // console.log('error--', error)
            res.status(500).json({
                error: 'hubo un error en createController budget'
            })
        }

    }

    static getById = async(req: Request, res: Response): Promise<any> => {
        // console.log('desde controller getById')
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        })
        res.json(budget)
    }

    static updateById = async(req: Request, res: Response) => {
        await req.budget.update(req.body)
        res.status(200).json({
            status: 'budget actualizado'
        })
    }

    static deleteById = async(req: Request, res: Response): Promise<any> => {

        await req.budget.destroy()
        res.status(200).json({
            status: 'Budget Eliminado'
        })
    }
}
