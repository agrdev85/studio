# CUFIRE-SPEC.md

## 1. Introducción y Objetivo del Proyecto
El sistema **CUFIRE-Tournaments** es una plataforma de torneos FPS integrada con Unity y con un frontend web en Next.js.  
Su objetivo es permitir partidas gratuitas y torneos competitivos con inscripción en **USDT (TRC20)**, gestión de clasificaciones en tiempo real y distribución automática de premios entre los ganadores.  

Este documento unifica todos los requisitos funcionales, técnicos y visuales en un único archivo para que cualquier equipo de desarrollo (humano o IA) pueda implementar la aplicación sin errores.  

---

## 2. Arquitectura General
- **Frontend**: Next.js 14 (App Router) + TailwindCSS (estilo cyberpunk basado en `visual.txt`).
- **Backend**: Node.js + Express (API REST).
- **Base de datos**: PostgreSQL (Render).
- **ORM**: Prisma (SQLite para desarrollo local, PostgreSQL en producción).
- **Autenticación**: JWT o NextAuth.js.
- **Integración Unity**: comunicación vía `UnityWebRequest` hacia endpoints definidos en `cufireUrl.json`.
- **Pagos**: USDT (TRC20), integración inicial manual.
- **Infraestructura**: Render (Node.js + PostgreSQL).

---

## 3. Stack Técnico
- **Frontend**: Next.js 14 con App Router.
- **Estilos**: TailwindCSS + Orbitron/Rajdhani (Google Fonts).
- **Backend**: Node.js + Express.
- **Base de datos**: PostgreSQL en Render.
- **ORM**: Prisma.
- **Realtime**: WebSockets opcional para Leaderboard en tiempo real.
- **Compatibilidad Unity**: JSON plano o texto separado por `;` según lógica actual.

---

## 4. Flujos de Usuario

### Registro de Usuario
1. El usuario se registra con `username`, `email`, `password`, `wallet USDT`.
2. Validaciones:
   - `username`, `email`, `wallet` únicos en el sistema.

### Participación
- **Modo Gratuito** → cualquier usuario puede subir scores globales.
- **Modo Torneo Pagado**:
  1. Paga 10 USDT a la billetera del torneo.
  2. Envía `tx_hash` de confirmación al backend.
  3. Admin verifica el pago.
  4. Jugador aparece activo en el torneo.

### Premios
- Al finalizar el torneo:
  - Se reparte el bote entre los 10 primeros: **30/18/13/9/5/5/5/5/5/5 %**.
  - Se guarda en la tabla de premios.

---

## 5. Modelo de Datos (Prisma + PostgreSQL)
```prisma
model User {
  id         Int       @id @default(autoincrement())
  username   String    @unique
  email      String    @unique
  password   String
  usdtWallet String    @unique
  isAdmin    Boolean   @default(false)
  scores     Score[]
  payments   Payment[]
  tournaments TournamentRegistration[]
}

model Tournament {
  id             Int      @id @default(autoincrement())
  name           String
  description    String?
  maxPlayers     Int?
  maxAmount      Float?
  currentAmount  Float    @default(0)
  registrationFee Float   @default(10)
  startDate      DateTime?
  endDate        DateTime?
  duration       Int?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  registrations  TournamentRegistration[]
  payments       Payment[]
  scores         Score[]
}

model TournamentRegistration {
  id           Int       @id @default(autoincrement())
  userId       Int
  tournamentId Int
  registeredAt DateTime  @default(now())

  user       User       @relation(fields: [userId], references: [id])
  tournament Tournament @relation(fields: [tournamentId], references: [id])
}

model Payment {
  id           Int       @id @default(autoincrement())
  userId       Int
  tournamentId Int
  txHash       String
  amount       Float
  isActive     Boolean   @default(false)
  createdAt    DateTime  @default(now())

  user       User       @relation(fields: [userId], references: [id])
  tournament Tournament @relation(fields: [tournamentId], references: [id])
}

model Score {
  id           Int       @id @default(autoincrement())
  userId       Int
  tournamentId Int?
  value        Int
  mode         String
  createdAt    DateTime  @default(now())

  user       User       @relation(fields: [userId], references: [id])
  tournament Tournament? @relation(fields: [tournamentId], references: [id])
}


---

6. Endpoints API

Auth

POST /api/auth/register

POST /api/auth/login


Users

GET /api/users/me

PUT /api/users/me


Tournaments

GET /api/tournaments

POST /api/tournaments (admin)

GET /api/tournaments/:id


Payments

POST /api/tournaments/:id/join

PUT /api/payments/:id/verify (admin)


Scores

POST /api/scores/submit

GET /api/scores/global

GET /api/scores/tournament/:id


Admin

POST /api/tournaments/:id/distribute



---

Endpoints de compatibilidad Unity

POST /functions/v1/tournament-api/login
Request: name, password
Response: "error" o "ok"

POST /functions/v1/tournament-api/register
Request: username, email, password, wallet
Response: "ok" o "error"

GET /functions/v1/tournament-api/scores/global
Response en formato Unity:

username:Alex|Puntos:1200;username:Maria|Puntos:1100;

POST /functions/v1/tournament-api/scores/submit
Request: name, puntos
Response: "ok"

GET /functions/v1/tournament-api/user/current-tournament
Response: datos del torneo en JSON.


⚠️ Estas rutas deben devolver exactamente lo que Unity espera parsear.


---

7. Frontend (Next.js + Tailwind)

/ → Home con héroe 3D y torneos activos.

/login, /register.

/tournaments/:id → detalle torneo, unirse con 10 USDT, leaderboard.

/dashboard (admin) → gestión de torneos, pagos y usuarios.



---

8. Estilo Visual

Fuentes: Orbitron y Rajdhani.

Neon glow (azul, púrpura, rosa).

Leaderboard con iconos oro/plata/bronce.

Animaciones hover con resplandor.

Objetos 3D flotantes en portada.



---

9. Flujo de Inscripción y Pagos

1. Usuario registrado selecciona torneo.


2. Paga 10 USDT TRC20.


3. Envía tx_hash → backend guarda Payment (isActive=false).


4. Admin valida → isActive=true, suma a currentAmount.


5. Al finalizar, se ejecuta distribución de premios.




---

10. Despliegue

Render:

Node.js + Express → backend.

PostgreSQL → Render DB.


Variables .env:

DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_SECRET="xxx"
NEXTAUTH_URL="https://tusitio.onrender.com"

Migraciones Prisma: npx prisma migrate deploy

Frontend y backend se despliegan en Render.



---

11. Mejoras Futuras

Automatizar validación de tx_hash con TronGrid.

WebSockets para scoreboard en tiempo real.

Distribución automática de premios.



---
