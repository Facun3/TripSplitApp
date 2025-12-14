import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from './trips/trips.module';
import { ParticipantsModule } from './participants/participants.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BalancesModule } from './balances/balances.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'gastos.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo - usar migraciones en producción
      logging: true,
    }),
    TripsModule,
    ParticipantsModule,
    ExpensesModule,
    BalancesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
