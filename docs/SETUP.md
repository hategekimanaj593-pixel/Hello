# Development Setup Guide

## Healthcare Management System - Environment Setup

This guide provides step-by-step instructions to set up the development environment for the Healthcare Management System.

## Prerequisites

### Required Software
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** or any code editor - [Download](https://code.visualstudio.com/)

### Recommended Software
- **Postman** - API testing - [Download](https://www.postman.com/)
- **MySQL Workbench** - Database management
- **Git GUI** - Git operations helper
- **Flutter SDK** - For mobile development

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 5GB free space
- **OS**: Windows, macOS, or Linux

---

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/hategekimanaj593-pixel/Hello.git
cd Hello
```

### Step 2: Setup Frontend (React.js)

#### 2.1 Navigate to frontend directory
```bash
cd frontend
```

#### 2.2 Install dependencies
```bash
npm install
```

#### 2.3 Create .env file
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

#### 2.4 Start development server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

---

### Step 3: Setup Backend (Node.js/Express)

#### 3.1 Navigate to backend directory
```bash
cd backend
```

#### 3.2 Install dependencies
```bash
npm install
```

#### 3.3 Create environment variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthcare_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRATION=24h

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password

# SMS Configuration (Optional)
SMS_API_KEY=your_sms_api_key
SMS_API_URL=https://sms-api.example.com

# Voice API Configuration (Optional)
VOICE_API_KEY=your_voice_api_key
VOICE_API_URL=https://voice-api.example.com

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### 3.3 Create directory structure
```bash
mkdir -p src/routes src/controllers src/models src/middleware src/services src/utils logs
```

#### 3.4 Start backend server
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000/api/v1`

---

### Step 4: Setup Database (MySQL)

#### 4.1 Create database
```bash
mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE healthcare_system;
USE healthcare_system;
```

#### 4.2 Import database schema
Exit MySQL and run:
```bash
mysql -u root -p healthcare_system < database/schema.sql
```

#### 4.3 Verify database
```bash
mysql -u root -p healthcare_system
```

```sql
SHOW TABLES;
```

You should see all the tables listed.

---

### Step 5: Setup Mobile (Flutter) - Optional

#### 5.1 Install Flutter SDK
- Download from [flutter.dev](https://flutter.dev/docs/get-started/install)
- Follow platform-specific installation instructions
- Verify installation:

```bash
flutter --version
```

#### 5.2 Navigate to mobile directory
```bash
cd mobile
```

#### 5.3 Get dependencies
```bash
flutter pub get
```

#### 5.4 Run on emulator/device
```bash
# List available devices
flutter devices

# Run on specific device
flutter run -d device_id
```

---

## Project Structure Setup

Create the following project structure:

```bash
# From project root
mkdir -p frontend/src/{components,pages,services,utils,styles}
mkdir -p backend/src/{routes,controllers,models,middleware,services,utils}
mkdir -p backend/config
mkdir -p backend/logs
mkdir -p mobile/lib/{screens,widgets,services,models,utils}
mkdir -p database
mkdir -p docs
```

---

## Environment Configuration

### Frontend Environment Variables

**File**: `frontend/.env`

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
REACT_APP_DEBUG=true

# Feature Flags
REACT_APP_ENABLE_VOICE=true
REACT_APP_ENABLE_SMS=true
REACT_APP_ENABLE_MOBILE=true

# App Configuration
REACT_APP_APP_NAME="Healthcare Management System"
REACT_APP_LOGO_URL=/images/logo.png
```

### Backend Environment Variables

**File**: `backend/.env`

(See Step 3.3 above for complete .env configuration)

### Database Configuration

**File**: `backend/config/database.js`

```javascript
module.exports = {
  development: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  production: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
  }
};
```

---

## Database Schema

### Key Tables

#### Users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Patients
```sql
CREATE TABLE patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  blood_type VARCHAR(5),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Appointments
```sql
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  department VARCHAR(100),
  status VARCHAR(20) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);
```

---

## Running the Application

### Development Mode

**Terminal 1 - Start Frontend:**
```bash
cd frontend
npm start
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- MySQL: localhost:3306

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend (Production):**
```bash
cd backend
npm run start
```

---

## Testing the Setup

### 1. Test Database Connection
```bash
# In backend directory
npm run test:db
```

### 2. Test API Endpoints
Use Postman or curl:

```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "doctor"
  }'
```

### 3. Test Frontend
- Open http://localhost:3000 in browser
- Should see login page
- Try registering a test account

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### MySQL Connection Error
```bash
# Verify MySQL is running
# macOS
brew services list

# Windows
# Check Services.msc for MySQL

# Restart MySQL
mysql.server restart  # macOS
# Or restart service in Windows Services
```

### NPM Module Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Schema Issues
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE healthcare_system;
CREATE DATABASE healthcare_system;
USE healthcare_system;
source database/schema.sql;
```

---

## IDE Setup

### VS Code Extensions

Recommended extensions for development:

```
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- MySQL
- Thunder Client (API testing)
- GitLens
- REST Client
```

### VS Code Settings

**File**: `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.autoFixOnSave": true,
  "files.exclude": {
    "node_modules": true,
    ".git": true
  }
}
```

---

## Development Commands

### Frontend Commands
```bash
npm start          # Start dev server
npm run build      # Build for production
npm run test       # Run tests
npm run eject      # Eject from Create React App (irreversible)
```

### Backend Commands
```bash
npm run dev        # Start with nodemon
npm start          # Start production server
npm run test       # Run tests
npm run migrate    # Run database migrations
npm run seed       # Seed database with sample data
```

---

## Git Workflow

### Initial Setup
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Creating a Feature Branch
```bash
git checkout -b feature/feature-name
```

### Committing Changes
```bash
git add .
git commit -m "Description of changes"
git push origin feature/feature-name
```

### Creating Pull Request
1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Add description and submit

---

## Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Authentication](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

## Support

For setup issues or questions:
1. Check this documentation
2. Review error messages carefully
3. Search existing GitHub issues
4. Create a new issue with detailed information

---

**Version**: 1.0
**Last Updated**: June 2026
**Status**: Complete
