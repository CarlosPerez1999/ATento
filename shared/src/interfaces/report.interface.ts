import { ReportStatus } from '../enums/report-status.enum';
import { ReportCategory } from '../enums/report-category.enum';
import { ILocation } from './location.interface';
import { IUser } from './user.interface';

export interface IReport {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  location: ILocation;
  images: string[];
  userId: string;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
}
