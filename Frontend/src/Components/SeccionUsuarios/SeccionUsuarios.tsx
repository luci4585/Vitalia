import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useUsuariosApi } from '../../Hooks/useUsuariosApi'
import type { IUsuario } from '../../Interfaces/IUsuario'
import FormularioUsuario from '../FormularioUsuario/FormularioUsuario'
import Modal from '../Modal/Modal'

// Sección completa de usuarios: tabla, alta, edición y borrado.
export default function SeccionUsuarios() {
  const { usuarios, cargando, cargarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } =
    useUsuariosApi()

  const [mostrarModal, setMostrarModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<IUsuario | undefined>(undefined)

  // Al abrir la sección, pedimos la lista al backend una sola vez.
  useEffect(() => {
    cargarUsuarios()
  }, [])

  function abrirNuevo() {
    setUsuarioEditando(undefined)
    setMostrarModal(true)
  }

  function abrirEditar(usuario: IUsuario) {
    setUsuarioEditando(usuario)
    setMostrarModal(true)
  }

  async function guardar(datos: Omit<IUsuario, 'id'>) {
    try {
      if (usuarioEditando) {
        await actualizarUsuario({ id: usuarioEditando.id, ...datos })
      } else {
        await crearUsuario(datos)
      }
      setMostrarModal(false)
      Swal.fire('Listo', 'El usuario se guardó correctamente.', 'success')
    } catch (error) {
      mostrarError(error)
    }
  }

  async function confirmarEliminar(usuario: IUsuario) {
    const respuesta = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se borrará ${usuario.nombre} junto con sus turnos y registros.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!respuesta.isConfirmed) return

    try {
      await eliminarUsuario(usuario.id)
      Swal.fire('Eliminado', 'El usuario se eliminó.', 'success')
    } catch (error) {
      mostrarError(error)
    }
  }

  function mostrarError(error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
    Swal.fire('Error', mensaje, 'error')
  }

  return (
    <section>
      <div className="seccion-cabecera">
        <h1>Usuarios</h1>
        <button type="button" className="boton" onClick={abrirNuevo}>
          Nuevo usuario
        </button>
      </div>

      {cargando && <p>Cargando...</p>}
      {!cargando && usuarios.length === 0 && <p>No hay usuarios cargados.</p>}

      {usuarios.length > 0 && (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono ?? '-'}</td>
                <td>{usuario.fechaNacimiento.slice(0, 10)}</td>
                <td className="acciones">
                  <button type="button" className="boton secundario" onClick={() => abrirEditar(usuario)}>
                    Editar
                  </button>
                  <button type="button" className="boton peligro" onClick={() => confirmarEliminar(usuario)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarModal && (
        <Modal titulo={usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'} onCerrar={() => setMostrarModal(false)}>
          <FormularioUsuario
            usuario={usuarioEditando}
            onGuardar={guardar}
            onCancelar={() => setMostrarModal(false)}
          />
        </Modal>
      )}
    </section>
  )
}
