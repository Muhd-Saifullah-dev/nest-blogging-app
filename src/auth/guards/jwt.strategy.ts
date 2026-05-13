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
       passReqToCallback: true,
    });
  }
  async validate(req:any,payload: { sub: string }) {
   const token = req.headers.authorization?.split(' ')[1];

  const blacklisted = await this.authRepo.findBlacklistedToken(token);

  if (blacklisted) {
    throw new UnauthorizedException('Token is blacklisted');
  }
    const user = await this.authRepo.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }
    console.log(user, 'LALALA');
    return user;
  }
}
