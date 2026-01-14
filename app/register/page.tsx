"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, KeyRound, Shield, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // @ts-expect-error - autoLogin is a valid option but might not be in basic types
        const { data, error: err } = await signUp.email({ ...form, autoLogin: false });

        if (err) {
            console.error(err);
            setError(err.message || "Something went wrong");
            setLoading(false);
        } else if (data) {
            router.push("/login?registered=true");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
            <div className="w-full max-w-sm space-y-8 text-center sm:text-left">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                    <p className="text-zinc-500 mt-2 text-sm">Join TaskFlow to manage your work.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs text-center">{error}</div>}

                    <div className="space-y-2 text-left">
                        <Label>Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input className="pl-10" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <Label>Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input className="pl-10" type="email" placeholder="name@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <Label>Password</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input className="pl-10" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <Label>Role</Label>
                        <Select value={form.role} onValueChange={val => setForm({ ...form, role: val })}>
                            <SelectTrigger className="pl-10 relative">
                                <Shield className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="w-full h-11 bg-zinc-900 dark:bg-white text-white dark:text-black mt-2" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                    </Button>
                </form>

                <p className="text-center text-sm text-zinc-500">
                    Already have an account? <Link href="/login" className="font-bold text-black dark:text-white">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
