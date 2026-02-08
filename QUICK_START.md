# 🚀 Inicio Rápido - RAS Beacon

## Pasos Rápidos para Probar Localmente

### 1. Configurar Base de Datos

**Opción más fácil - Docker:**
```powershell
docker run --name ras-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ras_beacon -p 5432:5432 -d postgres
```

**O usa una base de datos en la nube (gratis):**
- [Supabase](https://supabase.com) - Crea proyecto → Copia connection string
- [Neon](https://neon.tech) - Crea proyecto → Copia connection string

### 2. Crear archivo .env

Crea un archivo `.env` en la raíz con:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ras_beacon"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cualquier-cadena-larga-y-aleatoria-aqui-123456789"
```

**Para generar NEXTAUTH_SECRET en PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Configurar Base de Datos

```powershell
npx prisma generate
npx prisma db push
```

### 4. Crear Usuario Admin

```powershell
npm run seed
```

Esto crea:
- Email: `admin@ras.com`
- Password: `admin123`

### 5. Iniciar Servidor

```powershell
npm run dev
```

### 6. Abrir en el Navegador

Ve a: **http://localhost:3000**

## Prueba Rápida

1. **Login como admin:**
   - Email: `admin@ras.com`
   - Password: `admin123`

2. **Registra un usuario de prueba:**
   - Ve a `/register`
   - Completa el formulario

3. **Aprueba el usuario:**
   - Ve a `/admin`
   - Haz clic en el botón de aprobar

4. **Inicia sesión con el nuevo usuario**

5. **¡Crea tu primer Beacon!**
   - Pestaña "Encender"
   - Completa el formulario
   - ¡Listo! 🎉

## Comandos Útiles

```powershell
# Ver base de datos en navegador
npm run db:studio

# Reiniciar base de datos (borra todo)
npx prisma db push --force-reset
npm run seed
```

## ¿Problemas?

Consulta `LOCAL_SETUP.md` para troubleshooting detallado.
