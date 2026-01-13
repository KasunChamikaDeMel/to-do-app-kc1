import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const todos = await prisma.todo.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(todos);
    } catch (error) {
        return new NextResponse("Server Error !", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, description, status } = body;

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        const todo = await prisma.todo.create({
            data: {
                title,
                description,
                status: status || "draft",
                userId: session.user.id,
            },
        });

        return NextResponse.json(todo);
    } catch (error) {
        return new NextResponse("Server Error !", { status: 500 });
    }
}
