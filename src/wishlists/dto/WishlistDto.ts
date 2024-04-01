import {
  IsNumber,
  IsString,
  IsUrl,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WishDto } from '../../wishes/dto/WishDto';

export class WishlistDto {
  @IsNumber()
  id: number;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @ValidateNested({ each: true })
  @Type(() => WishDto)
  items: WishDto[];
}
