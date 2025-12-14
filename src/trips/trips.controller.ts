import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripResponseDto } from './dto/trip-response.dto';
import { Trip } from './entities/trip.entity';

@Controller('trips')
@ApiTags('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({
    status: 201,
    description: 'Trip created successfully',
    type: TripResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTripDto: CreateTripDto): Promise<TripResponseDto> {
    const trip = await this.tripsService.create(createTripDto);
    return this.toResponseDto(trip);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete trip by ID' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({ status: 204, description: 'Trip deleted successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.tripsService.delete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Trip found',
    type: TripResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findOne(@Param('id') id: string): Promise<TripResponseDto> {
    const trip = await this.tripsService.findOne(id);
    return this.toResponseDto(trip);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
  @ApiResponse({
    status: 200,
    description: 'List of trips',
    type: [TripResponseDto],
  })
  async findAll(): Promise<TripResponseDto[]> {
    const trips = await this.tripsService.findAll();
    return trips.map((trip) => this.toResponseDto(trip));
  }

  private toResponseDto(trip: Trip): TripResponseDto {
    return {
      id: trip.id,
      name: trip.name,
      currency: trip.currency,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }
}

