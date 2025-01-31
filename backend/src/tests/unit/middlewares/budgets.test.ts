import { createRequest, createResponse, RequestMethod, ResponseOptions } from 'node-mocks-http'
import { validateBudgetExists } from '../../../middlewares/budgets'
import Budget from '../../../models/Budget'

describe('gudget - validateBudgetId', () => {
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
})