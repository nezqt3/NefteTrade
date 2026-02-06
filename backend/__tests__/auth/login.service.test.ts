import { loginService } from "../../modules/auth/auth.service";
import { getUserForAuth } from "../../modules/users/users.repository";
import { redis } from "../../config/redis";
import * as hash from "../../utils/hash";
import { comparePasswords } from "../../utils/hash";

jest.spyOn(hash, "comparePasswords");

describe("loginService", () => {
  it("logs in user", async () => {
    (getUserForAuth as jest.Mock).mockResolvedValue({
      id: 1,
      login: "admin",
      email: "admin@test.com",
      numberPhone: "123",
      data: "data",
      role: "admin",
      last_online: new Date().toISOString(),
      confirmed: true,
      hash_password: "hashed",
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

  it("throws error if user not found", async () => {
    (getUserForAuth as jest.Mock).mockResolvedValue(null);

    await expect(
      loginService({
        login: "nonexistent",
        password: "123",
      } as any),
    ).rejects.toThrow("User not found");
  });

  it("throws error if password is invalid", async () => {
    (getUserForAuth as jest.Mock).mockResolvedValue({
      id: 1,
      login: "admin",
      email: "admin@test.com",
      numberPhone: "123",
      data: "data",
      role: "admin",
      last_online: new Date().toISOString(),
      confirmed: true,
      hash_password: "hashed",
    });

    (comparePasswords as jest.Mock).mockResolvedValue(false);

    await expect(
      loginService({
        login: "admin",
        password: "wrongpassword",
      } as any),
    ).rejects.toThrow("Invalid password");
  });

  it("throws error if getUser throws", async () => {
    (getUserForAuth as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(
      loginService({
        login: "admin",
        password: "123",
      } as any),
    ).rejects.toThrow("DB error");
  });

  it("throws error if comparePasswords throws", async () => {
    (getUserForAuth as jest.Mock).mockResolvedValue({
      id: 1,
      login: "admin",
      email: "admin@test.com",
      numberPhone: "123",
      data: "data",
      role: "admin",
      last_online: new Date().toISOString(),
      confirmed: true,
      hash_password: "hashed",
    });

    (comparePasswords as jest.Mock).mockRejectedValue(new Error("Hash error"));

    await expect(
      loginService({
        login: "admin",
        password: "123",
      } as any),
    ).rejects.toThrow("Hash error");
  });

  it("throws error if redis.set fails", async () => {
    (getUserForAuth as jest.Mock).mockResolvedValue({
      id: 1,
      login: "admin",
      email: "admin@test.com",
      numberPhone: "123",
      data: "data",
      role: "admin",
      last_online: new Date().toISOString(),
      confirmed: true,
      hash_password: "hashed",
    });

    (comparePasswords as jest.Mock).mockResolvedValue(true);

    (redis.set as jest.Mock).mockImplementation(() => {
      throw new Error("Redis error");
    });

    await expect(
      loginService({
        login: "admin",
        password: "123",
      } as any),
    ).rejects.toThrow("Redis error");
  });
});
