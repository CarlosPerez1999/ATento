import { IsString, IsNotEmpty, IsEnum, IsObject, IsArray, IsOptional, IsLatitude, IsLongitude, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ICreateReportDto, ReportCategory, ILocation, VALIDATION } from '@atento/shared';

class LocationDto implements ILocation {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsString()
  @IsOptional()
  address?: string;
}

export class CreateReportDto implements ICreateReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ReportCategory)
  category: ReportCategory;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
