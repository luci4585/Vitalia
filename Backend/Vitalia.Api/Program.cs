using Microsoft.EntityFrameworkCore;
using Vitalia.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Servicios: controladores (API), Swagger y la conexión a MySQL.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("MySql");
builder.Services.AddDbContext<VitaliaDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

// 2. Al iniciar: crea las tablas que falten y, en desarrollo, carga datos de prueba.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<VitaliaDbContext>();
    db.Database.Migrate();

    if (app.Environment.IsDevelopment())
    {
        DatosDePrueba.Cargar(db);
    }
}

// 3. Pipeline HTTP: Swagger para probar los endpoints desde el navegador.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
