import type { FormEvent } from 'react'
import type { ITurno } from '../../Interfaces/ITurno'
import type { IUsuario } from '../../Interfaces/IUsuario'

interface PropsFormularioTurno {
  turno?: ITurno // si viene, edita; si no, crea
  usuarios: IUsuario[] // para elegir a qué usuario pertenece el turno
  onGuardar: (datos: Omit<ITurno, 'id' | 'usuario'>) => void
  onCancelar: () => void
}

// Formulario de turno. Al editar no se puede cambiar el usuario (el backend no lo actualiza).
export default function FormularioTurno({ turno, usuarios, onGuardar, onCancelar }: PropsFormularioTurno) {
  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)

    onGuardar({
      usuarioId: turno?.usuarioId ?? Number(datos.get('usuarioId')),
      fechaHora: String(datos.get('fechaHora')),
      motivo: String(datos.get('motivo')),
      estado: String(datos.get('estado')),
    })
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      {!turno && (
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
        Fecha y hora
        <input
          name="fechaHora"
          type="datetime-local"
          required
          defaultValue={turno?.fechaHora.slice(0, 16) ?? ''}
        />
      </label>
      <label>
        Motivo
        <input name="motivo" required defaultValue={turno?.motivo ?? ''} />
      </label>
      <label>
        Estado
        <select name="estado" defaultValue={turno?.estado ?? 'Pendiente'}>
          <option value="Pendiente">Pendiente</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
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
