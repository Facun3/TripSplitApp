import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AddParticipantDto {
  @ApiProperty({
    description: 'Nombre del participante',
    example: 'Juan Pérez',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}

