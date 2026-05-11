import { JwtService } from '@nestjs/jwt';

export async function createAccessToken(
  jwtService: JwtService,
  user: { id: string },
) {
  const payload = {
    sub: user.id,
  };

  return jwtService.signAsync(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  });
}
