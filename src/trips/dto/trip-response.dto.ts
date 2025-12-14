import { ApiProperty } from '@nestjs/swagger';

export class TripResponseDto {
  @ApiProperty({
    description: 'ID único del viaje',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del viaje',
    example: 'Viaje a París',
  })
  name: string;

  @ApiProperty({
    description: 'Código de moneda',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

