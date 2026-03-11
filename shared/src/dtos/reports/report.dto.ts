import { ReportCategory } from '../../enums/report-category.enum';
import { ReportStatus } from '../../enums/report-status.enum';
import { ILocation } from '../../interfaces/location.interface';

export interface ICreateReportDto {
  title: string;
  description: string;
  category: ReportCategory;
  location: ILocation;
  images?: string[];
}

export interface IUpdateReportDto {
  title?: string;
  description?: string;
  category?: ReportCategory;
  status?: ReportStatus;
  location?: ILocation;
}
