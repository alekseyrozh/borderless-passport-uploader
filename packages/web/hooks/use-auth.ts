// dummy auth

const USER_ID = 'demo-user';

export const useAuth = () => {
  return { userId: USER_ID, getToken: async () => USER_ID };
};
