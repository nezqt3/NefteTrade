import { Role } from "../../shared/constants";
import { User } from "../users/users.types";

export interface AuthRequest {
  email: string;
  password: string;
  login: string;
  numberPhone: string;
  data: string;
  role: Role;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface JwtPayload {
  userId: number;
  role: Role;
}
