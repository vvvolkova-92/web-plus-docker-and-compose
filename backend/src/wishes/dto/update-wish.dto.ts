import { PartialType } from "@nestjs/mapped-types";
import { CreateWishDto } from "./create-wish.dto";
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from "class-validator";

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Length(1, 250)
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsUrl()
  link?: string;

  @IsNotEmpty()
  @IsUrl()
  image?: string;

  @IsNotEmpty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price?: number;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  raised?: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1024)
  description?: string;
}
