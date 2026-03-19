import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IRegisterDto, VALIDATION } from '@atento/shared';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserDto implements IRegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(VALIDATION.PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`,
  })
  @Matches(VALIDATION.PASSWORD_REGEX, {
    message: 'Password is too weak (must include uppercase, lowercase, numbers and special characters)',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;
}
