import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../validators/match.decorator.js';

export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'password is too short',
  })
  @MaxLength(20, {
    message: 'password is too long',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'passwords do not match' })
  confirmPassword: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'name is too short',
  })
  @MaxLength(20, {
    message: 'name is too long',
  })
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bggUsername?: string;
}
