import {
  IsString,
  IsOptional,
  IsUrl,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(64)
  username?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  password?: string;
}
