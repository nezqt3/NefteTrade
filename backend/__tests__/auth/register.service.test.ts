import { hashPassword } from "../../utils/hash";
import { registerService } from "../../modules/auth/auth.service";
import { createUser } from "../../modules/users/users.repository";

jest.mock("../../utils/hash", () => ({
  hashPassword: jest.fn(),
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
});
