import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [
    TripsModule, // Importar para usar TripsService si es necesario
  ],
  controllers: [BalancesController],
  providers: [BalancesService],
  exports: [BalancesService],
})
export class BalancesModule {}

