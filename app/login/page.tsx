"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, KeyRound, Loader2, CheckCircle2 } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { data, error: err } = await signIn.email({ email, password });
        if (err) {
            setError(err.message || "Login failed");
            setLoading(false);
        } else if (data) {
            router.push("/dashboard");
        }
    };

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
                <p className="text-zinc-500 mt-2">Access your task workspace</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {registered && !error && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium dark:bg-emerald-500/10 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Account created! Please sign in.
                    </div>
                )}
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs text-center dark:bg-red-500/10 dark:text-red-400">{error}</div>}

                <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                        <Input className="pl-10" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                        <Input className="pl-10" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                </div>

                <Button className="w-full h-11 bg-zinc-900 dark:bg-white text-white dark:text-black" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                </Button>
            </form>

            <p className="text-center text-sm text-zinc-500">
                New here? <Link href="/register" className="font-bold text-black dark:text-white">Create account</Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
            <Suspense fallback={<Loader2 className="animate-spin text-zinc-400" />}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
