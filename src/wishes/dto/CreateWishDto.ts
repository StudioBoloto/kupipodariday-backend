import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsString()
  description: string;
}
