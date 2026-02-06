export const getUserMock = jest.mock(
  "../../modules/users/users.repository",
  () => ({
    getUserForAuth: jest.fn(),
  }),
);
