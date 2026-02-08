# RAS Beacon - Faro de Productividad

Una aplicación social-productiva diseñada para resolver el síndrome del "laboratorio vacío". Funciona como un faro digital, permitiendo a los miembros de la iniciativa de robótica RAS señalar cuándo y dónde están trabajando para convertir esfuerzos individuales en un movimiento colectivo.

## Características Principales

### 🔥 Encender un Beacon
- **Etiquetado de tareas**: Los usuarios no solo "trabajan", sino que especifican qué están haciendo (ej: "Depurar sistema de conducción")
- **Modos de colaboración**: 
  - **Abierto**: "Estoy trabajando, ¡ven a charlar/ayudar!"
  - **Enfoque**: "Estoy aquí por las vibras, pero estoy en modo trabajo profundo"
- **Ubicación**: Especifica exactamente dónde (ej: Estación de trabajo 4, Banco de electrónica)

### 📊 Mapa de Calor y Feed de Pulso
- **Mapa de calor de actividad**: Una línea de tiempo visual del día que brilla más durante las horas con alta asistencia proyectada
- **Feed "Quién está dentro"**: Un feed en vivo que muestra los Beacons activos actualmente
- Permite "Me gusta" o "Unirse" a una sesión, lo que envía una notificación al creador

### 🚪 Comunidad con Aprobación (Gated Community)
- **Sala de espera**: Los nuevos usuarios pueden descargar la app y registrarse, pero permanecen en estado "Pendiente"
- **Panel de administración**: Una interfaz mínima para que los líderes de RAS verifiquen y aprueben miembros

### ⚡ Motor de Sinergia
- **Emparejamiento automático**: Si dos personas del mismo sub-equipo encienden Beacons para la misma hora, la app los notifica
- **Anuncios de logros**: Cuando un Beacon termina, el usuario puede publicar un "Micro-Win" (ej: "¡Código compilado!"), que archiva la sesión en un feed público de éxitos

### 🖨️ Integración con Impresora 3D
- **Reserva de recursos**: Una pestaña dedicada para la impresora 3D
- **Regla "Quédate y Trabaja"**: Cuando alguien reserva la impresora, la app sugiere que enciendan un Beacon simultáneamente

### 📅 Calendario y Estadísticas
- **Exportación a calendario**: Los usuarios pueden agregar sus bloques de trabajo a sus propios calendarios (formato .ics)
- **Estadísticas no tóxicas**: Muestran consistencia y rachas de manera positiva

## Tecnologías

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma** (ORM)
- **PostgreSQL** (Base de datos)
- **NextAuth.js** (Autenticación)
- **Tailwind CSS** (Estilos)
- **React Hot Toast** (Notificaciones)
- **date-fns** (Manejo de fechas)

## Diseño

- **Tema**: Amarillo/Naranja/Morado/Rojo sobre fondo negro
- **Enfoque**: Mobile-first
- **Idioma**: Español

## Configuración Local

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <repo-url>
cd RAS_Beacon
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ras_beacon"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"
```

4. Configura la base de datos:
```bash
npx prisma generate
npx prisma db push
```

5. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue

### Vercel

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno en el dashboard de Vercel
3. Vercel detectará automáticamente Next.js y desplegará

### Railway

1. Crea un nuevo proyecto en Railway
2. Conecta tu repositorio de GitHub
3. Agrega un servicio PostgreSQL
4. Configura las variables de entorno:
   - `DATABASE_URL` (automáticamente proporcionado por Railway)
   - `NEXTAUTH_URL` (tu URL de Railway)
   - `NEXTAUTH_SECRET` (genera uno con `openssl rand -base64 32`)
5. Railway ejecutará automáticamente `prisma generate` y `prisma db push` durante el build

## Primer Usuario Administrador

Para crear el primer usuario administrador, puedes hacerlo directamente en la base de datos o crear un script de seed:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('tu-password', 10)
  
  await prisma.user.create({
    data: {
      email: 'admin@ras.com',
      name: 'Admin',
      password: hashedPassword,
      status: 'ADMIN',
    },
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Luego ejecuta:
```bash
npx ts-node prisma/seed.ts
```

## Estructura del Proyecto

```
RAS_Beacon/
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Panel de administración
│   ├── login/        # Página de login
│   ├── register/     # Página de registro
│   ├── waiting/      # Página de espera
│   ├── layout.tsx    # Layout principal
│   └── page.tsx      # Página principal
├── components/       # Componentes React
├── lib/             # Utilidades y configuraciones
├── prisma/          # Schema de Prisma
└── types/           # Tipos TypeScript
```

## Licencia

MIT
