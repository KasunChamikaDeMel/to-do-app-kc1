"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { error } = await signUp.email({
            email,
            password,
            name,
            // @ts-expect-error - role is a custom field we added
            role,
            fetchOptions: {
                onSuccess: () => {
                    router.push("/dashboard");
                },
            },
        });

        if (error) {
            setError(error.message ?? "error !");
        }

        setIsLoading(false);
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
            <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-sm text-gray-500">Get started</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {error && (
                        <div className="text-sm text-red-500 text-center">{error}</div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email" type="email" placeholder="user@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Account"}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline hover:text-gray-900">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
