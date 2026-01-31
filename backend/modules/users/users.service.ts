import { getStatus, setUserOnline } from "./users.repository";

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
  } catch (error) {
    console.error("Error getting user status:", error);
  }
}
