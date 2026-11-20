import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useTurnosApi } from '../../Hooks/useTurnosApi'
import { useUsuariosApi } from '../../Hooks/useUsuariosApi'
import type { ITurno } from '../../Interfaces/ITurno'
import FormularioTurno from '../FormularioTurno/FormularioTurno'
import Modal from '../Modal/Modal'

// Sección de turnos: tabla, alta, edición y borrado.
export default function SeccionTurnos() {
  const { turnos, cargando, cargarTurnos, crearTurno, actualizarTurno, eliminarTurno } = useTurnosApi()
  const { usuarios, cargarUsuarios } = useUsuariosApi() // para el select del formulario

  const [mostrarModal, setMostrarModal] = useState(false)
  const [turnoEditando, setTurnoEditando] = useState<ITurno | undefined>(undefined)

  useEffect(() => {
    cargarTurnos()
    cargarUsuarios()
  }, [])

  function abrirNuevo() {
    setTurnoEditando(undefined)
    setMostrarModal(true)
  }

  function abrirEditar(turno: ITurno) {
    setTurnoEditando(turno)
    setMostrarModal(true)
  }

  async function guardar(datos: Omit<ITurno, 'id' | 'usuario'>) {
    try {
      if (turnoEditando) {
        await actualizarTurno({ id: turnoEditando.id, ...datos })
      } else {
        await crearTurno(datos)
      }
      setMostrarModal(false)
      Swal.fire('Listo', 'El turno se guardó correctamente.', 'success')
    } catch (error) {
      mostrarError(error)
    }
  }

  async function confirmarEliminar(turno: ITurno) {
    const respuesta = await Swal.fire({
      title: '¿Eliminar turno?',
      text: `Se borrará el turno "${turno.motivo}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!respuesta.isConfirmed) return

    try {
      await eliminarTurno(turno.id)
      Swal.fire('Eliminado', 'El turno se eliminó.', 'success')
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
        <h1>Turnos</h1>
        <button type="button" className="boton" onClick={abrirNuevo}>
          Nuevo turno
        </button>
      </div>

      {cargando && <p>Cargando...</p>}
      {!cargando && turnos.length === 0 && <p>No hay turnos cargados.</p>}

      {turnos.length > 0 && (
        <table className="tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha y hora</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id}>
                <td>{turno.usuario?.nombre ?? `#${turno.usuarioId}`}</td>
                <td>{turno.fechaHora.replace('T', ' ').slice(0, 16)}</td>
                <td>{turno.motivo}</td>
                <td>{turno.estado}</td>
                <td className="acciones">
                  <button type="button" className="boton secundario" onClick={() => abrirEditar(turno)}>
                    Editar
                  </button>
                  <button type="button" className="boton peligro" onClick={() => confirmarEliminar(turno)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarModal && (
        <Modal titulo={turnoEditando ? 'Editar turno' : 'Nuevo turno'} onCerrar={() => setMostrarModal(false)}>
          <FormularioTurno
            turno={turnoEditando}
            usuarios={usuarios}
            onGuardar={guardar}
            onCancelar={() => setMostrarModal(false)}
          />
        </Modal>
      )}
    </section>
  )
}
