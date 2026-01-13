import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Manage work with <span className="text-zinc-500">TaskFlow.</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-lg">
          A minimalist task manager with built-in role permissions.
          Simple, fast, and secure by design.
        </p>

        <div className="mt-10 flex gap-4">
          <Link href="/register">
            <Button size="lg" className="rounded-full px-8 bg-zinc-900 border-none">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="rounded-full px-8">Sign In</Button>
          </Link>
        </div>
      </main>

      <footer className="p-8 text-center text-zinc-400 text-sm border-t border-zinc-200 dark:border-zinc-900">
        &copy; 2026 TaskFlow. All rights reserved.
      </footer>
    </div>
  );
}


