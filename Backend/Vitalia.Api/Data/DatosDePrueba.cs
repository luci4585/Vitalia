using Vitalia.Api.Models;

namespace Vitalia.Api.Data;

// Carga datos ficticios para probar la API. Solo se usa en modo Development.
public static class DatosDePrueba
{
    public static void Cargar(VitaliaDbContext db)
    {
        // Si ya hay usuarios, no volvemos a cargar nada.
        if (db.Usuarios.Any())
        {
            return;
        }

        var usuarios = new List<Usuario>
        {
            new() { Nombre = "Ana Gómez", Email = "ana@ejemplo.com", Telefono = "1111-1111", FechaNacimiento = new DateTime(1990, 5, 14) },
            new() { Nombre = "Luis Pérez", Email = "luis@ejemplo.com", Telefono = "2222-2222", FechaNacimiento = new DateTime(1985, 11, 2) }
        };
        db.Usuarios.AddRange(usuarios);
        db.SaveChanges(); // Al guardar, la base asigna los Id a los usuarios.

        db.Turnos.AddRange(
            new Turno { UsuarioId = usuarios[0].Id, FechaHora = new DateTime(2026, 12, 1, 10, 0, 0), Motivo = "Control general", Estado = "Confirmado" },
            new Turno { UsuarioId = usuarios[1].Id, FechaHora = new DateTime(2026, 12, 3, 16, 30, 0), Motivo = "Dolor de espalda", Estado = "Pendiente" }
        );

        db.RegistrosSalud.AddRange(
            new RegistroSalud { UsuarioId = usuarios[0].Id, Fecha = new DateTime(2026, 11, 10), PesoKg = 62.5m, FrecuenciaCardiaca = 72, Notas = "Después de caminar" },
            new RegistroSalud { UsuarioId = usuarios[1].Id, Fecha = new DateTime(2026, 11, 12), PesoKg = 80.1m, FrecuenciaCardiaca = 80, Notas = null }
        );

        db.SaveChanges();
    }
}
