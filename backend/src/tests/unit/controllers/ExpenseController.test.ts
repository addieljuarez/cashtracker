import { createRequest, createResponse} from 'node-mocks-http'
import ExpenseController from '../../../controllers/ExpenseController'
import { budgets } from '../../mocks/budgets'
import Budget from '../../../models/Budget'
import Expense from '../../../models/Expense'

describe('ExpenseController.create', () => {
    it('should handle create a expense', async() => {
        const  expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: budgets[0],
            body: {
                name: 'test',
                amount: 1000
            }
        })
        const res = createResponse()
        
        Expense.create = jest.fn().mockResolvedValue(expenseMock)
        await ExpenseController.create(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(201)
        expect(expenseMock.save).toHaveBeenCalled()
        expect(expenseMock.save).toHaveBeenCalledTimes(1)
        expect(Expense.create).toHaveBeenCalledWith(req.body)
        expect(data).toEqual({
            status: 'Expense creado correctamente'
        })
    })
})