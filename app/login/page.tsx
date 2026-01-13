"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { error } = await signIn.email({
            email,
            password,
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
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Sign in</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {error && (
                        <div className="text-sm text-red-500 text-center">{error}</div>
                    )}

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

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    No account?{" "}
                    <Link href="/register" className="underline hover:text-gray-900">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
