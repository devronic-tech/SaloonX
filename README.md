# SalonX Backend Setup

This project is a Express.js backend for the SalonX application, featuring PostgreSQL integration with Sequelize ORM.

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL installed and running locally

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the root directory (one has already been created for you) and update it with your database credentials:

```env
PORT=5000
DB_NAME=salonx
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
JWT_SECRET=your_jwt_secret_key
```

### 2. Database Initialization
This project includes a script to automatically create the `salonx` database if it doesn't already exist. Run the following command:

```bash
npm run db:setup
```

### 3. Start the Server
To start the backend server, run:

```bash
npm start
```

When the server starts, it will:
1. Ensure the `salonx` database exists.
2. Authenticate the connection.
3. **Synchronize Models**: Automatically update/create the database tables based on the Sequelize models (uses `sync({ alter: true })`).
4. Listen for requests on the specified `PORT` (default 5000).

## API Endpoints
- **Health Check**: `GET /health` - Verifies the server is running.



## Project Structure
- `config/`: Database connection settings.
- `models/`: Sequelize model definitions.
- `scripts/`: Utility scripts (e.g., database initialization).
- `server.js`: Application entry point.
