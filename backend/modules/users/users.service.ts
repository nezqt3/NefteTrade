import { confirmedUser, getStatus, setUserOnline } from "./users.repository";
import { User } from "./users.types";

export async function setUserOnlineService(userId: number) {
  try {
    await setUserOnline(userId);
  } catch (error) {
    console.error("Error setting user online:", error);
  }
}

export async function getStatusService(userId: number) {
  try {
    const lastOnline = await getStatus(userId);
    if (!lastOnline) {
      throw new Error("User not found");
    }

    return lastOnline;
  } catch (error) {
    console.error("Error getting user status:", error);
  }
}

export async function confirmedUserService(userId: number): Promise<User> {
  const confirmed = await confirmedUser(userId);

  if (!confirmed) {
    throw new Error("User not found");
  }

  return confirmed;
}
