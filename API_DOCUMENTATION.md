# Hospital Management System API

## Role-based Access Control (RBAC) Documentation

### Current Authentication System

#### User Roles:
1. **SUPERADMIN** - Barcha imkoniyatlarga ega
2. **ADMIN** - Ko'p imkoniyatlarga ega
3. **USER** - Cheklangan imkoniyatlarga ega (bemorlar uchun)
4. **DOCTOR** - Faqat o'z appointment'larini ko'rishi mumkin

---

## Authentication Endpoints

### 1. SuperAdmin Login
```http
POST /auth/superadmin-login
Content-Type: application/json

{
  "email": "omonovaxroracc@gmail.com",
  "password": "Msaa2006"
}
```

### 2. Admin/User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
```

### 3. Admin/User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 4. Doctor Login
```http
POST /auth/doctor-login
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "doctor123"
}
```

---

## Appointments - Role-based Access

### 1. Get All Appointments (Role-based filtering)
```http
GET /appointments
Authorization: Bearer <token>
```

**Behavior by Role:**
- **SUPERADMIN/ADMIN**: Barcha appointment'larni ko'radi
- **USER**: Faqat o'z appointment'larini ko'radi (email orqali patient topiladi)
- **DOCTOR**: Faqat o'ziga tegishli appointment'larni ko'radi

### 2. Get Doctor's Own Appointments
```http
GET /appointments/doctor/my-appointments
Authorization: Bearer <token>
```
**Note**: Faqat DOCTOR role uchun mo'ljallangan

### 3. Get Single Appointment
```http
GET /appointments/:id
Authorization: Bearer <token>
```

### 4. Create Appointment
```http
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "hospital_id": "uuid",
  "doctor_id": "uuid", 
  "patient_id": "uuid",
  "appointment_date": "2024-01-15",
  "appointment_time": "10:30",
  "reason": "Regular checkup",
  "notes": "Patient complaint of headache"
}
```

### 5. Update Appointment
```http
PATCH /appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED",
  "notes": "Updated notes"
}
```

### 6. Delete Appointment
```http
DELETE /appointments/:id
Authorization: Bearer <token>
```

---

## Other Protected Endpoints

All the following endpoints require JWT token:

### Hospitals
- `GET /hospitals` - Barcha hospital'lar
- `GET /hospitals/:id` - Bitta hospital
- `POST /hospitals` - Hospital yaratish
- `PATCH /hospitals/:id` - Hospital yangilash
- `DELETE /hospitals/:id` - Hospital o'chirish

### Workers
- `GET /workers` - Barcha worker'lar
- `GET /workers/:id` - Bitta worker
- `POST /workers` - Worker yaratish
- `PATCH /workers/:id` - Worker yangilash
- `DELETE /workers/:id` - Worker o'chirish

### Patients
- `GET /patients` - Barcha patient'lar
- `GET /patients/:id` - Bitta patient
- `POST /patients` - Patient yaratish
- `PATCH /patients/:id` - Patient yangilash
- `DELETE /patients/:id` - Patient o'chirish

### Locations, Salary, Bonuses
- Barcha CRUD operatsiyalar token talab qiladi

---

## JWT Token Structure

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "ADMIN|SUPERADMIN|USER|DOCTOR",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Usage Examples

### 1. Doctor workflow:
```bash
# 1. Doctor login
curl -X POST http://localhost:3000/auth/doctor-login \
  -H "Content-Type: application/json" \
  -d '{"email": "doctor@hospital.com", "password": "doctor123"}'

# 2. Get own appointments
curl -X GET http://localhost:3000/appointments/doctor/my-appointments \
  -H "Authorization: Bearer <doctor-token>"
```

### 2. Patient workflow:
```bash
# 1. Patient register/login as USER
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "patient@email.com", "password": "password123"}'

# 2. Get own appointments (filtered by email)
curl -X GET http://localhost:3000/appointments \
  -H "Authorization: Bearer <user-token>"
```

### 3. Admin workflow:
```bash
# 1. Admin login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@hospital.com", "password": "admin123"}'

# 2. Get all appointments
curl -X GET http://localhost:3000/appointments \
  -H "Authorization: Bearer <admin-token>"
```

---

## Important Notes

1. **Email matching**: Patient'lar faqat o'z email'i bilan bog'langan appointment'larni ko'radi
2. **Doctor access**: Doctor'lar faqat o'zlariga tayinlangan appointment'larni ko'radi
3. **Admin privileges**: Admin va SuperAdmin barcha ma'lumotlarga kirish huquqiga ega
4. **Token expiry**: Tokenlar 1 kun (24 soat) amal qiladi
5. **Security**: Barcha POST, PATCH, DELETE operatsiyalar token talab qiladi
