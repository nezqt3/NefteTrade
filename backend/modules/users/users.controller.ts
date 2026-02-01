import { sendUserConfirmedEmail } from "@modules/notifications/notifications.mail";
import { TypedRequest, TypedResponse } from "../../shared/http";
import {
  confirmedUserService,
  getStatusService,
  setUserOnlineService,
} from "./users.service";

export async function setUserOnlineController(
  req: TypedRequest<{ userId: number }>,
  res: TypedResponse<any>,
) {
  try {
    const userId = req.user!.userId;
    await setUserOnlineService(userId);
    res.status(200).json({ message: "User online" });
  } catch (error) {
    console.error("Error setting user online:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getStatusController(
  req: TypedRequest<{}>,
  res: TypedResponse<any>,
) {
  try {
    const userIdStr = req.query.userId;

    if (!userIdStr || Array.isArray(userIdStr)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const userId = Number(userIdStr);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const status = await getStatusService(userId);
    res.status(200).json({ status });
  } catch (error) {
    console.error("Error getting user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function confirmedUserController(
  req: TypedRequest<{ userId: number }>,
  res: TypedResponse<any>,
) {
  try {
    const userId = req.user!.userId;

    if (!userId) {
      return res.status(403).json({ message: "userId is required" });
    }

    const user = await confirmedUserService(userId);

    process.nextTick(() => {
      sendUserConfirmedEmail({ ...user, confirmed: true }).catch((err) => {
        console.error("CONFIRM EMAIL ERROR:", err);
      });
    });

    res.status(200).json({ message: "User confirmed" });
  } catch (error) {
    console.error("Error confirming user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
