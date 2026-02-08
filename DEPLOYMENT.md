# Guía de Despliegue - RAS Beacon

Esta guía te ayudará a desplegar RAS Beacon en Railway o Vercel.

## Despliegue en Vercel

### Paso 1: Preparar el Repositorio
1. Asegúrate de que tu código esté en GitHub, GitLab o Bitbucket
2. Verifica que el archivo `vercel.json` esté en la raíz del proyecto

### Paso 2: Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio
4. Vercel detectará automáticamente Next.js

### Paso 3: Configurar Variables de Entorno
En la configuración del proyecto, agrega estas variables:

```
DATABASE_URL=tu-connection-string-de-postgresql
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=genera-un-secret-aleatorio
```

**Para generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Paso 4: Configurar Base de Datos
1. Vercel ofrece integración con Vercel Postgres
2. O puedes usar una base de datos externa (Supabase, Neon, etc.)
3. Copia la connection string a `DATABASE_URL`

### Paso 5: Desplegar
1. Vercel ejecutará automáticamente `prisma generate` y `prisma db push` durante el build
2. Una vez desplegado, ejecuta el seed para crear el usuario admin:
   - Conecta a tu base de datos y ejecuta el seed manualmente, o
   - Usa Vercel CLI: `vercel env pull` y luego `npm run seed`

## Despliegue en Railway

### Paso 1: Preparar el Repositorio
1. Asegúrate de que tu código esté en GitHub
2. Verifica que el archivo `railway.json` esté en la raíz del proyecto

### Paso 2: Crear Proyecto en Railway
1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Elige tu repositorio

### Paso 3: Agregar Base de Datos PostgreSQL
1. En tu proyecto de Railway, haz clic en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente una base de datos y la variable `DATABASE_URL`

### Paso 4: Configurar Variables de Entorno
En la pestaña "Variables" del servicio web, agrega:

```
NEXTAUTH_URL=https://tu-proyecto.railway.app
NEXTAUTH_SECRET=genera-un-secret-aleatorio
```

**Para generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Paso 5: Configurar Build
Railway detectará automáticamente Next.js y ejecutará:
- `prisma generate`
- `prisma db push` (si está configurado)
- `next build`

### Paso 6: Ejecutar Migraciones y Seed
1. Una vez desplegado, abre el terminal de Railway
2. Ejecuta: `npx prisma db push`
3. Ejecuta: `npm run seed` (para crear el usuario admin)

## Crear Usuario Administrador

Después del despliegue, necesitas crear el primer usuario administrador:

### Opción 1: Usar el Script de Seed
```bash
npm run seed
```

Esto creará un usuario admin con:
- Email: `admin@ras.com`
- Password: `admin123`

**¡IMPORTANTE!** Cambia la contraseña después del primer inicio de sesión.

### Opción 2: Manualmente en la Base de Datos
1. Conecta a tu base de datos PostgreSQL
2. Ejecuta:

```sql
-- Primero, hashea la contraseña (usa bcrypt)
-- Luego inserta:
INSERT INTO "User" (id, email, name, password, status, "createdAt", "updatedAt")
VALUES (
  'clx...', -- genera un ID único
  'admin@ras.com',
  'Administrador',
  '$2a$10$...', -- contraseña hasheada con bcrypt
  'ADMIN',
  NOW(),
  NOW()
);
```

## Verificación Post-Despliegue

1. **Verifica que la app esté funcionando:**
   - Visita tu URL de despliegue
   - Deberías ver la página de login

2. **Crea el usuario admin:**
   - Ejecuta el seed o crea manualmente

3. **Inicia sesión como admin:**
   - Ve a `/admin` para aprobar usuarios

4. **Prueba el flujo completo:**
   - Registra un nuevo usuario
   - Aprueba desde el panel de admin
   - Inicia sesión y crea un beacon

## Troubleshooting

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos esté accesible desde internet
- En Railway, verifica que el servicio de DB esté en el mismo proyecto

### Error: "NextAuth secret not set"
- Asegúrate de que `NEXTAUTH_SECRET` esté configurada
- Debe ser una cadena aleatoria de al menos 32 caracteres

### Error: "Schema validation failed"
```bash
npx prisma db push
```

## Monitoreo

### Vercel
- Ve a la pestaña "Logs" en el dashboard de Vercel
- Revisa los logs de build y runtime

### Railway
- Ve a la pestaña "Deployments" para ver los logs
- Usa "View Logs" en el servicio web

## Actualizaciones Futuras

Para actualizar la aplicación:
1. Haz push de tus cambios a GitHub
2. Vercel/Railway detectará automáticamente los cambios
3. Se ejecutará un nuevo build y despliegue
4. Si hay cambios en el schema de Prisma, ejecuta `npx prisma db push` después del despliegue
