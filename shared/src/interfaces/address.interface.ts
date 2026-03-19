import { Pais, EstadoMx } from '../enums/ubicacion.enum';

export interface IAddress {
  id?: string;
  calle: string;
  numInt?: string;
  numExt: string;
  estado: EstadoMx;
  municipio: string;
  pais: Pais;
  codigoPostal: string;
}
