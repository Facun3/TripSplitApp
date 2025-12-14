import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsDateString,
  IsUUID,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseSplitDto } from './expense-split.dto';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Descripción del gasto',
    example: 'Cena en restaurante',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Monto total en centavos',
    example: 50000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number; // en centavos

  @ApiProperty({
    description: 'Fecha del gasto (ISO 8601)',
    example: '2024-01-15',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'ID del participante que pagó',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  paidById: string;

  @ApiProperty({
    description: 'División del gasto entre participantes',
    type: [ExpenseSplitDto],
    minItems: 1,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  @ArrayMinSize(1)
  splits: ExpenseSplitDto[];
}

