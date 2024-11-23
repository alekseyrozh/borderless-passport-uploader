export const extractUserFromAuthHeaders = (headers: {
  [key: string]: string | undefined;
}) => {
  const authHeader = headers['authorization'] ?? '';

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7, authHeader.length);
  } else {
    return null;
  }
};
