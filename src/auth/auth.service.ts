import {
  BadRequestException,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from 'src/database/repositories/auth.repo';
import { RegisterDto } from './dto/register.dto';
import { compare_password, hash_password } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createAccessToken } from 'src/utils/token';
import { LoginDto } from './dto/login.dto';
import { UserDetailDto } from './dto/userDetail.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

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
    const accessToken = await createAccessToken(this.jwtService, {
      id: user.id,
    });
    return {
      message: 'user created successfully',
      data: { user, accessToken },
    };
  }

  async login(loginDto: LoginDto) {
    const existUser = await this.authRepo.findUserByEmail(loginDto.email);
    if (!existUser) {
      throw new UnauthorizedException('user not found');
    }
    const matchedPassword = await compare_password(
      loginDto.password,
      existUser.password,
    );
    if (!matchedPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    const accessToken = await createAccessToken(this.jwtService, {
      id: existUser.id,
    });

    return {
      message: 'user logged in',
      data: {
        user: existUser,
        accessToken,
      },
    };
  }
  async fillUserDetails(userDetailDto: UserDetailDto, userId: string) {
    const user = await this.authRepo.fillUserDetails(userDetailDto, userId);
    return {
      message: 'user details successfully',
      data: { user },
    };
  }
  async getMyProfile(userId: string) {
    console.log(userId, 'userId');
    const user = await this.authRepo.getUserWithDetails(userId);
    return {
      message: 'user fetched successfully',
      data: { user },
    };
  }

  async logout(req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    const tokenBlacklist = await this.authRepo.blacklistToken(
      token,
      req.user.id,
    );
    return {
      message: 'user logged out successfull',
      data: tokenBlacklist,
    };
  }
}
