import { ApiProperty } from '@nestjs/swagger';
export class UpdateDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly avatar: string;
}
