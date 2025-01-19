import { Router } from 'express'
import { BudgetController } from './../controllers/BudgetController'
const router = Router()

router.get('/', BudgetController.getAll)


export default router
