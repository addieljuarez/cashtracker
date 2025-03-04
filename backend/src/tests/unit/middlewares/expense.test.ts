import { createRequest, createResponse } from "node-mocks-http"
import { validateExpenseExists } from "../../../middlewares/expense"
import Expense from "../../../models/Expense"
import { expenses } from "../../mocks/expenses"
import { hasAcess } from "../../../middlewares/budgets"
import { budgets } from "../../mocks/budgets"

describe('middleware - expense - validateExpenseExists', () => {
    
    beforeEach(() => {
        Expense.findByPk = jest.fn().mockReset()
        Expense.findByPk = jest.fn().mockImplementation((id) => {
            const expense = expenses.filter(expense => expense.id == id)[0] ?? null
            return Promise.resolve(expense)
        })
    })
    
    it('should validate exists expense and return success', async() => {
        
        const req = createRequest({
            params: {
                expenseId: 1
            }
        })

        const res = createResponse()
        const next = jest.fn()

        await validateExpenseExists(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        expect(Expense.findByPk).toHaveBeenCalled()
        expect(Expense.findByPk).toHaveBeenCalledTimes(1)
        expect(Expense.findByPk).toHaveBeenCalledWith(req.params.expenseId)
        
    })

    it('should validate not exists expense and return error', async() => {
        
        const req = createRequest({
            params: {
                expenseId: 50
            }
        })

        const res = createResponse()
        const next = jest.fn()

        await validateExpenseExists(req, res, next)

        expect(next).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(0)
        expect(Expense.findByPk).toHaveBeenCalled()
        expect(Expense.findByPk).toHaveBeenCalledTimes(1)
        expect(Expense.findByPk).toHaveBeenCalledWith(req.params.expenseId)
        expect(res.statusCode).toBe(404)
        expect(res._getJSONData()).toEqual({
            error: 'Expense no encontrado'
        })
        
    })


    it('should handle internal server error', async() => {
        
        const req = createRequest({
            params: {
                expenseId: 1
            }
        })

        const res = createResponse()
        const next = jest.fn()
        Expense.findByPk = jest.fn().mockRejectedValue(new Error())
        await validateExpenseExists(req, res, next)

        expect(next).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(0)
        expect(Expense.findByPk).toHaveBeenCalled()
        expect(Expense.findByPk).toHaveBeenCalledTimes(1)
        expect(Expense.findByPk).toHaveBeenCalledWith(req.params.expenseId)
        expect(res.statusCode).toBe(500)
        expect(res._getJSONData()).toEqual({
            error: 'Hubo un error en validateExpenseExists'
        })
    })

    it('should prevent unauthorized users from adding expenses', async() => {
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:bidgetId/expenses',
            budget: budgets[0],
            user: {
                id: 20
            },
            body: {
                name: 'test expense not allowed',
                amount: 1000
            }
        })
        const res = createResponse()
        const next = jest.fn()
        await hasAcess(req, res, next)

        expect(next).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData()).toEqual({
            error: 'Accion no valida'
        })
    })
})