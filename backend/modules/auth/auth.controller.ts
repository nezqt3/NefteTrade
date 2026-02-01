import { loginService, registerService } from "./auth.service";
import { TypedRequest, TypedResponse } from "../../shared/http";
import { AuthRequest, AuthResponse } from "./auth.types";
import { sendEmailToAdmins } from "@modules/notifications/notifications.mail";

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
    const user = await registerService(req.body);

    process.nextTick(() => {
      sendEmailToAdmins(user.user).catch((err) => {
        console.error("ADMIN EMAIL ERROR", err);
      });
    });

    res.json(user);
  }
}
