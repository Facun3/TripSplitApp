import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  imports: [
    // Las entidades se importarán cuando las creemos
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService], // Exportar para usar en otros módulos
})
export class TripsModule {}

