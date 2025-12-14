import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ParticipantsService } from './participants.service';
import { AddParticipantDto } from './dto/add-participant.dto';
import { ParticipantResponseDto } from './dto/participant-response.dto';
import { Participant } from './entities/participant.entity';

@Controller('trips/:tripId/participants')
@ApiTags('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @ApiOperation({ summary: 'Add participant to trip' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiBody({ type: Array<AddParticipantDto> })
  @ApiResponse({
    status: 201,
    description: 'Participant added successfully',
    type: ParticipantResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  @ApiResponse({ status: 409, description: 'Participant name already exists' })
  async create(
    @Param('tripId') tripId: string,
    @Body() addParticipantDto: AddParticipantDto,
  ): Promise<ParticipantResponseDto> {
    const participant = await this.participantsService.addParticipant(
      tripId,
      addParticipantDto,
    );
    return this.toResponseDto(participant);
  }

  @Get()
  @ApiOperation({ summary: 'Get all participants of a trip' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'List of participants',
    type: [ParticipantResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findAll(
    @Param('tripId') tripId: string,
  ): Promise<ParticipantResponseDto[]> {
    const participants = await this.participantsService.findAllByTrip(tripId);
    return participants.map((p) => this.toResponseDto(p));
  }

  private toResponseDto(participant: Participant): ParticipantResponseDto {
    return {
      id: participant.id,
      name: participant.name,
      tripId: participant.tripId,
    };
  }
}

