import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Participant } from '../../participants/entities/participant.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 3 })
  currency: string; // USD, EUR, etc.

  @OneToMany(() => Participant, (participant) => participant.trip, {
    cascade: true,
  })
  participants: Participant[];

  @OneToMany(() => Expense, (expense) => expense.trip, { cascade: true })
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

