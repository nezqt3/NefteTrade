export const redisMocks = jest.mock("../../config/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    quit: jest.fn(),
  },
}));

export const revokeRefreshToken = jest.fn();
