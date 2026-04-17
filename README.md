# 💳 RevoBank API - Milestone 4

A secure, scalable, and modular banking API built for **RevoBank**. This backend service allows customers to manage their bank accounts, securely transfer funds, and view transaction histories, while providing administrators with oversight capabilities.

---

## 🚀 Live Demo & Documentation

- 🔗 Live API URL:  
  https://revobank-api-yourname.onrender.com  

- 📄 API Documentation (Swagger):  
  https://revobank-api-yourname.onrender.com/api/docs  

> ⚠️ Replace the URLs above with your actual deployed links.

---

## 🛠️ Technologies Used

- **Framework:** NestJS  
- **ORM:** Prisma  
- **Database:** PostgreSQL (Supabase)  
- **Authentication:** Passport.js with JWT  
- **Validation:** class-validator & class-transformer  
- **Testing:** Jest (Unit & E2E)  
- **Deployment:** Render (API) & Supabase (Database)

---

## ✨ Features Implemented

### 🔐 User Authentication & Security
- Secure registration & login
- Password hashing using bcrypt
- JWT-based authentication system

### 🛡️ Role-Based Access Control
- Guards to restrict access per user
- Ensures users only access their own data

### 🏦 Account Management (CRUD)
- Create, read, update, delete bank accounts
- Fully RESTful endpoints

### 💸 Secure Transactions
- Deposit & withdrawal functionality
- Balance validation and constraints

### 🔄 Atomic Transfers
- Inter-account transfers using Prisma `$transaction`
- Prevents inconsistent financial states (ACID compliance)

### 📘 Interactive API Docs
- Swagger UI integration via `@nestjs/swagger`

---

## 💻 How to Run the Project Locally

### 1. Clone Repository

```bash
git clone https://github.com/Revou-FSSE-Oct25/milestone-4-bagussam.git
cd revobank-api
```

### 2. Install Dependencies

Make sure Node.js is installed:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database connection string
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/revobank?schema=public"

# JWT Secret for authentication
JWT_SECRET="revobank-super-secret-key-2026-production"
```

### 4. Database Setup (Prisma)

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Application

```bash
# development
npm run start

# watch mode
npm run start:dev
```

- App runs on: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api/docs`

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e
```

---

## 📂 Project Structure (Optional Enhancement)

```
src/
├── auth/
├── users/
├── accounts/
├── transactions/
├── common/
└── prisma/
```

---

## 📝 Author

**Bagus Samudro Aji Luhur**

---

## 📌 Notes

- Ensure your PostgreSQL database is running before starting the app
- Never expose your `.env` file in public repositories
- Use strong JWT secrets in production

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!