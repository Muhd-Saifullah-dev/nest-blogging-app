import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { ProfileCompletedGuard } from './guards/profile-completed.guard';
import { UserDetailDto } from './dto/userDetail.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard, ProfileCompletedGuard)
  @Get('profile')
  getMyProfile(@Req() req) {
    console.log('user info', req.user.id);
    return this.authService.getMyProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('user-detail')
  fillUserDetails(@Body() userDetailDto: UserDetailDto, @Req() req) {
    return this.authService.fillUserDetails(userDetailDto, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Req() req) {
    return this.authService.logout(req)
  }
}
