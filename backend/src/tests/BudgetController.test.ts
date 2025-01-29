import { budgets } from "./mocks/budgets";

describe('BudgetController.getAll', () => {
    it('should retrive 3 budgets', () => {
        expect(budgets).toHaveLength(3)
        expect(budgets).not.toHaveLength(0)
    })
})
