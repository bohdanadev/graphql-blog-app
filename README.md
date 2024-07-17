# Graphql-Blog-App

Graphql-Blog-App is a small full-stack blog application built using Node.js, GraphQL, Apollo Server, PostgreSQL, Prisma, React, Apollo Client, and React-Bootstrap.

## Project Structure

- **Server**: Developed using Node.js, GraphQL, Apollo Server, PostgreSQL, and Prisma.
- **Client**: Developed using React, Apollo Client, and React-Bootstrap.

## Features

- User signup and signin
- User profile view
- Create, read, update, and delete posts
- Query and mutate data through GraphQL API

## Prerequisites

- Node.js
- Docker
- PostgreSQL
- Prisma

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bohdanadev/graphql-blog-app.git

cd graphql-blog-app
```

### 2. Install dependencies

In both the **server** and the **client** directories, install dependencies

```bash
npm install

```

### 3. Setup Environment Variables

Create `.env` files in both the **server** and **client** directories and provide the application's necessary variables using `.env.example` files

### 4. Setup keys

Create `keys.ts` file in the **server/src** directory

```keys.ts
export const JSON_SIGNATURE = 'yourjwtsecret';
export const SALT = 10;

```

### 5. Setup the Database

Navigate to the **server** directory and start the database using Docker Compose.

```bash
cd server
docker-compose up -d
```

### 6. Initialize the Database

To initialize the database with Prisma, run:

```bash
npx prisma db push
```

You can also start Prisma Studio to interact with your database:

```bash
npx prisma studio
```

### 7. Start the Server

```bash
npm run start
```

The server will be running at http://localhost:4000.

### 8. Start the Client

In the **client** directory, start the React app:

```bash
cd client
npm start
```

The client will be running at http://localhost:3000.

## Usage

You can test queries and mutations using the client:

### API Endpoints

http://localhost:3000/signup

http://localhost:3000/signin

http://localhost:3000/profile/:id

http://localhost:3000/posts (default)
