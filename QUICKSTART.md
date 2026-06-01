# Healthcare Management System - Getting Started Guide

## Quick Start (5 minutes)

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/hategekimanaj593-pixel/Hello.git
cd Hello

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
CREATE DATABASE healthcare_system;
EXIT;

# Import schema
mysql -u root -p healthcare_system < database/schema.sql
```

### Step 3: Configure Environment Variables

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
HOST=localhost

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthcare_system

JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRATION=24h

FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENVIRONMENT=development
```

### Step 4: Run the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
# App running on http://localhost:3000
```

### Step 5: Test the Application

1. **Open browser**: http://localhost:3000
2. **Login with test credentials**:
   - Email: `test@example.com`
   - Password: `password123`

Or create a new account by registering.

---

## Project Structure Overview

```
Hello/
├── backend/          # Node.js/Express API
├── frontend/         # React.js web application
├── mobile/          # Flutter app (optional)
├── database/        # MySQL schemas
└── docs/            # Documentation
```

---

## Available API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout

### Patients
- `GET /api/v1/patients` - List all patients
- `POST /api/v1/patients` - Register new patient
- `GET /api/v1/patients/:patientId` - Get patient details
- `PUT /api/v1/patients/:patientId` - Update patient
- `DELETE /api/v1/patients/:patientId` - Deactivate patient

### Appointments
- `GET /api/v1/appointments` - List appointments
- `POST /api/v1/appointments` - Book appointment
- `PUT /api/v1/appointments/:appointmentId` - Update appointment
- `DELETE /api/v1/appointments/:appointmentId` - Cancel appointment

### Queue Management
- `GET /api/v1/queue/status` - Get queue status
- `POST /api/v1/queue/ticket` - Generate queue ticket
- `PUT /api/v1/queue/:ticketId` - Update ticket status
- `GET /api/v1/queue/analytics` - Get analytics

### Feedback
- `GET /api/v1/feedback` - List feedback
- `POST /api/v1/feedback` - Submit feedback
- `PUT /api/v1/feedback/:feedbackId` - Respond to feedback
- `GET /api/v1/feedback/analytics` - Get feedback analytics

### Dashboard
- `GET /api/v1/dashboard/statistics` - Get statistics
- `GET /api/v1/dashboard/realtime` - Get real-time data

---

## Default User Roles

The system includes 5 roles with different permissions:

1. **Admin** - Full system access
2. **Doctor** - Patient consultations and records
3. **Nurse** - Patient care and vital signs
4. **Receptionist** - Patient registration and appointments
5. **Auditor** - Service quality monitoring

---

## Testing with Postman

1. **Import API**: See `docs/API.md` for full endpoint documentation
2. **Set Bearer Token**: 
   - Login to get token
   - Add to request header: `Authorization: Bearer <token>`

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Connection Error
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists: `SHOW DATABASES;`

### npm install fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. **Create Test Accounts**: Register users with different roles
2. **Explore Features**: Test patient registration, appointments, queue
3. **Review Documentation**: See `/docs` folder for detailed guides
4. **Customize**: Modify as per your specific requirements

---

## Support & Documentation

- **Architecture**: `docs/ARCHITECTURE.md`
- **API Reference**: `docs/API.md`
- **User Roles**: `docs/USER_ROLES.md`
- **Setup Guide**: `docs/SETUP.md`

---

## Development Tips

### Hot Reload
- Frontend: Changes auto-reload (Create React App)
- Backend: Use `npm run dev` with nodemon for auto-restart

### Database Changes
- Modify schema in `database/schema.sql`
- Reimport: `mysql -u root -p healthcare_system < database/schema.sql`

### API Testing
- Use Postman or Thunder Client (VS Code)
- Save requests for reuse
- Test with different user roles

---

**Your Healthcare Management System is ready to develop!** 🚀

For more details, see the comprehensive documentation in the `/docs` folder.
