import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsStrongPassword({
    minLowercase: 1,
    minNumbers: 2,
    minSymbols: 1,
    minUppercase: 1,
    minLength: 8,
  })
  password: string;
}
