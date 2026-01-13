import { Todo } from "@/lib/prisma-client/client";

interface UserLike {
    id: string;
    role: string;
}

export type Action = "create" | "read" | "update" | "delete";
export type Resource = "todo";

export function can(action: Action, resource: Resource, user: UserLike, data?: Todo) {
    if (user.role === "admin") {
        return true;
    }

    if (resource === "todo") {
        if (action === "create") return true;

        if (data) {
            // Users and Managers can only manage their own todos
            return data.userId === user.id;
        }
    }

    return false;
}
