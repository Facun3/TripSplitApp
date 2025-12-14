import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TripsService {
  constructor(
    // El repository se inyectará cuando creemos la entidad
  ) {}
}

