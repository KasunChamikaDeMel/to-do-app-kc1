import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "@/lib/prisma-client/client";

async function fetchTodos() {
    const res = await fetch("/api/todos");
    if (!res.ok) throw new Error("Failed to fetch todos");
    return res.json() as Promise<Todo[]>;
}

async function createTodo(data: { title: string; description?: string }) {
    const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    return res.json() as Promise<Todo>;
}

async function updateTodo(data: { id: string; title?: string; description?: string; status?: string }) {
    const res = await fetch(`/api/todos/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json() as Promise<Todo>;
}

async function deleteTodo(id: string) {
    const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
}

export function useTodos() {
    const queryClient = useQueryClient();

    const todos = useQuery({
        queryKey: ["todos"],
        queryFn: fetchTodos,
    });

    const create = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const update = useMutation({
        mutationFn: updateTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const remove = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    return {
        todos: todos.data,
        isLoading: todos.isLoading,
        error: todos.error,
        createTodo: create.mutate,
        updateTodo: update.mutate,
        deleteTodo: remove.mutate,
    };
}
