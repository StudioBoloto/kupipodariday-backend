import {
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsDateString,
} from 'class-validator';

export class WishDto {
  @IsNumber()
  id: number;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsNumber()
  raised: number;

  @IsNumber()
  copied: number;

  @IsString()
  @MaxLength(1024)
  description: string;
}
