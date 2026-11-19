namespace Vitalia.Api.Models;

// Un turno médico reservado por un usuario. Tabla "Turnos".
public class Turno
{
    public int Id { get; set; }

    // Clave foránea: indica a qué usuario pertenece el turno.
    public int UsuarioId { get; set; }

    // Navegación: permite acceder al usuario desde el turno (ej: turno.Usuario.Nombre).
    public Usuario? Usuario { get; set; }

    public DateTime FechaHora { get; set; }

    public string Motivo { get; set; } = string.Empty;

    // Valores esperados: "Pendiente", "Confirmado" o "Cancelado".
    public string Estado { get; set; } = "Pendiente";
}
