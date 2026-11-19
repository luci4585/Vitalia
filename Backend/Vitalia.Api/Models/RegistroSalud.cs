namespace Vitalia.Api.Models;

// Una medición de salud cargada por el usuario (peso, pulso, etc.). Tabla "RegistrosSalud".
public class RegistroSalud
{
    public int Id { get; set; }

    // Clave foránea: a qué usuario pertenece el registro.
    public int UsuarioId { get; set; }

    // Navegación hacia el usuario.
    public Usuario? Usuario { get; set; }

    public DateTime Fecha { get; set; }

    // Los valores son opcionales: el usuario carga solo lo que mide.
    public decimal? PesoKg { get; set; }

    public int? FrecuenciaCardiaca { get; set; }

    public string? Notas { get; set; }
}
