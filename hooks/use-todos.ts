import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTodos() {
    const qc = useQueryClient();
    const refresh = () => qc.invalidateQueries({ queryKey: ["todos"] });

    const { data: todos, isLoading } = useQuery({
        queryKey: ["todos"],
        queryFn: () => fetch("/api/todos").then(res => res.json())
    });

    const create = useMutation({
        mutationFn: (data: any) => fetch("/api/todos", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        }),
        onSuccess: refresh
    });

    const update = useMutation({
        mutationFn: (data: any) => fetch(`/api/todos/${data.id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        }),
        onSuccess: refresh
    });

    const remove = useMutation({
        mutationFn: (id: string) => fetch(`/api/todos/${id}`, { method: "DELETE" }),
        onSuccess: refresh
    });

    return { todos, isLoading, createTodo: create.mutate, updateTodo: update.mutate, deleteTodo: remove.mutate };
}

