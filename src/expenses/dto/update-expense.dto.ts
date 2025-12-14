import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseSplitDto } from './expense-split.dto';

export class UpdateExpenseDto {
  @ApiProperty({
    description: 'Descripción del gasto',
    example: 'Cena en restaurante',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Monto total en centavos',
    example: 50000,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Fecha del gasto (ISO 8601)',
    example: '2024-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'ID del participante que pagó',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  paidById?: string;

  @ApiProperty({
    description: 'División del gasto entre participantes',
    type: [ExpenseSplitDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  @IsOptional()
  splits?: ExpenseSplitDto[];
}

