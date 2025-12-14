import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
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
    description: 'Balance en centavos (positivo = le deben, negativo = debe)',
    example: 5000,
  })
  balance: number; // en centavos (positivo = le deben, negativo = debe)
}

