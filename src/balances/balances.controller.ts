import { Controller } from '@nestjs/common';
import { BalancesService } from './balances.service';

@Controller('trips/:tripId')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}
}

