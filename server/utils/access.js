export function memberRole(project, userId) {
  if (String(project.owner) === String(userId)) return "Admin";
  const member = project.members.find(m => String(m.user?._id || m.user) === String(userId));
  return member?.role || null;
}
export function canEdit(role) { return ["Admin","Manager","Developer"].includes(role); }
