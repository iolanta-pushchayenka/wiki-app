export function canEditResource(ownerId, user) {
    return ownerId === user.userId || user.role === "admin";
}