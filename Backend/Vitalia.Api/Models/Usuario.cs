using System.Text.Json.Serialization;

namespace Vitalia.Api.Models;

// Una persona que usa Vitalia. Se convierte en una tabla "Usuarios" en MySQL.
public class Usuario
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    public DateTime FechaNacimiento { get; set; }

    // Relaciones: un usuario tiene muchos turnos y muchos registros de salud.
    // [JsonIgnore] evita que se envíen en el JSON (y así no hay bucles infinitos).
    [JsonIgnore]
    public List<Turno> Turnos { get; set; } = new();

    [JsonIgnore]
    public List<RegistroSalud> RegistrosSalud { get; set; } = new();
}
