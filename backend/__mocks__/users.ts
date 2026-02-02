export const getUserMock = jest.mock(
  "../../modules/users/users.repository",
  () => ({
    getUser: jest.fn(),
  }),
);
