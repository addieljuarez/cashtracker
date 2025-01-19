import { Router } from 'express'

const router = Router()

router.get('/', (rea, res) => {
    console.log('Desde /api/budgets')
})


export default router
