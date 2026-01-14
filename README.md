# TaskFlow

A modern, role-based task management application built with **Next.js 15**, **PostgreSQL**, **Prisma**, and **TailwindCSS**.

## Features

- **Role-Based Access Control (RBAC)**: secure permissions for Users, Managers, and Admins.
- **Task Management**: Create, edit, delete, and track tasks.
- **Modern UI**: Clean, responsive interface built with TailwindCSS and Shadcn/UI for a premium feel.
- **Secure Authentication**: Robust user authentication and session management.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (via Prisma ORM)
- **Styling**: TailwindCSS
- **State Management**: TanStack Query
- **Testing**: Playwright

## Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment**:
   Create a `.env` file with your database connection string and secrets.
4. **Run Migrations**:
   ```bash
   npx prisma db push
   ```
5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## License

MIT
