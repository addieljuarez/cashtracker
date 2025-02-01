import { createRequest, createResponse} from 'node-mocks-http'
import ExpenseController from '../../../controllers/ExpenseController'
import { budgets } from '../../mocks/budgets'
import Budget from '../../../models/Budget'
import Expense from '../../../models/Expense'
import { expenses } from '../../mocks/expenses'

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

    it('should handle error to create expense', async() => {

        const mockExpense = {
            save: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: budgets,
            body: {
                name: 'test expense',
                amount: 1000
            }
        })
        const res = createResponse()
        Expense.create = jest.fn().mockRejectedValue(new Error)
        await ExpenseController.create(req, res)

        expect(res.statusCode).toBe(500)
        expect(mockExpense.save).not.toHaveBeenCalled()
        expect(mockExpense.save).toHaveBeenCalledTimes(0)
        expect(Expense.create).toHaveBeenCalledWith(req.body)
        expect(res._getJSONData()).toEqual({
            error: 'Error en create expense'
        })
    })
})

describe('ExpenseController.getById', () => {
    it('should handle get expense by ID=1', async() => {

        const req = createRequest({
            method: "GET",
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[0]
        })
        const res = createResponse()
        
        await ExpenseController.getById(req, res)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toEqual(expenses[0])
    })
})

describe('ExpenseController.updateById', () => {
    it('should handle update expense by ID=1', async() => {

        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: {
                ...expenses[0],
                // update: jest.fn().mockResolvedValue(true)
                update: jest.fn()
            },
            body: {
                name: 'update expense',
                amount: 2000
            }
        })
        const res = createResponse()

        await ExpenseController.updateById(req, res)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toEqual({
            status: 'actualizado correctamente '
        })
        expect(req.expense.update).toHaveBeenCalled()
        expect(req.expense.update).toHaveBeenCalledTimes(1)
        expect(req.expense.update).toHaveBeenCalledWith(req.body)
    })
})

describe('ExpenseController.deleteById', () => {
    it('should handle expense delete', async() => {
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: {
                ...expenses[0],
                destroy: jest.fn()
            }
        })

        const res = createResponse()

        await ExpenseController.deleteById(req, res)

        expect(res.statusCode).toBe(200)
        expect(req.expense.destroy).toHaveBeenCalled()
        expect(req.expense.destroy).toHaveBeenCalledTimes(1)
        expect(res._getJSONData()).toBe('gasto eliminado')
    })
})