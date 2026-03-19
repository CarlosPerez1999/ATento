import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IAddress, EstadoMx, Pais } from '@atento/shared';

export class CreateAddressDto implements IAddress {
  @IsString()
  @IsNotEmpty()
  calle: string;

  @IsString()
  @IsOptional()
  numInt?: string;

  @IsString()
  @IsNotEmpty()
  numExt: string;

  @IsEnum(EstadoMx)
  @IsNotEmpty()
  estado: EstadoMx;

  @IsString()
  @IsNotEmpty()
  municipio: string;

  @IsEnum(Pais)
  @IsNotEmpty()
  pais: Pais;

  @IsString()
  @IsNotEmpty()
  codigoPostal: string;
}
