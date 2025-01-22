import { Router } from 'express'
import { BudgetController } from './../controllers/BudgetController'
import ExpenseController from '../controllers/ExpenseController'
import {validateBudgetExists, validateBudgetId, validateBudgetInput} from '../middlewares/budgets'
const router = Router()

router.get('/', BudgetController.getAll)

// budgets routes
router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists)

router.post('/', validateBudgetInput, BudgetController.create)
router.get('/:budgetId', BudgetController.getById)
router.put('/:budgetId', validateBudgetInput, BudgetController.updateById)
router.delete('/:budgetId', BudgetController.deleteById)

// expenses routes
router.get('/:budgetId/expenses', ExpenseController.getAll)
router.post('/:budgetId/expenses', ExpenseController.create)
router.get('/:budgetId/expenses/:expenseId', ExpenseController.getById)
router.put('/:budgetId/expenses/:expenseId', ExpenseController.updateById)
router.delete('/:budgetId/expenses/:expenseId', ExpenseController.deleteById)


export default router
