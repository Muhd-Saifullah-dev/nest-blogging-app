import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { User } from '@prisma/client';

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


  async create_user(email:string,password:string):Promise<User>{
    return await this.db.user.create({
      data:{
        email,
        password
      }
    })
  }
}
