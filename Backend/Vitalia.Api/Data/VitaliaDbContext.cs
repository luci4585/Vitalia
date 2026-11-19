using Microsoft.EntityFrameworkCore;
using Vitalia.Api.Models;

namespace Vitalia.Api.Data;

// Puerta de entrada a la base de datos. Cada DbSet se convierte en una tabla.
public class VitaliaDbContext : DbContext
{
    public VitaliaDbContext(DbContextOptions<VitaliaDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Turno> Turnos => Set<Turno>();
    public DbSet<RegistroSalud> RegistrosSalud => Set<RegistroSalud>();

    // Configuración de tablas y relaciones.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // El email de cada usuario no puede repetirse.
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Peso con hasta 5 dígitos en total y 2 decimales (ej: 62.50).
        modelBuilder.Entity<RegistroSalud>()
            .Property(r => r.PesoKg)
            .HasPrecision(5, 2);

        // Usuario 1 --- N Turnos. Si se borra el usuario, se borran sus turnos.
        modelBuilder.Entity<Turno>()
            .HasOne(t => t.Usuario)
            .WithMany(u => u.Turnos)
            .HasForeignKey(t => t.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        // Usuario 1 --- N RegistrosSalud. Si se borra el usuario, se borran sus registros.
        modelBuilder.Entity<RegistroSalud>()
            .HasOne(r => r.Usuario)
            .WithMany(u => u.RegistrosSalud)
            .HasForeignKey(r => r.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
