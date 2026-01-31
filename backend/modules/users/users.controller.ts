import { TypedRequest, TypedResponse } from "../../shared/http";
import { getStatusService, setUserOnlineService } from "./users.service";

export async function setUserOnlineController(
  req: TypedRequest<{ userId: number }>,
  res: TypedResponse<any>,
) {
  try {
    const userId = req.body.userId;
    await setUserOnlineService(userId);
    res.status(200).json({ message: "User online" });
  } catch (error) {
    console.error("Error setting user online:", error);
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
