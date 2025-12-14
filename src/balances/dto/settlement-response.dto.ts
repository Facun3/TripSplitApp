import { ApiProperty } from '@nestjs/swagger';

export class SettlementDto {
  @ApiProperty({
    description: 'Nombre del participante que debe',
    example: 'Juan Pérez',
  })
  from: string; // nombre del participante que debe

  @ApiProperty({
    description: 'Nombre del participante al que le deben',
    example: 'María García',
  })
  to: string; // nombre del participante al que le deben

  @ApiProperty({
    description: 'Monto a transferir en centavos',
    example: 5000,
  })
  amount: number; // en centavos
}

export class SettlementResponseDto {
  @ApiProperty({
    description: 'Lista de transferencias simplificadas',
    type: [SettlementDto],
  })
  settlements: SettlementDto[];
}

