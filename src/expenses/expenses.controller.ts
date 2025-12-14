import { Controller } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('trips/:tripId/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}
}

