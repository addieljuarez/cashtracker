import { Router } from 'express'
import { body, param } from 'express-validator'
import { BudgetController } from './../controllers/BudgetController'
import { handleInputErrors } from '../middlewares/validation'
import {validateBudgetId} from '../middlewares/budgets'
const router = Router()

router.get('/', BudgetController.getAll)

router.post('/',
    body('name')
        .notEmpty()
        .withMessage('El nombre del presupuesto no puede ir vacio'),
    body('amount')
        .notEmpty()
        .withMessage('El monto no puede quedar vacio')
        .isNumeric()
        .withMessage('el monto debe ser un numero')
        .custom((value) => {
           return value > 0
        })
        .withMessage('El numro debe ser valor a 0'),
    handleInputErrors,
    BudgetController.create)

router.get('/:id', 
    validateBudgetId,
    BudgetController.getById)

router.put('/:id', 
    validateBudgetId,
    body('name')
        .notEmpty()
        .withMessage('El nombre del presupuesto no puede ir vacio'),
    body('amount')
        .notEmpty()
        .withMessage('El monto no puede quedar vacio')
        .isNumeric()
        .withMessage('el monto debe ser un numero')
        .custom((value) => {
           return value > 0
        })
        .withMessage('El numro debe ser valor a 0'),
    BudgetController.getById)

router.delete('/:id', 
    validateBudgetId,
    BudgetController.deleteById)


export default router
