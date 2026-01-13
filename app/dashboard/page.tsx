"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useTodos } from "@/hooks/use-todos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Pencil, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, isPending: isSessionLoading } = useSession();
    const { todos, isLoading, createTodo, updateTodo, deleteTodo } = useTodos();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<any>(null); // Type 'any' for simplicity as per request, or better Todo type

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "draft",
    });

    if (isSessionLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        createTodo({
            title: formData.title,
            description: formData.description,
        });
        setIsCreateOpen(false);
        setFormData({ title: "", description: "", status: "draft" });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTodo) return;

        updateTodo({
            id: editingTodo.id,
            title: formData.title,
            description: formData.description,
            status: formData.status,
        });
        setEditingTodo(null);
        setFormData({ title: "", description: "", status: "draft" });
    };

    const openEdit = (todo: any) => {
        setEditingTodo(todo);
        setFormData({
            title: todo.title,
            description: todo.description || "",
            status: todo.status,
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this todo?")) {
            deleteTodo(id);
        }
    };

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 dark:bg-zinc-900">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white">My Todos</h1>
                        <p className="text-gray-500">Welcome back, {session.user.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Todo
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Todo</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Create Todo</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500">Loading todos...</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {todos?.map((todo) => (
                            <Card key={todo.id} className="transition-shadow hover:shadow-md">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium">
                                        {todo.title}
                                    </CardTitle>
                                    <div className={`rounded-full px-2 py-1 text-xs font-semibold ${todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            todo.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {todo.status}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 line-clamp-3">
                                        {todo.description || "No description"}
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Dialog open={!!editingTodo} onOpenChange={(open) => !open && setEditingTodo(null)}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(todo)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        {editingTodo?.id === todo.id && (
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Todo</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleUpdate} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Title</Label>
                                                        <Input
                                                            value={formData.title}
                                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={formData.description}
                                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Status</Label>
                                                        <Select
                                                            value={formData.status}
                                                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="draft">Draft</SelectItem>
                                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                                <SelectItem value="completed">Completed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button type="submit" className="w-full">Save Changes</Button>
                                                </form>
                                            </DialogContent>
                                        )}
                                    </Dialog>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(todo.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {!isLoading && todos?.length === 0 && (
                    <div className="mt-12 text-center">
                        <p className="text-gray-500">No todos found. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
