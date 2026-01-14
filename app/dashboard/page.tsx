"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { useTodos } from "@/hooks/use-todos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Pencil, LogOut, CheckCircle2, CircleDashed, Clock } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
}

interface Todo {
    id: string;
    title: string;
    description?: string;
    status: "draft" | "in_progress" | "completed";
    userId: string;
    user?: { name: string | null };
}

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const { todos, isLoading, createTodo, updateTodo, deleteTodo } = useTodos();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [form, setForm] = useState({ title: "", description: "", status: "draft" });

    if (isPending) return <div className="flex h-screen items-center justify-center text-zinc-400">Loading...</div>;
    if (!session) { router.push("/login"); return null }

    const user = { ...session.user, role: (session.user as { role?: string }).role || "user" } as User;

    const saveTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTodo) {
            updateTodo({ id: editingTodo.id, ...form });
            setEditingTodo(null);
        } else {
            createTodo(form);
            setIsCreateOpen(false);
        }
        setForm({ title: "", description: "", status: "draft" });
    };

    const startEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setForm({ title: todo.title, description: todo.description || "", status: todo.status });
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 pb-20">
            <header className="mx-auto max-w-5xl flex items-center justify-between py-6">
                <div className="flex items-center gap-3">
                    <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 rounded font-bold">TF</div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Workspace</h1>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-400">{user.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <span>{user.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => authClient.signOut().then(() => router.push("/login"))}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl mt-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">My Tasks</h2>
                    {user.role === "user" && (
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-full px-6 bg-zinc-900 dark:bg-white text-white dark:text-black">
                                    <PlusCircle className="mr-2 h-4 w-4" /> New Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
                                <form onSubmit={saveTodo} className="space-y-4 pt-4">
                                    <Input placeholder="Task Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                                    <Textarea placeholder="Details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                                    <Button type="submit" className="w-full">Create</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todos?.map((todo: Todo) => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                user={user}
                                onEdit={() => startEdit(todo)}
                                onDelete={() => confirm("Delete this task?") && deleteTodo(todo.id)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Edit Dialog */}
            <Dialog open={!!editingTodo} onOpenChange={(open) => !open && setEditingTodo(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
                    <form onSubmit={saveTodo} className="space-y-4 pt-4">
                        <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function TodoCard({ todo, user, onEdit, onDelete }: { todo: Todo; user: User; onEdit: () => void; onDelete: () => void }) {
    const isOwner = todo.userId === user.id;
    const canDelete = user.role === "admin" || (isOwner && todo.status === "draft");

    const statusIcons: Record<string, React.ReactNode> = {
        completed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
        in_progress: <Clock className="h-4 w-4 text-amber-500" />,
        draft: <CircleDashed className="h-4 w-4 text-zinc-400" />
    };

    return (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold truncate pr-2">{todo.title}</CardTitle>
                <div className="flex-shrink-0">{statusIcons[todo.status]}</div>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-zinc-500 line-clamp-2 h-8">{todo.description || "N/A"}</p>
                {(user.role !== "user") && (
                    <p className="text-[9px] font-bold text-zinc-400 mt-2 uppercase">By: {todo.user?.name}</p>
                )}
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800">
                    {user.role === "user" && isOwner && (
                        <Button variant="ghost" size="icon" onClick={onEdit} className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                    )}
                    {canDelete && (
                        <Button variant="ghost" size="icon" onClick={onDelete} className="h-7 w-7 text-red-500 hover:text-red-600"><Trash2 className="h-3 w-3" /></Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


