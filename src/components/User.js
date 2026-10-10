const formatUserName = (user) => {
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
};

const isValidUser = (user) => {
  return Boolean(user && user.id && user.email);
};

const createUserSnapshot = (user) => {
  return {
    id: user.id,
    name: formatUserName(user),
    role: user.role || 'guest',
    updatedAt: Date.now(),
  };
};

function User() {
  return null;
}

export default User;