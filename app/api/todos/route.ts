import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/permissions";

async function getSessionUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    return { ...session.user, role: (session.user as any).role || "user" };
}

export async function GET() {
    const user = await getSessionUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!can("read", user)) return new NextResponse("Forbidden", { status: 403 });

    const todos = await prisma.todo.findMany({
        where: user.role === "user" ? { userId: user.id } : {},
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } }
    });

    return NextResponse.json(todos);
}

export async function POST(req: Request) {
    const user = await getSessionUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!can("create", user)) return new NextResponse("Forbidden", { status: 403 });

    const { title, description } = await req.json();
    if (!title) return new NextResponse("Title is required", { status: 400 });

    const todo = await prisma.todo.create({
        data: { title, description, userId: user.id }
    });

    return NextResponse.json(todo);
}

