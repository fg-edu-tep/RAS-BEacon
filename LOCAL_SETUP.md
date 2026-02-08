# Guía de Configuración Local - RAS Beacon

Sigue estos pasos para probar la aplicación localmente.

## Prerrequisitos

1. **Node.js 18+** - [Descargar](https://nodejs.org/)
2. **PostgreSQL** - Opciones:
   - [PostgreSQL local](https://www.postgresql.org/download/)
   - [Docker con PostgreSQL](https://hub.docker.com/_/postgres)
   - [Supabase](https://supabase.com) (gratis, en la nube)
   - [Neon](https://neon.tech) (gratis, en la nube)

## Paso 1: Instalar Dependencias

```bash
npm install
```

## Paso 2: Configurar Base de Datos

### Opción A: PostgreSQL Local

1. Instala PostgreSQL en tu máquina
2. Crea una base de datos:
```sql
CREATE DATABASE ras_beacon;
```

3. Tu `DATABASE_URL` será:
```
postgresql://usuario:contraseña@localhost:5432/ras_beacon
```

### Opción B: Docker (Más fácil)

1. Ejecuta PostgreSQL en Docker:
```bash
docker run --name ras-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ras_beacon -p 5432:5432 -d postgres
```

2. Tu `DATABASE_URL` será:
```
postgresql://postgres:postgres@localhost:5432/ras_beacon
```

### Opción C: Base de Datos en la Nube (Sin instalación local)

1. Crea una cuenta en [Supabase](https://supabase.com) o [Neon](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string que te proporcionan

## Paso 3: Crear Archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/ras_beacon"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui-genera-uno-aleatorio"
```

**Para generar NEXTAUTH_SECRET:**
- En Windows PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

- En Linux/Mac:
```bash
openssl rand -base64 32
```

O simplemente usa cualquier cadena aleatoria larga.

## Paso 4: Configurar Base de Datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma db push
```

## Paso 5: Crear Usuario Administrador

```bash
npm run seed
```

Esto creará un usuario admin con:
- **Email:** `admin@ras.com`
- **Password:** `admin123`

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión.

## Paso 6: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## Probar la Aplicación

1. **Inicia sesión como admin:**
   - Ve a http://localhost:3000/login
   - Email: `admin@ras.com`
   - Password: `admin123`

2. **Prueba el panel de administración:**
   - Ve a http://localhost:3000/admin
   - Aquí puedes aprobar usuarios pendientes

3. **Registra un nuevo usuario:**
   - Ve a http://localhost:3000/register
   - Completa el formulario
   - El usuario quedará en estado "Pendiente"

4. **Aprueba el usuario:**
   - Ve a `/admin` como admin
   - Haz clic en el botón de aprobar

5. **Inicia sesión con el nuevo usuario:**
   - Ve a `/login`
   - Inicia sesión con las credenciales del nuevo usuario

6. **Crea un Beacon:**
   - Haz clic en la pestaña "Encender"
   - Completa el formulario
   - ¡Tu beacon aparecerá en el feed!

## Comandos Útiles

```bash
# Ver la base de datos en el navegador (Prisma Studio)
npm run db:studio

# Reiniciar la base de datos (cuidado: borra todos los datos)
npx prisma db push --force-reset

# Ver los logs de Prisma
npx prisma --help
```

## Troubleshooting

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica que la `DATABASE_URL` sea correcta
- Si usas Docker, verifica que el contenedor esté corriendo: `docker ps`

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Port 3000 already in use"
- Cambia el puerto: `npm run dev -- -p 3001`
- O mata el proceso que usa el puerto 3000

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error al ejecutar seed
Si `npm run seed` no funciona, ejecuta directamente:
```bash
npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
```

## Estructura de Prueba Recomendada

1. **Crea 2-3 usuarios de prueba** con diferentes sub-equipos
2. **Aprueba todos los usuarios** desde el panel de admin
3. **Crea varios beacons** con diferentes horarios y modos
4. **Prueba las funciones sociales:** likes, joins
5. **Completa un beacon** y agrega un micro-win
6. **Reserva la impresora 3D**
7. **Revisa las estadísticas**

## Siguiente Paso: Desplegar

Una vez que pruebes localmente y todo funcione, puedes desplegar en:
- **Vercel** (recomendado para Next.js)
- **Railway** (fácil setup con PostgreSQL incluido)

Consulta `DEPLOYMENT.md` para más detalles.
