import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/domain/prisma.service';
import { UpdateDto } from 'src/infrastructure/http/dtos/user/UpdateDto';

@Injectable()
export class UpdateUser {
  constructor(private readonly prismaService: PrismaService) {}

  async update(userId: number, updateDto: UpdateDto) {
    const { username, email, avatar } = updateDto;

    try {
      const user = await this.prismaService.user.update({
        where: { userId },
        data: { username, email, avatar },
      });

      const userReturned = {
        username: user.username,
        userId: user.userId,
        email: user.email,
        avatar: user.avatar,
      };

      return userReturned;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
