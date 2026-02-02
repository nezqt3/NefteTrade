import { setUserOnline } from "../../modules/users/users.repository";
import { setUserOnlineService } from "../../modules/users/users.service";

jest.mock("../../modules/users/users.repository", () => ({
  setUserOnline: jest.fn(),
}));

describe("getStatusService", () => {
  it("should return the last online time for a user", async () => {
    (setUserOnline as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      numberPhone: "123456789",
      data: "123",
      role: "admin",
      confirmed: true,
      last_online: new Date(),
    });

    const result = await setUserOnlineService(1);
    expect(result).toBeDefined();
    expect(result.last_online).toBeDefined();
    expect(result.last_online).not.toBeNull();
  });

  it("should throw an error if user not found", async () => {
    (setUserOnline as jest.Mock).mockResolvedValue(null); // мок вернул null

    await expect(setUserOnlineService(999)).rejects.toThrow("User not found");

    expect(setUserOnline).toHaveBeenCalledWith(999);
  });

  it("should throw an error if repository throws", async () => {
    (setUserOnline as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(setUserOnlineService(1)).rejects.toThrow("DB error");
    expect(setUserOnline).toHaveBeenCalledWith(1);
  });
});
