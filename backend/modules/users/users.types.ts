import { Role } from "shared/constants";

export interface User {
  id: number;
  email: string;
  login: string;
  numberPhone: string;
  data: string;
  role: Role;
  last_online: string;
}
