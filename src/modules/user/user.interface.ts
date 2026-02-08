import type { Document } from "mongoose";

export interface AuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  jwtVersion: number;
  passwordVersion: number;
  role: RolesEnum;
}

export enum RolesEnum {
  admin = "admin",
  user = "user",
  guest = "guest",
  superAdmin = "superAdmin",
}
