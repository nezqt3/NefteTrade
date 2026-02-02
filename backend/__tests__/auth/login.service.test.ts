import { loginService } from "../../modules/auth/auth.service";
import { getUser } from "../../modules/users/users.repository";
import { redis } from "../../config/redis";
import * as hash from "../../utils/hash";

jest.spyOn(hash, "comparePasswords");

describe("loginService", () => {
  it("logs in user", async () => {
    (getUser as jest.Mock).mockResolvedValue({
      id: 1,
      login: "admin",
      password: "hashed",
    });

    (hash.comparePasswords as jest.Mock).mockResolvedValue(true);

    const result = await loginService({
      login: "admin",
      password: "123",
    } as any);

    expect(result.access_token).toBeDefined();
    expect(result.refresh_token).toBeDefined();
    expect(redis.set).toHaveBeenCalled();
  });
});
