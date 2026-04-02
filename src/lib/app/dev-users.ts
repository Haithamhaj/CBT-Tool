import users from "../../../data/seeds/users.json";

export const devUsers = users.map((user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  level: user.level
}));

export const defaultDevUser = devUsers.find((user) => user.role === "trainee") ?? devUsers[0];
