# Script de configuración rápida para Windows PowerShell

Write-Host "🚀 Configurando RAS Beacon..." -ForegroundColor Yellow

# Verificar Node.js
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green

# Verificar si .env existe
Write-Host "`n📝 Verificando archivo .env..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado. Creando uno de ejemplo..." -ForegroundColor Yellow
    
    # Generar NEXTAUTH_SECRET
    $secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    $envContent = @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ras_beacon"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$secret"
"@
    
    Set-Content -Path ".env" -Value $envContent
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Edita .env y configura tu DATABASE_URL" -ForegroundColor Yellow
} else {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
}

# Instalar dependencias
Write-Host "`n📦 Instalando dependencias..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias instaladas" -ForegroundColor Green

# Generar Prisma Client
Write-Host "`n🔧 Generando Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al generar Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generado" -ForegroundColor Green

Write-Host "`n✅ Configuración completada!" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Configura tu base de datos PostgreSQL (edita .env)" -ForegroundColor White
Write-Host "2. Ejecuta: npx prisma db push" -ForegroundColor White
Write-Host "3. Ejecuta: npm run seed" -ForegroundColor White
Write-Host "4. Ejecuta: npm run dev" -ForegroundColor White
Write-Host "`n💡 Para más ayuda, consulta LOCAL_SETUP.md" -ForegroundColor Cyan
