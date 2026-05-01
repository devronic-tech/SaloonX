# 💇‍♂️ SalonX Backend - Setup Guide

This is the Express.js backend for the SalonX application. It uses **PostgreSQL** with **Sequelize ORM**, **Cloudinary** for image storage, and **Nodemailer** for email notifications (OTP).

---

## 🚀 Quick Start

### 1. Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v13 or higher)
- [Git](https://git-scm.com/)

---

## 🐘 1. PostgreSQL Setup

### **Windows Installation**
1. Download the installer from [PostgreSQL.org](https://www.postgresql.org/download/windows/).
2. Run the `.exe` file. During installation:
   - Set a password for the `postgres` user (e.g., `1234`). **Remember this!**
   - Keep the default port `5432`.
3. After installation, open **pgAdmin 4** (installed with PostgreSQL) or use the command line (`psql`).
4. You don't need to manually create the database; our setup script will handle that for you.

### **Database Initialization Script**
We provide a script to automatically create the required database.
```bash
npm run db:setup
```
*Note: This script uses the credentials provided in your `.env` file to connect to the `postgres` default database and create `salonx` if it's missing.*

---

## ⚙️ 2. Backend Configuration

### **Step 1: Install Dependencies**
Navigate to the `SalonX Backend` directory and run:
```bash
npm install
```

### **Step 2: Environment Variables**
Create a `.env` file in the root directory and fill in the following details:

```env
# Server Port
PORT=5000

# PostgreSQL Configuration
DB_NAME=salonx
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# Remote Database (Optional - Fallback mechanism is active)
# DB_URL=your_remote_db_url_here

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Image Storage)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Email Service (Nodemailer - Gmail Recommended)
EMAIL=your_email@gmail.com
PASSWORD=your_app_password  # Use a Google App Password, NOT your regular password
```

---

## 🏗️ 3. Running the Server

### **Development Mode**
To start the server with auto-sync enabled:
```bash
npm start
```

**When the server starts, it will:**
1. Check for the database connection (Remote first, then Local fallback).
2. Create the `salonx` database if it doesn't exist locally.
3. **Sync Models**: Automatically create/update tables in the database based on the code in `/models` (using `alter: true`).

---

## 🧪 4. Seeding Test Data (Optional)
If you want to populate your database with dummy salons and services for testing:
1. Ensure the server is configured and database is connected.
2. Run the seed script:
```bash
node scripts/seedData.js
```
*This will create 10 test salons and multiple services for each.*

---

## 🛠️ Project Structure
- `config/`: Database connection and instance logic.
- `controllers/`: Business logic for API endpoints.
- `middleware/`: Auth verification and Cloudinary/Multer upload logic.
- `models/`: Database schemas (User, Owner, Service, Salon, etc.).
- `routes/`: Express route definitions.
- `scripts/`: Initialization and Seeding scripts.
- `utils/`: Reusable helpers like `sendMail.js`.
- `server.js`: Entry point of the application.

---

## ❓ Troubleshooting
- **Database Connection Error**: Ensure PostgreSQL service is running on your machine.
- **Port 5000 Busy**: If another process is using port 5000, change the `PORT` in `.env`.
- **Cloudinary Upload Error**: Check your `CLOUD_NAME`, `API_KEY`, and `API_SECRET` in `.env`.
- **Email Not Sending**: Ensure you are using a **Google App Password** if you use Gmail.
