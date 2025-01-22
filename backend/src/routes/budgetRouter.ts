import { Router } from 'express'
import { BudgetController } from './../controllers/BudgetController'
import {validateBudgetExists, validateBudgetId, validateBudgetInput} from '../middlewares/budgets'
const router = Router()

router.get('/', BudgetController.getAll)

router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists)

router.post('/', validateBudgetInput, BudgetController.create)

router.get('/:budgetId', BudgetController.getById)

router.put('/:budgetId', validateBudgetInput, BudgetController.updateById)

router.delete('/:budgetId', BudgetController.deleteById)


export default router
