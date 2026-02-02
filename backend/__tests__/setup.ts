process.env.JWT_ACCESS_SECRET = "test-access-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";

jest.mock("../config/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock("../modules/users/users.repository", () => ({
  getUser: jest.fn(),
  createUser: jest.fn(),
}));

beforeAll(async () => {
  // можно подключиться к test БД
});

afterEach(() => {
  jest.clearAllMocks();
});
