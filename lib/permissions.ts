export type Action = "create" | "read" | "update" | "delete";

interface User {
    id: string;
    role: string;
}

interface Todo {
    userId: string;
    status: string;
}

export function can(action: Action, user: User, todo?: Todo) {
    const role = user.role;
    const isOwner = todo && todo.userId === user.id;

    if (action === "read") {
        if (role === "admin" || role === "manager") return true;
        return !todo || isOwner; // Can see list or own todo
    }

    if (action === "create") {
        return role === "user";
    }

    if (action === "update") {
        return role === "user" && isOwner;
    }

    if (action === "delete") {
        if (role === "admin") return true;
        return role === "user" && isOwner && todo.status === "draft";
    }

    return false;
}

