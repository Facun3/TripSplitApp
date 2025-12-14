import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Participant } from '../../participants/entities/participant.entity';
import { Expense } from './expense.entity';

@Entity('expense_splits')
export class ExpenseSplit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Participant, (participant) => participant.splits)
  @JoinColumn({ name: 'participantId' })
  participant: Participant;

  @Column()
  participantId: string;

  @ManyToOne(() => Expense, (expense) => expense.splits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expenseId' })
  expense: Expense;

  @Column()
  expenseId: string;

  @Column('bigint') // Almacenar en centavos
  amount: number;
}

