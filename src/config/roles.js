const allRoles = {
  user: [],
  admin: [],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
