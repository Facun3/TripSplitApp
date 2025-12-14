import { ApiProperty } from '@nestjs/swagger';

export class ExpenseSplitResponseDto {
  @ApiProperty({
    description: 'ID del participante',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  participantId: string;

  @ApiProperty({
    description: 'Nombre del participante',
    example: 'Juan Pérez',
  })
  participantName: string;

  @ApiProperty({
    description: 'Monto en centavos',
    example: 5000,
  })
  amount: number;
}

export class ExpenseResponseDto {
  @ApiProperty({
    description: 'ID único del gasto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Descripción del gasto',
    example: 'Cena en restaurante',
  })
  description: string;

  @ApiProperty({
    description: 'Monto total en centavos',
    example: 50000,
  })
  amount: number;

  @ApiProperty({
    description: 'Fecha del gasto',
    example: '2024-01-15',
  })
  date: Date;

  @ApiProperty({
    description: 'Información del participante que pagó',
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  })
  paidBy: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'División del gasto entre participantes',
    type: [ExpenseSplitResponseDto],
  })
  splits: ExpenseSplitResponseDto[];

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

