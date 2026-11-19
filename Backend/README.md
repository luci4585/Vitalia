# Vitalia - Backend (ASP.NET Core Web API)

API con C# 13 / .NET 9, Entity Framework Core y MySQL/MariaDB.

## Requisitos
- .NET 9 SDK
- MariaDB o MySQL corriendo (en WAMP: `wampmariadb64`, puerto 3307)

## Configuración
La cadena de conexión está en `Vitalia.Api/appsettings.json`:

```json
"MySql": "Server=localhost;Port=3307;Database=vitalia;User=root;Password=;"
```

Si tu puerto o contraseña son otros, cambialos ahí.

## Ejecutar
```bash
cd Vitalia.Api
dotnet run
```

Al iniciar:
1. Se crea la base `vitalia` y sus tablas (migración `InicialCreate`).
2. En Development se cargan datos ficticios (2 usuarios, 2 turnos, 2 registros).
3. Se abre Swagger en `http://localhost:5134/swagger`.

## Endpoints
| Recurso | Ruta base |
|---|---|
| Usuarios | `/api/Usuarios` |
| Turnos | `/api/Turnos` |
| Registros de salud | `/api/RegistrosSalud` |

Cada uno tiene GET (todos), GET `{id}`, POST, PUT `{id}` y DELETE `{id}`.

## Comandos útiles de EF Core
```bash
dotnet ef migrations add NombreDelCambio   # después de cambiar una entidad
dotnet ef database update                  # aplica migraciones a la base
```
(Requiere `dotnet tool install --global dotnet-ef`.)

## Administrar en phpMyAdmin
Abrí phpMyAdmin, elegí la base `vitalia` y vas a ver las tablas `Usuarios`, `Turnos`, `RegistrosSalud` y `__EFMigrationsHistory`.
