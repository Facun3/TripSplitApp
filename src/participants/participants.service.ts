import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';
import { TripsService } from '../trips/trips.service';
import { AddParticipantDto } from './dto/add-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    private readonly tripsService: TripsService,
  ) {}

  async addParticipant(
    tripId: string,
    dto: AddParticipantDto,
  ): Promise<Participant> {
    // Validar que el viaje existe
    const trip = await this.tripsService.findOne(tripId);

    // Validar nombre único dentro del viaje
    const existing = await this.participantRepository.findOne({
      where: { tripId, name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Participant with name "${dto.name}" already exists in this trip`,
      );
    }

    const participant = this.participantRepository.create({
      ...dto,
      tripId,
    });
    const saved = await this.participantRepository.save(participant);

    // Validar mínimo 2 participantes después de agregar
    const participants = await this.participantRepository.find({
      where: { tripId },
    });
    if (participants.length < 2) {
      // No lanzamos error, solo validamos al crear gastos
    }

    return saved;
  }

  async findAllByTrip(tripId: string): Promise<Participant[]> {
    // Validar que el viaje existe
    await this.tripsService.findOne(tripId);

    return this.participantRepository.find({
      where: { tripId },
      order: { name: 'ASC' },
    });
  }

  async findOne(tripId: string, participantId: string): Promise<Participant> {
    const participant = await this.participantRepository.findOne({
      where: { id: participantId, tripId },
    });
    if (!participant) {
      throw new NotFoundException(
        `Participant with ID ${participantId} not found in trip ${tripId}`,
      );
    }
    return participant;
  }

  async validateParticipantInTrip(
    tripId: string,
    participantId: string,
  ): Promise<Participant> {
    return this.findOne(tripId, participantId);
  }
}

