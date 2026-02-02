import { confirmedUser } from "../../modules/users/users.repository";
import { confirmedUserService } from "../../modules/users/users.service";

jest.mock("../../modules/users/users.repository", () => ({
  confirmedUser: jest.fn(),
}));

describe("confirmedUserService", () => {
  it("confirms user", async () => {
    (confirmedUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      numberPhone: "123456789",
      data: "123",
      role: "admin",
      confirmed: true,
    });

    const result = await confirmedUserService(1);

    expect(confirmedUser).toHaveBeenCalledWith(1);
    expect(result).toBeDefined();
    expect(result.confirmed).toBe(true);
  });

  it("throws error if user not found", async () => {
    (confirmedUser as jest.Mock).mockResolvedValue(null);

    await expect(confirmedUserService(999)).rejects.toThrow("User not found");
    expect(confirmedUser).toHaveBeenCalledWith(999);
  });
});
