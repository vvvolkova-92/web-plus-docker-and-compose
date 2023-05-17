import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class CreateUserDto {
  @Length(2, 30)
  @IsNotEmpty()
  @IsString()
  username: string;

  @Length(2, 200)
  @IsString()
  about?: string;

  @IsUrl()
  avatar?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
