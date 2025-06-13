# 🔐 Auth API con Roles y Registro de Admins

Este proyecto es una API construida en **Node.js + TypeScript** con una arquitectura **Clean Architecture** y principios **SOLID**, centrada en autenticación, creación de administradores y gestión de roles y usuarios.

## 📁 Estructura del Proyecto

📦 src/ 
├── api/ # Capa de presentación (controladores, rutas, middlewares) 
│   ├── controllers/ # Controladores HTTP 
│   ├── middleware/ # Middlewares de validación, autenticación, manejo de errores 
│   └── routes/ # Definición de rutas (ej: auth) 
├── core/ # Dominio central de la app 
│   ├── domain/ 
│   │   ├── entities/ # Entidades de dominio (User, Admin, Role) 
│   │   └── interfaces/ # Interfaces de repositorio 
│   ├── errors/ # Manejo de errores personalizados
│   ├── services/ # Interfaces de los servicios
│   ├── use-case/ # Casos de uso independientes de frameworks o librerias (ej: SignUpAdmin)
├── infrastructure/ # Implementación concreta del dominio 
│   ├── config/ # Configuración del entorno y la app 
│   ├── emails/ # Lógica para envío de correos electrónicos 
│   ├── models/ # Modelos de base de datos 
│   ├── repositories/ # Implementación de interfaces de repositorio 
│   ├── services/ # Servicios (auth, email, etc.) 
│   └── DIContainer/ # Inyección de dependencias (DIContainer) 
├── server.ts # Inicio del servidor Express 
└── index.ts # Entrada principal



---

## 🚀 Funcionalidades Principales

- ✅ Registro de usuarios con rol de **administrador**
- 🔐 Autenticación con **JWT**
- 🔒 Hashing de contraseñas con bcrypt
- 🧪 Validación de entradas
- 📩 Envío de correos de confirmación
- ⚠️ Manejo de errores centralizado
- 🧠 Arquitectura limpia (Clean Architecture)

---
## ⚙️ Variables de entorno
# Database configuration
DATABASE_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_PORT=

# Envorionemnt variables
NODE_ENV=development
PORT=

# JWT configuration
JWT_SECRET=
JWT_EXPIRATION=

# NodeMailer configuration
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

# Frontend URL

FRONTEND_URL=

---

## 🛠️ Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/tuusuario/tu-repo.git

# 2. Instala las dependencias
cd tu-repo
npm install

# 3. Crea el archivo de entorno
cp .env

# 4. Compila y ejecuta
npm run build
npm start

# O bien, en modo desarrollo
npm run dev
