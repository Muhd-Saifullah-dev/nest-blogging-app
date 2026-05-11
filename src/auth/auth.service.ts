import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/database/repositories/auth.repo';
import { RegisterDto } from './dto/register.dto';
import { hash_password } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly authRepo: AuthRepository) {}

  async register(registerDto: RegisterDto) {
    const existUser = await this.authRepo.findUserByEmail(registerDto.email);
    if (existUser) {
      throw new BadRequestException('email is taken');
    }

    const hashPassword = await hash_password(registerDto.password);

    const user = await this.authRepo.create_user(
      registerDto.email,
      hashPassword!,
    );

    return {
      message: 'user created successfully',
      data: { user },
    };
  }
}
