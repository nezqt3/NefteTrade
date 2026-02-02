import { hashPassword } from "../../utils/hash";
import { registerService } from "../../modules/auth/auth.service";
import { createUser } from "../../modules/users/users.repository";

jest.mock("../../utils/hash", () => ({
  hashPassword: jest.fn(),
}));

jest.mock("../../modules/users/users.repository", () => ({
  createUser: jest.fn(),
}));

describe("registerService", () => {
  it("registers a new user", async () => {
    (createUser as jest.Mock).mockResolvedValue({
      id: "user_id",
      email: "test@example.com",
      numberPhone: "123456789",
      data: "123",
      role: "admin",
    });

    (hashPassword as jest.Mock).mockResolvedValue("hashed_password");

    const result = await registerService({
      email: "test@example.com",
      password: "password",
      numberPhone: "123456789",
      login: "test",
      data: "123",
      role: "admin",
    } as any);

    expect(hashPassword).toHaveBeenCalledWith("password");
    expect(result.refresh_token).toBeDefined();
    expect(result.access_token).toBeDefined();
    expect(result.user).toBeDefined();
  });

  it("throws error if user creation failed", async () => {
    (hashPassword as jest.Mock).mockResolvedValue("hashed_password");
    (createUser as jest.Mock).mockResolvedValue(null);

    await expect(
      registerService({
        email: "test@example.com",
        password: "password",
        numberPhone: "123456789",
        login: "test",
        data: "123",
        role: "admin",
      } as any),
    ).rejects.toThrow("Failed to create user");
  });

  it("throws error if password hashing failed", async () => {
    (hashPassword as jest.Mock).mockRejectedValue(new Error("Hash failed"));

    await expect(
      registerService({
        email: "test@example.com",
        password: "password",
        numberPhone: "123456789",
        login: "test",
        data: "123",
        role: "admin",
      } as any),
    ).rejects.toThrow("Hash failed");

    expect(createUser).not.toHaveBeenCalled();
  });

  it("throws error if createUser throws", async () => {
    (hashPassword as jest.Mock).mockResolvedValue("hashed_password");
    (createUser as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(
      registerService({
        email: "test@example.com",
        password: "password",
        numberPhone: "123456789",
        login: "test",
        data: "123",
        role: "admin",
      } as any),
    ).rejects.toThrow("DB error");
  });
});
