import type { Request, Response } from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static getAll = async(req: Request, res: Response) => {
        try{
            const budgets = await Budget.findAll({
                 order: [
                    ['createdAt', 'DESC']
                ],
                limit: 100,
                where: {
                    name: 'anything'
                }
            })
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

    static getById = async(req: Request, res: Response): Promise<any> => {
        // console.log('desde controller getById')
        try{
            const { id } = req.params
            const budgetId = await Budget.findByPk(id)
            if(!budgetId){
                const error = new Error('Budget no encontrado')
                return res.status(404).json({
                    error: error.message
                })
            }
            res.status(201).json(budgetId)
        }catch(error){
            console.log('error getById', error)
            res.status(400).json({
                error: 'Hubo un error en getByID'
            })
        }

    }

    static updateById = async(req: Request, res: Response) => {
        try{
            const { id } = req.params
            const updateBudgetById = await Budget.findByPk(id)
            if(!updateBudgetById){
                const error = new Error('Budget No encontrado')
                return res.status(404).json({
                    error: error.message
                })
            }
            await updateBudgetById.update(req.body)
            res.status(201).json({
                status: 'actualizado correctamente'
            })
        } catch(error){
            console.log('Error en update budget', error)
            res.status(500).json({
                error: 'hubo un error en updateById'
            })
        }
    }

    static deleteById = async(req: Request, res: Response): Promise<any> => {
        try{
            const { id } = req.params
            const budgetToDelete = await Budget.findByPk(id)
            if(!budgetToDelete){
                const error = new Error('budget no encontrado')
                return res.status(404).json({
                    error: error.message
                })
            }
            await budgetToDelete.destroy()
            res.status(201).json({
                status: 'eliminado satisfactoriamente'
            })
        }catch(error){
            console.log('error en deleteById', error)
            res.status(500).json({
                error: 'hay un error en deleteById'
            })
        }
    }
}
