import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { title, description, status } = body;

        // Verify ownership
        const existingTodo = await prisma.todo.findUnique({
            where: { id },
        });

        if (!existingTodo) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (existingTodo.userId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: {
                title,
                description,
                status,
            },
        });

        return NextResponse.json(updatedTodo);
    } catch (error) {
        return new NextResponse("Server Error !", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const existingTodo = await prisma.todo.findUnique({
            where: { id },
        });

        if (!existingTodo) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (existingTodo.userId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await prisma.todo.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Server Error !", { status: 500 });
    }
}
