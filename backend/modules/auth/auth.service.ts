import { createUser, getUserForAuth } from "../users/users.repository";
import { AuthRequest, AuthResponse } from "./auth.types";
import { generateAccessToken } from "../../utils/jwt";
import { comparePasswords, hashPassword } from "../../utils/hash";
import {
  revokeRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
} from "../../redis/cache";
import { generateSecretOfRefreshToken } from "../../utils/jwt";

export async function loginService(data: AuthRequest): Promise<AuthResponse> {
  const user = await getUserForAuth(data.login);

  if (!user) {
    throw new Error("User not found");
  }

  if (!(await comparePasswords(data.password, user.hash_password))) {
    throw new Error("Invalid password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshTokenId = generateSecretOfRefreshToken();

  await saveRefreshToken(refreshTokenId, user.id, user.role);

  return {
    access_token: accessToken,
    refresh_token: refreshTokenId,
    user: {
      id: user.id,
      email: user.email,
      login: user.login,
      numberPhone: user.numberPhone,
      data: user.data,
      role: user.role,
      last_online: user.last_online,
      confirmed: user.confirmed,
    },
  };
}

export async function registerService(
  data: AuthRequest,
): Promise<AuthResponse> {
  const hashPasswordOfUser = await hashPassword(data.password);

  const result = await createUser(
    data.email,
    hashPasswordOfUser,
    data.login,
    data.numberPhone,
    data.data,
    data.role,
  );

  if (!result) {
    throw new Error("Failed to create user");
  }

  const accessToken = generateAccessToken({
    userId: result.id,
    role: data.role,
  });
  const refreshTokenId = generateSecretOfRefreshToken();

  await saveRefreshToken(refreshTokenId, result.id, data.role);

  const response = {
    access_token: accessToken,
    refresh_token: refreshTokenId,
    user: result,
  };

  return response;
}

export async function logoutService(refreshToken: string) {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  await revokeRefreshToken(refreshToken);

  return { message: "Logged out successfully" };
}

export async function refreshService(refreshTokenId: string) {
  const data = await verifyRefreshToken(refreshTokenId);
  await revokeRefreshToken(refreshTokenId);

  const { userId, role } = data;

  const newAccessToken = generateAccessToken({ userId, role });
  const newRefreshToken = generateSecretOfRefreshToken();

  await saveRefreshToken(newRefreshToken, userId, role);

  return {
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
  };
}
