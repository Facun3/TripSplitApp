import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Length } from 'class-validator';

export class CreateTripDto {
  @ApiProperty({
    description: 'Nombre del viaje',
    example: 'Viaje a París',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Código de moneda (3 caracteres)',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency: string;
}

