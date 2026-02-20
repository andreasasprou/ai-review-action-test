// Database module
const users = new Map();

function createUser(email, password) {
  const id = Math.random().toString(36).slice(2);
  const user = { id, email, password, createdAt: new Date() };
  users.set(id, user);
  return user;
}

function findUserByEmail(email) {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
}

function findUserById(id) {
  return users.get(id) || null;
}

function deleteUser(id) {
  return users.delete(id);
}

module.exports = { createUser, findUserByEmail, findUserById, deleteUser };
