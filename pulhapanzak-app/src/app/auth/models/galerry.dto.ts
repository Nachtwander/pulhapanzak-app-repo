import { Timestamp } from "firebase/firestore";

export interface galleryDto {
    active: boolean
    createdAt: Timestamp;
    createdBy: string;
    description: string;
    photo: string;
    placeName: string;
    uid:string;
  }
  