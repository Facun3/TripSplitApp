import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';
import { TripsService } from '../trips/trips.service';
import { ParticipantsService } from '../participants/participants.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private splitRepository: Repository<ExpenseSplit>,
    private readonly tripsService: TripsService,
    private readonly participantsService: ParticipantsService,
  ) {}

  async create(tripId: string, dto: CreateExpenseDto): Promise<Expense> {
    // Validar que el viaje existe
    const trip = await this.tripsService.findOne(tripId);

    // Validar mínimo 2 participantes
    const participants = await this.participantsService.findAllByTrip(tripId);
    if (participants.length < 2) {
      throw new BadRequestException(
        'A trip must have at least 2 participants to create expenses',
      );
    }

    // Validar que el pagador pertenece al viaje
    await this.participantsService.validateParticipantInTrip(
      tripId,
      dto.paidById,
    );

    // Validar suma de splits
    const totalSplits = dto.splits.reduce((sum, split) => sum + split.amount, 0);
    if (totalSplits !== dto.amount) {
      throw new BadRequestException(
        `Sum of splits (${totalSplits}) must equal expense amount (${dto.amount})`,
      );
    }

    // Validar que todos los participantes de splits pertenecen al viaje
    for (const split of dto.splits) {
      await this.participantsService.validateParticipantInTrip(
        tripId,
        split.participantId,
      );
    }

    // Validar que hay al menos un split
    if (dto.splits.length === 0) {
      throw new BadRequestException('An expense must have at least one split');
    }

    const expense = this.expenseRepository.create({
      description: dto.description,
      amount: dto.amount,
      date: new Date(dto.date),
      paidById: dto.paidById,
      tripId,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    // Crear splits
    const splits = dto.splits.map((split) =>
      this.splitRepository.create({
        expenseId: savedExpense.id,
        participantId: split.participantId,
        amount: split.amount,
      }),
    );
    await this.splitRepository.save(splits);

    return this.findOne(tripId, savedExpense.id);
  }

  async findAllByTrip(tripId: string): Promise<Expense[]> {
    // Validar que el viaje existe
    await this.tripsService.findOne(tripId);

    return this.expenseRepository.find({
      where: { tripId },
      relations: ['paidBy', 'splits', 'splits.participant'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(tripId: string, expenseId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, tripId },
      relations: ['paidBy', 'splits', 'splits.participant'],
    });
    if (!expense) {
      throw new NotFoundException(
        `Expense with ID ${expenseId} not found in trip ${tripId}`,
      );
    }
    return expense;
  }

  async update(
    tripId: string,
    expenseId: string,
    dto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(tripId, expenseId);

    // Validar que el pagador pertenece al viaje si se actualiza
    if (dto.paidById) {
      await this.participantsService.validateParticipantInTrip(
        tripId,
        dto.paidById,
      );
    }

    // Validaciones similares a create
    if (dto.amount !== undefined || dto.splits !== undefined) {
      const amount = dto.amount ?? expense.amount;
      const splits =
        dto.splits ??
        expense.splits.map((s) => ({
          participantId: s.participantId,
          amount: s.amount,
        }));

      const totalSplits = splits.reduce((sum, split) => sum + split.amount, 0);
      if (totalSplits !== amount) {
        throw new BadRequestException(
          `Sum of splits (${totalSplits}) must equal expense amount (${amount})`,
        );
      }

      // Validar que todos los participantes de splits pertenecen al viaje
      if (dto.splits) {
        for (const split of dto.splits) {
          await this.participantsService.validateParticipantInTrip(
            tripId,
            split.participantId,
          );
        }
      }
    }

    // Actualizar expense
    if (dto.description !== undefined) {
      expense.description = dto.description;
    }
    if (dto.amount !== undefined) {
      expense.amount = dto.amount;
    }
    if (dto.date !== undefined) {
      expense.date = new Date(dto.date);
    }
    if (dto.paidById !== undefined) {
      expense.paidById = dto.paidById;
    }
    await this.expenseRepository.save(expense);

    // Si se actualizaron splits, eliminarlos y recrearlos
    if (dto.splits) {
      await this.splitRepository.delete({ expenseId });
      const newSplits = dto.splits.map((split) =>
        this.splitRepository.create({
          expenseId,
          participantId: split.participantId,
          amount: split.amount,
        }),
      );
      await this.splitRepository.save(newSplits);
    }

    return this.findOne(tripId, expenseId);
  }

  async remove(tripId: string, expenseId: string): Promise<void> {
    const expense = await this.findOne(tripId, expenseId);
    await this.expenseRepository.remove(expense);
  }
}

