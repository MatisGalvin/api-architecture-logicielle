import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title?: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly body?: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly image?: string;
}
