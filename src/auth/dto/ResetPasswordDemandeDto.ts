import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDemandDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
