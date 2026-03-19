import { IAddress } from '../../interfaces/address.interface';

export interface ILoginDto {
  email: string;
  password?: string; // Optional because we might use this for showing the shape or actual login
}

export interface IRegisterDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address?: IAddress;
}

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
