import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class ExpenseSplitDto {
  @ApiProperty({
    description: 'ID del participante',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  participantId: string;

  @ApiProperty({
    description: 'Monto en centavos',
    example: 5000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number; // en centavos
}

