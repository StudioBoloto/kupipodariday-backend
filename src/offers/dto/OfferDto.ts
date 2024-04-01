import { IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class OfferDto {
  @IsNumber()
  id: number;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
