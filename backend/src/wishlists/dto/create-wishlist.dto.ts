import { IsArray, IsString, IsUrl, Length, MaxLength } from "class-validator";

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  image?: string;

  @IsArray()
  itemsId?: number[];

  @MaxLength(1500)
  @IsString()
  description?: string;
}
