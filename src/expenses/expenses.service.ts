import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class ExpensesService {
  constructor(
    // Los repositories se inyectarán cuando creemos las entidades
    private readonly tripsService: TripsService,
  ) {}
}

