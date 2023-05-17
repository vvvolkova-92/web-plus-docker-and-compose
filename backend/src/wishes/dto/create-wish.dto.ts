import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from "class-validator";

export class CreateWishDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  raised: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1024)
  description?: string;
}
