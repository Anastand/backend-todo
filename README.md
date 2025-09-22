# Backend Todo App with Prisma

A simple backend API for a todo application that uses Prisma ORM with a database to perform CRUD (Create, Read, Update, Delete) operations on todo items. Built with Node.js and Express.js.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Prisma](#prisma)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features
- Create new todo items
- Read all todo items
- Update existing todo items
- Delete todo items
- Prisma ORM for database operations
- Type-safe database queries
- Database migrations
- RESTful API design

## Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **Prisma ORM** - Next-generation Node.js and TypeScript ORM
- **PostgreSQL** - Relational database (configurable)
- **REST API** - Standard HTTP methods

## Prerequisites
Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Prisma CLI](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred database)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anastand/backend-todo.git
   cd backend-todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Prisma Client**
   ```bash
   npx prisma generate
   ```

## Configuration

### Environment Variables
Create a `.env` file in the root directory and add your configuration:

```env
# Database configuration
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app?schema=public"

# Server configuration
PORT=3000
NODE_ENV=development

# Optional: JWT secret for authentication (if implemented)
JWT_SECRET=your_jwt_secret_here
```

### Database Setup
1. **Install and start PostgreSQL** on your local machine or use a cloud database service.

2. **Create a database** named `todo_app` (or update the `DATABASE_URL` to match your database name).

3. **Update DATABASE_URL** in your `.env` file with your PostgreSQL connection details.

## Running the Application

### Database Setup
Before running the application, set up your database:

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database (optional)
npx prisma db seed
```

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| `GET`  | `/api/todos`          | Get all todo items             |
| `GET`  | `/api/todos/:id`      | Get a specific todo by ID      |
| `POST` | `/api/todos`          | Create a new todo item         |
| `PUT`  | `/api/todos/:id`      | Update a todo item             |
| `DELETE` | `/api/todos/:id`    | Delete a todo item             |

### Request/Response Examples

#### Create Todo (POST `/api/todos`)
**Request Body:**
```json
{
  "title": "Learn Prisma",
  "description": "Complete the backend todo app with Prisma ORM",
  "completed": false
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Learn Prisma",
  "description": "Complete the backend todo app with Prisma ORM",
  "completed": false,
  "createdAt": "2025-09-22T10:00:00.000Z",
  "updatedAt": "2025-09-22T10:00:00.000Z"
}
```

#### Get All Todos (GET `/api/todos`)
**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Learn Prisma",
    "description": "Complete the backend todo app with Prisma ORM",
    "completed": false,
    "createdAt": "2025-09-22T10:00:00.000Z",
    "updatedAt": "2025-09-22T10:00:00.000Z"
  }
]
```

#### Error Response
```json
{
  "error": "Todo not found",
  "status": 404
}
```

## Database

This application uses PostgreSQL with Prisma ORM for data persistence.

### Prisma Schema
The database schema is defined in `prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("todos")
}
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database (development only)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Studio (Database GUI)
npx prisma studio
```

## Prisma

### Prisma Client Usage
The Prisma Client is generated and used throughout the application for type-safe database operations.

**Example usage in a controller:**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllTodos(req, res) {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Database Seeding
To seed the database with sample data, create a seed script in `prisma/seed.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const todos = [
    { title: 'Sample Todo 1', description: 'This is a sample todo' },
    { title: 'Sample Todo 2', completed: true },
  ];

  for (const todo of todos) {
    await prisma.todo.create({
      data: todo,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

## Testing

To run tests:
```bash
npm test
```

Available test scripts:
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests

**Note:** Tests use an in-memory SQLite database for faster execution.

## Project Structure
```
backend-todo/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Database seeding
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
├── tests/                # Test files
├── .env.example          # Environment variables template
├── .gitignore
└── package.json
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows these guidelines:
- Write clear commit messages
- Add tests for new features
- Update Prisma schema and run migrations for database changes
- Keep the code DRY and well-documented
- Follow existing code style

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please open an issue on GitHub or contact me at:
- **GitHub**: [@Anastand](https://github.com/Anastand)

---

*Built with ❤️ using Prisma for modern database workflows*
