import { UserRole } from '../enums/user-role.enum';
import { IAddress } from './address.interface';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  address?: IAddress;
  createdAt: Date;
  updatedAt: Date;
}
