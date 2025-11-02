This is a [Next.js](https://nextjs.org) project with [Mantine UI](https://mantine.dev/) components and [Prisma](https://www.prisma.io/) database integration.

## Features

- ⚡️ Next.js 16 with App Router
- 🎨 Mantine UI components library
- 🗄️ Prisma ORM with SQLite database
- 📝 Full CRUD operations for posts
- 🔔 Toast notifications
- 💅 Modern, responsive UI

## Getting Started

First, install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Push the database schema:

```bash
npx prisma db push
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

This project uses Prisma with SQLite. The database file is located at `prisma/dev.db`.

To view your database:

```bash
npx prisma studio
```

This will open Prisma Studio in your browser where you can view and edit your data.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `lib/` - Utility files including Prisma client
- `prisma/` - Prisma schema and database files
- `app/api/posts/` - API routes for post CRUD operations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
