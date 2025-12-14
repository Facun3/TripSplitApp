import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class ParticipantsService {
  constructor(
    // El repository se inyectará cuando creemos la entidad
    private readonly tripsService: TripsService,
  ) {}
}

