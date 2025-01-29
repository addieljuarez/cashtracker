import { createRequest, createResponse } from 'node-mocks-http'
import { budgets } from "../mocks/budgets"
import {BudgetController} from "../../controllers/BudgetController"
import Budget from '../../models/Budget'


describe('BudgetController.getAll', () => {
    it('should retrive 2 budgets with ID=1', async () => {
        expect(budgets).toHaveLength(3)
        expect(budgets).not.toHaveLength(0)

        const req = createRequest({
            method: 'GET', // esto se puede ir pero sirve para documentar 
            url: '/api/budgets', // esto se puede ir pero sirve para documentar
            user: {
                id: 1
            }
        })
        
        const res = createResponse()
        const updatedBudgets = budgets.filter(budget => budget.userId === req.user.id)
        Budget.findAll = jest.fn().mockResolvedValue(updatedBudgets)
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        console.log('data: ===', data)

        expect(data).toHaveLength(2)
        expect(res.statusCode).toBe(200)
        expect(res.statusCode).not.toBe(404)

    })
})
