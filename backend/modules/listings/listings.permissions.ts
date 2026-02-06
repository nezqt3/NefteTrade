import { Request, Response, NextFunction } from "express";

export function requireRole(role: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
}

export function requireAnyRole(roles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
}
