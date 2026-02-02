import { getStatus } from "../../modules/users/users.repository";
import { getStatusService } from "../../modules/users/users.service";

jest.mock("../../modules/users/users.repository", () => ({
  getStatus: jest.fn(),
}));

describe("getStatusService", () => {
  it("should return the last online time for a user", async () => {
    (getStatus as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      numberPhone: "123456789",
      data: "123",
      role: "admin",
      confirmed: true,
    });

    const result = await getStatusService(1);
    expect(result).toBeDefined();
    expect(result.last_online).not.toBeNull();
  });

  it("should throw an error if user not found", async () => {
    (getStatus as jest.Mock).mockResolvedValue(null);

    await expect(getStatusService(999)).rejects.toThrow("User not found");
    expect(getStatus).toHaveBeenCalledWith(999);
  });

  it("should throw an error if repository throws", async () => {
    (getStatus as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(getStatusService(1)).rejects.toThrow("DB error");
    expect(getStatus).toHaveBeenCalledWith(1);
  });
});
