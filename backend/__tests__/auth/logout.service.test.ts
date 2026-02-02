import { logoutService } from "../../modules/auth/auth.service";
import { revokeRefreshToken } from "../../redis/cache";

jest.mock("../../redis/cache", () => ({
  revokeRefreshToken: jest.fn(),
}));

describe("logoutService", () => {
  it("logs out user", async () => {
    (revokeRefreshToken as jest.Mock).mockResolvedValue(undefined);

    const result = await logoutService({
      refreshToken: "refresh_token",
    } as any);

    expect(revokeRefreshToken).toHaveBeenCalled();
    expect(result.message).toBe("Logged out successfully");
  });
});
