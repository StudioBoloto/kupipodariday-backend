import {
  IsNumber,
  IsString,
  IsUrl,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class UserProfileResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}
