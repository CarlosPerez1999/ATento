import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ILoginDto } from '@atento/shared';

export class LoginDto implements ILoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
