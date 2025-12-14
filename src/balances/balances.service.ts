import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BalancesService {
  constructor(
    // Los repositories se inyectarán cuando creemos las entidades
  ) {}
}

