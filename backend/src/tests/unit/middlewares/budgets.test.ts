import { createRequest, createResponse, RequestMethod, ResponseOptions } from 'node-mocks-http'
import { hasAcess, validateBudgetExists } from '../../../middlewares/budgets'
import Budget from '../../../models/Budget'
import { budgets } from '../../mocks/budgets'

describe('budget - validateBudgetId', () => {
    it('should handle non exists budget', async() => {
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })

        Budget.findByPk = jest.fn().mockResolvedValue(null)

        const res = createResponse()
        const next = jest.fn()
        await validateBudgetExists(req, res, next)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({
            error: 'Budget no encontrado'
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('should handle exists budget and proceed next', async() => {
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })

        Budget.findByPk = jest.fn().mockResolvedValue(budgets[0])

        const res = createResponse()
        const next = jest.fn()
        await validateBudgetExists(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        expect(req.budget).toEqual(budgets[0])
    })

    it('Should reject when search a budget', async() => {
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        const res = createResponse()
        const next = jest.fn()
        Budget.findByPk = jest.fn().mockRejectedValue(new Error)

        await validateBudgetExists(req, res, next)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(500)
        expect(data).toEqual({
            error: 'Hubo un error en getByID'
        })
        expect(next).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(0)
    })
})


describe('budget - hasAcess', () => {
    it('should handle access to user', async() => {
        const req = createRequest({
            budget: budgets[0],
            user: { 
                id: 2
            }
        })
        const res = createResponse()
        const next = jest.fn()
        
        await hasAcess(req, res, next)
        
        const data = res._getJSONData()
        expect(res.statusCode).toBe(401),
        expect(next).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(0),
        expect(data).toEqual({
            error: 'Accion no valida'
        })
    })

    it('should handle access to user', async() => {
        const req = createRequest({
            budget: budgets[0],
            user: { 
                id: 1
            }
        })
        const res = createResponse()
        const next = jest.fn()
        
        await hasAcess(req, res, next)
        
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
    })
})