import { createRequest, createResponse } from 'node-mocks-http'
import { budgets } from "../../mocks/budgets"
import {BudgetController} from "../../../controllers/BudgetController"
import Budget from '../../../models/Budget'
import Expense from '../../../models/Expense'


describe('BudgetController.getAll', () => {

    beforeEach(() => {
        Budget.findAll = jest.fn().mockReset()

        Budget.findAll = jest.fn().mockImplementation((options) => {
            // console.log('options findAll: ', options.where.userId)
            const updatedBudgets = budgets.filter(budget => budget.userId === options.where.userId)
            // Budget.findAll = jest.fn().mockResolvedValue(updatedBudgets)
            return Promise.resolve(updatedBudgets)
        })
    })

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
        // const updatedBudgets = budgets.filter(budget => budget.userId === req.user.id)
        // Budget.findAll = jest.fn().mockResolvedValue(updatedBudgets)
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        // console.log('data: ===', data)

        expect(data).toHaveLength(2)
        expect(res.statusCode).toBe(200)
        expect(res.statusCode).not.toBe(404)

    })

    it('should retrive 1 budgets with ID=2', async () => {
        expect(budgets).toHaveLength(3)
        expect(budgets).not.toHaveLength(0)

        const req = createRequest({
            method: 'GET', // esto se puede ir pero sirve para documentar 
            url: '/api/budgets', // esto se puede ir pero sirve para documentar
            user: {
                id: 2
            }
        })
        
        const res = createResponse()
        // aqui iba el codigo del foreach
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        // console.log('data: ===', data)

        expect(data).toHaveLength(1)
        expect(res.statusCode).toBe(200)
        expect(res.statusCode).not.toBe(404)

    })

    it('should retrive 0 budgets with ID=3', async () => {
        expect(budgets).toHaveLength(3)
        expect(budgets).not.toHaveLength(0)

        const req = createRequest({
            method: 'GET', // esto se puede ir pero sirve para documentar 
            url: '/api/budgets', // esto se puede ir pero sirve para documentar
            user: {
                id: 3
            }
        })
        
        const res = createResponse()
         // aqui iba el codigo del foreach
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()

        //console.log('data: ===', data)

        expect(data).toHaveLength(0)
        expect(res.statusCode).toBe(200)
        expect(res.statusCode).not.toBe(404)

    })

    it('should handle errors when fetching budgets', async () => {
        Budget.findAll = jest.fn().mockRejectedValue(new Error)
        const req = createRequest({
            method: 'GET', // esto se puede ir pero sirve para documentar 
            url: '/api/budgets', // esto se puede ir pero sirve para documentar
            user: {
                id: 1
            }
        })
        
        const res = createResponse()
        // aqui iba el codigo del foreach
        await BudgetController.getAll(req, res)

        expect(res.statusCode).toBe(500)
        expect(res.statusCode).not.toBe(200)
        expect(res._getJSONData()).toEqual({
            error: 'Hubo un error en getAll'
        })
    })
})

describe('BudgetController.create', () => {
    it('should create a new budget and response with statusCode 201', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: {
                id: 1
            },
            body: {
                name: 'Presupuesto de prueba',
                amount: 1000
            }
        })

        const res = createResponse();
        
        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        }
        Budget.create = jest.fn().mockResolvedValue(mockBudget)
        await BudgetController.create(req, res)
        const data = res._getJSONData()
        // console.log(data)

        expect(res.statusCode).toBe(201)
        expect(data).toEqual({
            respuesta: 'creado correctamente'
        })
        expect(mockBudget.save).toHaveBeenCalled()
        expect(mockBudget.save).toHaveBeenCalledTimes(1)
        expect(Budget.create).toHaveBeenCalledWith(req.body)
    })


    it('should hanlde error when create errors', async () => {

        const mockBudget = {
            save: jest.fn()
        }

        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: {
                id: 1
            },
            body: {
                name: 'Presupuesto de prueba',
                amount: 1000
            }
        })

        const res = createResponse();

        Budget.create = jest.fn().mockRejectedValue(new Error())
        
        await BudgetController.create(req, res)
        expect(res.statusCode).toBe(500)
        expect(res._getJSONData()).toEqual({
            error: 'hubo un error en createController budget'
        })
        expect(mockBudget.save).not.toHaveBeenCalled()
        expect(Budget.create).toHaveBeenCalledWith(req.body)

    })
})

describe('BudgetController.getById', () => {
    
    beforeEach(() => {
        Budget.findByPk = jest.fn().mockReset()
        Budget.findByPk = jest.fn().mockImplementation((id, include) => {
            console.log('id getById', id)
            console.log('include getById', include)
            const updateBudget = budgets.filter(budget => budget.id == id)[0]
            console.log('updateBudget', updateBudget)
            return Promise.resolve(updateBudget)
        })
    })

    it('should return a budget with ID 1 and 3 expenses', async () => {
        
        const req = createRequest({
            method: 'GET',
            url:'/api/budgets/:budgetId',
            budget: {
                id: 1
            }
        })

        const res = createResponse()

        await BudgetController.getById(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(3)
        expect(Budget.findByPk).toHaveBeenCalled()
        expect(Budget.findByPk).toHaveBeenCalledTimes(1)
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
            include: [Expense]
        })
    })

    it('should return a budget with ID 2 and 2 expenses', async () => {
        
        const req = createRequest({
            method: 'GET',
            url:'/api/budgets/:budgetId',
            budget: {
                id: 2
            }
        })

        const res = createResponse()

        await BudgetController.getById(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(2)
        
    })

    it('should return a budget with ID 3 and 0 expenses', async () => {
        
        const req = createRequest({
            method: 'GET',
            url:'/api/budgets/:budgetId',
            budget: {
                id: 3
            }
        })

        const res = createResponse()

        await BudgetController.getById(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(0)
        
        
    })
})

describe('BudgetController.updateById', () => {
    it('should update a budget with ID 1', async() => {

        const budgetMock = {
            update: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId',
            budget: budgetMock,
            body: {
                name: 'Presupuesto actualizado',
                amount: 1000
            }
        })
        
        const res = createResponse()

        await BudgetController.updateById(req, res)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toEqual({
            status: 'budget actualizado'
        })
        expect(budgetMock.update).toHaveBeenCalled()
        expect(budgetMock.update).toHaveBeenCalledTimes(1)
        expect(budgetMock.update).toHaveBeenCalledWith(req.body)
    })
})

describe('BudgetController.deleteById', () => {

    it('shoule delete a budget with ID 1', async() => {

        const budgetMock = {
            destroy: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budget/:budgetId',
            budget: budgetMock,
        })

        const res = createResponse()

        await BudgetController.deleteById(req, res)
        const data = res._getJSONData()
        console.log('data', data)
        expect(res.statusCode).toBe(200)
        expect(data).toEqual({
            status: 'Budget Eliminado'
        })
        expect(budgetMock.destroy).toHaveBeenCalled()
        expect(budgetMock.destroy).toHaveBeenCalledTimes(1)
    })
})