import { loginService, registerService } from "./auth.service";
import { TypedRequest, TypedResponse } from "../../shared/http";
import { AuthRequest, AuthResponse } from "./auth.types";

export class AuthController {
  static async authController(
    req: TypedRequest<AuthRequest>,
    res: TypedResponse<AuthResponse>,
  ) {
    const result = await loginService(req.body);
    res.json(result);
  }

  static async registerController(
    req: TypedRequest<AuthRequest>,
    res: TypedResponse<AuthResponse>,
  ) {
    const result = await registerService(req.body);
    res.json(result);
  }
}
