// Interface registerDto (DTO: Data Transfer Object) 
//

import { Timestamp } from "firebase/firestore";

export interface registerDto {
  deviceID: string,
  nombres: string;
  apellidos: string;
  correo: string;
  contraseña: string;
  dni: string;
  telefono: string;
  uid:string;
  imageProfile:string;
  birthDate: Timestamp;
}
