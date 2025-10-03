# Backend for Ticket System with AI Agent

This is the backend for a Ticket System with an AI Agent, built with Node.js, Express, and TypeScript.

## Features

- User authentication with JWT.
- CRUD operations for tickets.
- AI-powered ticket analysis and assignment.
- Email notifications for new ticket assignments.
- Role-based access control (user, admin, moderator).

## API Endpoints

### Authentication (`/api/auth`)

- `POST /signup`: Creates a new user.
- `POST /login`: Logs in a user and returns a JWT token.
- `POST /logout`: Logs out a user.
- `POST /get-user`: Retrieves a user's information (admin only).
- `POST /update-user`: Updates a user's information (admin only).

### Tickets (`/api/ticket`)

- `GET /`: Retrieves all tickets (for admins) or tickets created by the current user.
- `GET /:id`: Retrieves a specific ticket.
- `POST /`: Creates a new ticket.

## AI Agent

The AI agent is triggered when a new ticket is created. It performs the following tasks:

1.  **Analyzes the ticket:** The agent uses an AI model to analyze the ticket's title and description to determine the summary, helpful notes, priority, and related skills.
2.  **Assigns the ticket:** The agent assigns the ticket to a moderator with the skills that match the `relatedSkills` identified by the AI. If no moderator with matching skills is found, it assigns the ticket to an admin.
3.  **Sends an email notification:** The agent sends an email to the assigned moderator to notify them of the new ticket.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Avaneesh-Chopdekar/ticket-ai-agent-backend
    ```
2.  Navigate to the backend directory:
    ```bash
    cd ticket-ai-agent-backend
    ```
3.  Install the dependencies using pnpm:
    ```bash
    pnpm install
    ```
4.  Create a `.env` file in the `ticket-ai-agent-backend` directory and add the following environment variables:
    ```
    MONGO_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-jwt-secret>
    ```

## Usage

### Development

To run the server in development mode with automatic reloading, use:

```bash
pnpm run dev
```

To run the Inngest development server, use:

```bash
pnpm run inngest-dev
```

### Production

To build the TypeScript code, use:

```bash
pnpm run tsc
```

To start the server in production, use:

```bash
pnpm run start
```

## Scripts

- `tsc`: Compiles the TypeScript code to JavaScript.
- `start`: Starts the production server.
- `dev`: Starts the development server with nodemon.
- `inngest-dev`: Starts the Inngest development server.

## Dependencies

- [@inngest/agent-kit](https://www.inngest.com/): Inngest agent kit for creating AI agents.
- [bcrypt](https://www.npmjs.com/package/bcrypt): A library for hashing passwords.
- [cors](https://www.npmjs.com/package/cors): A package for enabling CORS.
- [dotenv](https://www.npmjs.com/package/dotenv): A zero-dependency module that loads environment variables from a `.env` file.
- [express](https://expressjs.com/): A fast, unopinionated, minimalist web framework for Node.js.
- [inngest](https://www.inngest.com/): A platform for building reliable background jobs, queues, and event-driven systems.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): An implementation of JSON Web Tokens.
- [mongoose](https://mongoosejs.com/): A MongoDB object modeling tool designed to work in an asynchronous environment.
- [nodemailer](https://nodemailer.com/): A module for Node.js applications to allow easy as cake email sending.

## Dev Dependencies

- [@types/bcrypt](https://www.npmjs.com/package/@types/bcrypt): Type definitions for bcrypt.
- [@types/cors](https://www.npmjs.com/package/@types/cors): Type definitions for cors.
- [@types/express](https://www.npmjs.com/package/@types/express): Type definitions for express.
- [@types/jsonwebtoken](https://www.npmjs.com/package/@types/jsonwebtoken): Type definitions for jsonwebtoken.
- [@types/node](https://www.npmjs.com/package/@types/node): Type definitions for Node.js.
- [@types/nodemailer](https://www.npmjs.com/package/@types/nodemailer): Type definitions for nodemailer.
- [nodemon](https://www.npmjs.com/package/nodemon): A tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- [typescript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
