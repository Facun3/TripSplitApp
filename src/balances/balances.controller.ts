import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { BalancesService } from './balances.service';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { SettlementResponseDto } from './dto/settlement-response.dto';

@Controller('trips/:tripId')
@ApiTags('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get('balances')
  @ApiOperation({ summary: 'Get balances for all participants' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Balances calculated successfully',
    type: [BalanceResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async getBalances(
    @Param('tripId') tripId: string,
  ): Promise<BalanceResponseDto[]> {
    return this.balancesService.calculateBalances(tripId);
  }

  @Get('settlements')
  @ApiOperation({ summary: 'Get simplified debt settlements' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Settlements calculated successfully',
    type: SettlementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async getSettlements(
    @Param('tripId') tripId: string,
  ): Promise<SettlementResponseDto> {
    return this.balancesService.calculateSettlements(tripId);
  }
}

