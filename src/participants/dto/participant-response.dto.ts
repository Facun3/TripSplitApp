import { ApiProperty } from '@nestjs/swagger';

export class ParticipantResponseDto {
  @ApiProperty({
    description: 'ID único del participante',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del participante',
    example: 'Juan Pérez',
  })
  name: string;

  @ApiProperty({
    description: 'ID del viaje al que pertenece',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  tripId: string;
}

