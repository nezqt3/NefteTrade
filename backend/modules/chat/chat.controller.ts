import { TypedRequest, TypedResponse } from "../../shared/http";
import { getChatsByUser } from "./chat.repository";

export async function getMyChatsController(
  req: TypedRequest<any>,
  res: TypedResponse<any>,
) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const chats = await getChatsByUser(userId);
  res.json(chats);
}
