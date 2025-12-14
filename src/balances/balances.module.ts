import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { Participant } from '../participants/entities/participant.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant, Expense, ExpenseSplit]),
    TripsModule, // Importar para usar TripsService
  ],
  controllers: [BalancesController],
  providers: [BalancesService],
  exports: [BalancesService],
})
export class BalancesModule {}

