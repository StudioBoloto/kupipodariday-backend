import { IsString, IsUrl, IsArray, IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
