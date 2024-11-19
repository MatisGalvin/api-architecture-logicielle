import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsOptional()
  readonly title: string;
  @ApiProperty()
  @IsOptional()
  readonly body: string;
}
