using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vitalia.Api.Data;
using Vitalia.Api.Models;

namespace Vitalia.Api.Controllers;

// Ruta base: /api/RegistrosSalud
[ApiController]
[Route("api/[controller]")]
public class RegistrosSaludController : ControllerBase
{
    private readonly VitaliaDbContext _db;

    public RegistrosSaludController(VitaliaDbContext db)
    {
        _db = db;
    }

    // GET: /api/RegistrosSalud
    [HttpGet]
    public async Task<ActionResult<List<RegistroSalud>>> ObtenerTodos()
    {
        return await _db.RegistrosSalud.Include(r => r.Usuario).ToListAsync();
    }

    // GET: /api/RegistrosSalud/1
    [HttpGet("{id}")]
    public async Task<ActionResult<RegistroSalud>> ObtenerPorId(int id)
    {
        var registro = await _db.RegistrosSalud.Include(r => r.Usuario).FirstOrDefaultAsync(r => r.Id == id);
        if (registro == null)
        {
            return NotFound();
        }
        return registro;
    }

    // POST: /api/RegistrosSalud
    [HttpPost]
    public async Task<ActionResult<RegistroSalud>> Crear(RegistroSalud nuevo)
    {
        var usuarioExiste = await _db.Usuarios.AnyAsync(u => u.Id == nuevo.UsuarioId);
        if (!usuarioExiste)
        {
            return BadRequest("El usuario indicado no existe.");
        }

        _db.RegistrosSalud.Add(nuevo);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(ObtenerPorId), new { id = nuevo.Id }, nuevo);
    }

    // PUT: /api/RegistrosSalud/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(int id, RegistroSalud datos)
    {
        var registro = await _db.RegistrosSalud.FindAsync(id);
        if (registro == null)
        {
            return NotFound();
        }

        registro.Fecha = datos.Fecha;
        registro.PesoKg = datos.PesoKg;
        registro.FrecuenciaCardiaca = datos.FrecuenciaCardiaca;
        registro.Notas = datos.Notas;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: /api/RegistrosSalud/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var registro = await _db.RegistrosSalud.FindAsync(id);
        if (registro == null)
        {
            return NotFound();
        }

        _db.RegistrosSalud.Remove(registro);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
