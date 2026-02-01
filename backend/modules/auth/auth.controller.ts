import { loginService, refreshService, registerService } from "./auth.service";
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

  static async refreshTokenController(
    req: TypedRequest<{ refresh_token: string }>,
    res: TypedResponse<{
      message: string;
      access_token: string;
      refresh_token: string;
    }>,
  ) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.status(400).json({
          message: "Refresh token is required",
          access_token: "",
          refresh_token: "",
        });
      }

      const tokens = await refreshService(refresh_token);

      res.json({
        message: "Refresh token refreshed!",
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
    } catch (err: any) {
      res.status(401).json({
        message: err.message || "Invalid refresh token",
        access_token: "",
        refresh_token: "",
      });
    }
  }
}
