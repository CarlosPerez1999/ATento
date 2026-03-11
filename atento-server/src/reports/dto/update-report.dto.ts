import { PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ReportStatus, IUpdateReportDto } from '@atento/shared';

export class UpdateReportDto extends PartialType(CreateReportDto) implements IUpdateReportDto {
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;
}
