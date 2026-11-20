import type { FormEvent } from 'react'
import type { IUsuario } from '../../Interfaces/IUsuario'

interface PropsFormularioUsuario {
  usuario?: IUsuario // si viene, el formulario edita; si no, crea uno nuevo
  onGuardar: (datos: Omit<IUsuario, 'id'>) => void
  onCancelar: () => void
}

// Formulario de usuario. Lee los campos con FormData al enviar.
// defaultValue muestra los datos actuales cuando se está editando.
export default function FormularioUsuario({ usuario, onGuardar, onCancelar }: PropsFormularioUsuario) {
  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)

    onGuardar({
      nombre: String(datos.get('nombre')),
      email: String(datos.get('email')),
      telefono: String(datos.get('telefono')) || null, // texto vacío se guarda como null
      fechaNacimiento: String(datos.get('fechaNacimiento')),
    })
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <label>
        Nombre
        <input name="nombre" required defaultValue={usuario?.nombre ?? ''} />
      </label>
      <label>
        Email
        <input name="email" type="email" required defaultValue={usuario?.email ?? ''} />
      </label>
      <label>
        Teléfono
        <input name="telefono" defaultValue={usuario?.telefono ?? ''} />
      </label>
      <label>
        Fecha de nacimiento
        <input
          name="fechaNacimiento"
          type="date"
          required
          defaultValue={usuario?.fechaNacimiento.slice(0, 10) ?? ''}
        />
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
