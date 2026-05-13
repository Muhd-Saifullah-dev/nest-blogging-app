import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator"

export class UserDetailDto{
  @IsString()
  @IsNotEmpty()
  firstName:string
  @IsOptional()
  lastName:string
  @IsNotEmpty()
  @IsString()
  @Length(11,11)
  phoneNumber:string
  @IsNotEmpty()
  @IsString()
  address:string
}