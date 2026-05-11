import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from 'src/database/repositories/auth.repo';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepo: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'Your secret key',
    });
  }
  async validate(payload: { sub: string }) {
    const user = await this.authRepo.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }
    console.log(user, 'LALALA');
    return user;
  }
}
