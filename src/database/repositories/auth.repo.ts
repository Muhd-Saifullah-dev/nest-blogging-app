import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { User, UserDetail } from '@prisma/client';
import { UserDetailDto } from 'src/auth/dto/userDetail.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: DatabaseService) {}
  async findUserById(id: string): Promise<User | null> {
    return await this.db.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.db.user.findFirst({
      where: { email },
    });
  }

  async create_user(email: string, password: string): Promise<User> {
    return await this.db.user.create({
      data: {
        email,
        password,
      },
    });
  }

  async getUserWithDetails(userId: string) {
    return await this.db.user.findUnique({
      where: { id: userId },
      include: {
        detail: true,
      },
    });
  }
  async fillUserDetails(
    userDetailsdto: UserDetailDto,
    userId: string,
  ): Promise<UserDetail> {
    const result = await this.db.$transaction(async (tx) => {
      const userDetail = await tx.userDetail.create({
        data: {
          firstName: userDetailsdto.firstName,
          lastName: userDetailsdto.lastName,
          address: userDetailsdto.address,
          phoneNumber: userDetailsdto.phoneNumber,
          userId: userId,
        },
      });
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          isProfileCompleted: true,
        },
      });
      return userDetail;
    });
    return result;
  }

  async blacklistToken(token: string, userId: string) {
    return await this.db.blacklistedToken.create({
      data: {
        token: token,
        userId: userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  async findBlacklistedToken(token: string): Promise<boolean> {
    const record = await this.db.blacklistedToken.findFirst({
      where: {
        token: token,
      },
    });
    return !!record;
  }
}
