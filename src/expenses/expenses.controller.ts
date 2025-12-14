import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { Expense } from './entities/expense.entity';

@Controller('trips/:tripId/expenses')
@ApiTags('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({
    status: 201,
    description: 'Expense created successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Trip or participant not found' })
  async create(
    @Param('tripId') tripId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.create(tripId, createExpenseDto);
    return this.toResponseDto(expense);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses of a trip' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'List of expenses',
    type: [ExpenseResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findAll(
    @Param('tripId') tripId: string,
  ): Promise<ExpenseResponseDto[]> {
    const expenses = await this.expensesService.findAllByTrip(tripId);
    return expenses.map((e) => this.toResponseDto(e));
  }

  @Get(':expenseId')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiParam({ name: 'expenseId', description: 'Expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense found',
    type: ExpenseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.findOne(tripId, expenseId);
    return this.toResponseDto(expense);
  }

  @Put(':expenseId')
  @ApiOperation({ summary: 'Update expense' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiParam({ name: 'expenseId', description: 'Expense ID' })
  @ApiBody({ type: UpdateExpenseDto })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async update(
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.update(
      tripId,
      expenseId,
      updateExpenseDto,
    );
    return this.toResponseDto(expense);
  }

  @Delete(':expenseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiParam({ name: 'expenseId', description: 'Expense ID' })
  @ApiResponse({ status: 204, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async remove(
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
  ): Promise<void> {
    await this.expensesService.remove(tripId, expenseId);
  }

  private toResponseDto(expense: Expense): ExpenseResponseDto {
    return {
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      paidBy: {
        id: expense.paidBy.id,
        name: expense.paidBy.name,
      },
      splits: expense.splits.map((s) => ({
        participantId: s.participantId,
        participantName: s.participant.name,
        amount: s.amount,
      })),
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }
}

