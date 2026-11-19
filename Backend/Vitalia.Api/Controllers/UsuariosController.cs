using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vitalia.Api.Data;
using Vitalia.Api.Models;

namespace Vitalia.Api.Controllers;

// Ruta base: /api/Usuarios
[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly VitaliaDbContext _db;

    // La base de datos se "inyecta" automáticamente por el constructor.
    public UsuariosController(VitaliaDbContext db)
    {
        _db = db;
    }

    // GET: /api/Usuarios
    [HttpGet]
    public async Task<ActionResult<List<Usuario>>> ObtenerTodos()
    {
        return await _db.Usuarios.ToListAsync();
    }

    // GET: /api/Usuarios/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> ObtenerPorId(int id)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario == null)
        {
            return NotFound();
        }
        return usuario;
    }

    // POST: /api/Usuarios
    [HttpPost]
    public async Task<ActionResult<Usuario>> Crear(Usuario nuevo)
    {
        var emailYaExiste = await _db.Usuarios.AnyAsync(u => u.Email == nuevo.Email);
        if (emailYaExiste)
        {
            return Conflict("Ya existe un usuario con ese email.");
        }

        _db.Usuarios.Add(nuevo);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(ObtenerPorId), new { id = nuevo.Id }, nuevo);
    }

    // PUT: /api/Usuarios/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(int id, Usuario datos)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario == null)
        {
            return NotFound();
        }

        usuario.Nombre = datos.Nombre;
        usuario.Email = datos.Email;
        usuario.Telefono = datos.Telefono;
        usuario.FechaNacimiento = datos.FechaNacimiento;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: /api/Usuarios/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario == null)
        {
            return NotFound();
        }

        _db.Usuarios.Remove(usuario);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
