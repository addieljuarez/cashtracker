import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript'
import Expense from './Expense'
import User from './User'

@Table({
    tableName: 'budgets'
})

class Budget extends Model{
    @Column({
        type: DataType.STRING(100) 
    })
    declare name: string

    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number

    @HasMany(() => Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expenses: Expense[]

    @ForeignKey(() => User)
    declare userId: number

    @BelongsTo(() => User)
    declare user: User
}

export default Budget
