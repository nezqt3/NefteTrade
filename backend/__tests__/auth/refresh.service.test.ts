import { refreshService } from "../../modules/auth/auth.service";
import { redis } from "../../config/redis";

describe("refreshService", () => {
  it("refreshes tokens successfully", async () => {
    (redis.get as jest.Mock).mockResolvedValue(
      JSON.stringify({ userId: 1, role: "admin" }),
    );

    const result = await refreshService("refresh123");

    expect(redis.get).toHaveBeenCalledWith("refresh:refresh123");
    expect(redis.del).toHaveBeenCalledWith("refresh:refresh123");
    expect(redis.set).toHaveBeenCalled();

    expect(result.access_token).toBeDefined();
    expect(result.refresh_token).toBeDefined();
  });

  it("throws error if refresh token invalid", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);

    await expect(refreshService("bad-token")).rejects.toThrow(
      "Invalid refresh token",
    );
  });
});
