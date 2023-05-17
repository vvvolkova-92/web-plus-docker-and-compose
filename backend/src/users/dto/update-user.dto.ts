import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Length(2, 30)
  @IsString()
  username?: string;

  @Length(2, 200)
  @IsString()
  about?: string;

  @IsUrl()
  avatar?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  password?: string;
}
