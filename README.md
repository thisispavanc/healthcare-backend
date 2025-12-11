# PAA Healthcare Management System

A comprehensive healthcare management application with Express.js backend and React.js frontend, designed for Patient Administration and Analytics (PAA).

## 🏗️ Architecture

- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js query builder
- **Authentication**: JWT with access and refresh tokens
- **Security**: bcrypt password hashing, helmet, CORS, rate limiting
- **Validation**: Joi schemas
- **Logging**: Winston with structured logging
- **Error Handling**: Centralized error middleware
- **Audit Logging**: Comprehensive activity tracking

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── migrations/      # Database migrations
├── models/         # Database models
├── routes/         # API routes
├── seeds/          # Database seeds
├── services/       # Business logic
├── validation/     # Input validation schemas
├── app.js         # Express app setup
└── server.js      # Server startup
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and update the database configuration:

```bash
cp .env.example .env
```

Update your `.env` file with your PostgreSQL connection details:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=paa_healthcare
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
```

### 3. Database Setup

Run migrations to create the database schema:

```bash
npm run migrate
```

Seed the database with default users:

```bash
npm run seed
```

### 4. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🔐 Default User Accounts

The seed script creates these default accounts:

| Username | Password | Role | Email |
|----------|----------|------|--------|
| admin | Admin123! | admin | admin@paa.com |
| doctor | Clinician123! | clinician | doctor@paa.com |
| nurse | Clinician123! | clinician | nurse@paa.com |
| viewer | ReadOnly123! | read-only | viewer@paa.com |

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/refresh` | Refresh token | Public |
| POST | `/auth/logout` | User logout | Private |
| POST | `/auth/register` | Register user | Admin |
| GET | `/auth/profile` | Get user profile | Private |

### Patient Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/patients` | List patients | All roles |
| GET | `/patients/:id` | Get patient | All roles |
| GET | `/patients/:id/details` | Get patient with details | All roles |
| POST | `/patients` | Create patient | Clinician+ |
| PUT | `/patients/:id` | Update patient | Clinician+ |
| DELETE | `/patients/:id` | Delete patient | Admin |

### Other Entity Endpoints

All patient-related entities follow similar patterns:
- `/addresses`, `/contacts`, `/insurances`
- `/visits`, `/observations`
- `/allergies`, `/medications`

### Audit Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/audit` | List audit logs | Admin |
| GET | `/audit/record/:table/:id` | Get record audit logs | Clinician+ |
| GET | `/audit/user/:username` | Get user audit logs | Admin |

## 🔒 Security Features

- **JWT Authentication**: Access and refresh token system
- **Role-based Access Control**: Admin, Clinician, Read-only roles
- **Password Security**: bcrypt with 12 salt rounds
- **Rate Limiting**: Configurable request throttling
- **CORS Protection**: Cross-origin request handling
- **Helmet Security**: Security headers
- **Input Validation**: Comprehensive Joi schemas
- **SQL Injection Protection**: Parameterized queries via Knex

## 📝 Logging & Monitoring

- **Winston Logger**: Structured JSON logging
- **Request Logging**: HTTP request/response tracking
- **Error Logging**: Comprehensive error capture
- **Audit Logging**: All CRUD operations tracked

## 🗄️ Database Schema

The system manages these core entities:
- **Patients**: Core patient demographics
- **Addresses**: Patient addresses (multiple types)
- **Contacts**: Emergency and family contacts
- **Insurances**: Insurance policies and coverage
- **Visits**: Medical encounters and appointments
- **Observations**: Clinical measurements and findings
- **Allergies**: Known allergic reactions
- **Medications**: Current and historical medications
- **Users**: System users and authentication
- **Audit Logs**: Complete activity tracking

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run migrate     # Run database migrations
npm run migrate:rollback  # Rollback last migration
npm run seed        # Run database seeds
npm test           # Run tests
npm run lint       # Check code style
```

### Adding New Migrations

```bash
npm run migrate:make create_new_table
```

### Adding New Seeds

```bash
npm run seed:make new_seed_name
```

## 🚨 Error Handling

The application includes comprehensive error handling:
- Validation errors return detailed field-level feedback
- Database constraint violations are handled gracefully
- JWT token errors provide appropriate HTTP status codes
- All errors are logged with full context

## 📊 Pagination

List endpoints support pagination:

```
GET /api/patients?page=1&limit=20&search=john
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | Required |
| DB_USER | Database user | Required |
| DB_PASSWORD | Database password | Required |
| JWT_SECRET | JWT signing secret | Required |
| JWT_REFRESH_SECRET | Refresh token secret | Required |
| JWT_EXPIRE | Access token expiry | 15m |
| JWT_REFRESH_EXPIRE | Refresh token expiry | 7d |

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add appropriate validation for new endpoints
3. Include error handling and logging
4. Update documentation for API changes
5. Add audit logging for data modifications

## 📄 License

Private - PAA Healthcare System