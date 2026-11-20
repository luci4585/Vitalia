import type { FormEvent } from 'react'
import type { IRegistroSalud } from '../../Interfaces/IRegistroSalud'
import type { IUsuario } from '../../Interfaces/IUsuario'

interface PropsFormularioRegistro {
  registro?: IRegistroSalud // si viene, edita; si no, crea
  usuarios: IUsuario[]
  onGuardar: (datos: Omit<IRegistroSalud, 'id' | 'usuario'>) => void
  onCancelar: () => void
}

// Formulario de registro de salud. Los valores numéricos son opcionales.
export default function FormularioRegistro({ registro, usuarios, onGuardar, onCancelar }: PropsFormularioRegistro) {
  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)

    onGuardar({
      usuarioId: registro?.usuarioId ?? Number(datos.get('usuarioId')),
      fecha: String(datos.get('fecha')),
      pesoKg: datos.get('pesoKg') ? Number(datos.get('pesoKg')) : null,
      frecuenciaCardiaca: datos.get('frecuenciaCardiaca') ? Number(datos.get('frecuenciaCardiaca')) : null,
      notas: String(datos.get('notas')) || null,
    })
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      {!registro && (
        <label>
          Usuario
          <select name="usuarioId" required defaultValue="">
            <option value="" disabled>
              Elegí un usuario
            </option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        Fecha
        <input name="fecha" type="date" required defaultValue={registro?.fecha.slice(0, 10) ?? ''} />
      </label>
      <label>
        Peso (kg)
        <input name="pesoKg" type="number" step="0.01" min="0" defaultValue={registro?.pesoKg ?? ''} />
      </label>
      <label>
        Frecuencia cardíaca (ppm)
        <input
          name="frecuenciaCardiaca"
          type="number"
          min="0"
          defaultValue={registro?.frecuenciaCardiaca ?? ''}
        />
      </label>
      <label>
        Notas
        <input name="notas" defaultValue={registro?.notas ?? ''} />
      </label>

      <div className="formulario-acciones">
        <button type="button" className="boton secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="boton">
          Guardar
        </button>
      </div>
    </form>
  )
}
