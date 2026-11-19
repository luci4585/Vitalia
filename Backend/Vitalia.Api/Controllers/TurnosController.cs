using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vitalia.Api.Data;
using Vitalia.Api.Models;

namespace Vitalia.Api.Controllers;

// Ruta base: /api/Turnos
[ApiController]
[Route("api/[controller]")]
public class TurnosController : ControllerBase
{
    private readonly VitaliaDbContext _db;

    public TurnosController(VitaliaDbContext db)
    {
        _db = db;
    }

    // GET: /api/Turnos
    // Include(...) trae también los datos del usuario de cada turno (relación).
    [HttpGet]
    public async Task<ActionResult<List<Turno>>> ObtenerTodos()
    {
        return await _db.Turnos.Include(t => t.Usuario).ToListAsync();
    }

    // GET: /api/Turnos/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Turno>> ObtenerPorId(int id)
    {
        var turno = await _db.Turnos.Include(t => t.Usuario).FirstOrDefaultAsync(t => t.Id == id);
        if (turno == null)
        {
            return NotFound();
        }
        return turno;
    }

    // POST: /api/Turnos
    [HttpPost]
    public async Task<ActionResult<Turno>> Crear(Turno nuevo)
    {
        // Antes de guardar, verificamos que el usuario exista.
        var usuarioExiste = await _db.Usuarios.AnyAsync(u => u.Id == nuevo.UsuarioId);
        if (!usuarioExiste)
        {
            return BadRequest("El usuario indicado no existe.");
        }

        _db.Turnos.Add(nuevo);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(ObtenerPorId), new { id = nuevo.Id }, nuevo);
    }

    // PUT: /api/Turnos/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(int id, Turno datos)
    {
        var turno = await _db.Turnos.FindAsync(id);
        if (turno == null)
        {
            return NotFound();
        }

        turno.FechaHora = datos.FechaHora;
        turno.Motivo = datos.Motivo;
        turno.Estado = datos.Estado;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: /api/Turnos/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var turno = await _db.Turnos.FindAsync(id);
        if (turno == null)
        {
            return NotFound();
        }

        _db.Turnos.Remove(turno);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
