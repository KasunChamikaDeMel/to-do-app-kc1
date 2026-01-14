import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/permissions";

async function getContext(params: Promise<{ id: string }>) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { user: null };

    const user = { ...session.user, role: (session.user as { role?: string }).role || "user" };
    const { id } = await params;
    const todo = await prisma.todo.findUnique({ where: { id } });

    return { user, id, todo };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { user, id, todo } = await getContext(params);
    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    if (!todo) return new NextResponse("Not Found", { status: 404 });

    if (!can("update", user, todo)) return new NextResponse("Forbidden", { status: 403 });

    const data = await req.json();
    const updated = await prisma.todo.update({ where: { id }, data });

    return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { user, id, todo } = await getContext(params);
    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    if (!todo) return new NextResponse("Not Found", { status: 404 });

    if (!can("delete", user, todo)) return new NextResponse("Forbidden", { status: 403 });

    await prisma.todo.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
}

