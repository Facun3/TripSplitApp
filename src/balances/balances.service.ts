import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from '../participants/entities/participant.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { SettlementResponseDto } from './dto/settlement-response.dto';
import { DebtSimplifier } from './utils/debt-simplifier';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private splitRepository: Repository<ExpenseSplit>,
    private readonly tripsService: TripsService,
  ) {}

  async calculateBalances(tripId: string): Promise<BalanceResponseDto[]> {
    // Validar que el viaje existe
    await this.tripsService.findOne(tripId);

    const participants = await this.participantRepository.find({
      where: { tripId },
    });

    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: ['paidBy', 'splits'],
    });

    const balances = participants.map((participant) => {
      // Total pagado
      const totalPaid = expenses
        .filter((e) => e.paidById === participant.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      // Total consumido
      const totalConsumed = expenses
        .flatMap((e) => e.splits)
        .filter((s) => s.participantId === participant.id)
        .reduce((sum, s) => sum + Number(s.amount), 0);

      const balance = totalPaid - totalConsumed;

      return {
        participantId: participant.id,
        participantName: participant.name,
        balance,
      };
    });

    return balances;
  }

  async calculateSettlements(
    tripId: string,
  ): Promise<SettlementResponseDto> {
    const balances = await this.calculateBalances(tripId);
    const settlements = DebtSimplifier.simplify(balances);
    return { settlements };
  }
}

