import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRegistrosSaludApi } from '../../Hooks/useRegistrosSaludApi'
import { useUsuariosApi } from '../../Hooks/useUsuariosApi'
import type { IRegistroSalud } from '../../Interfaces/IRegistroSalud'
import FormularioRegistro from '../FormularioRegistro/FormularioRegistro'
import Modal from '../Modal/Modal'

// Sección de registros de salud: tabla, alta, edición y borrado.
export default function SeccionRegistros() {
  const { registros, cargando, cargarRegistros, crearRegistro, actualizarRegistro, eliminarRegistro } =
    useRegistrosSaludApi()
  const { usuarios, cargarUsuarios } = useUsuariosApi() // para el select del formulario

  const [mostrarModal, setMostrarModal] = useState(false)
  const [registroEditando, setRegistroEditando] = useState<IRegistroSalud | undefined>(undefined)

  useEffect(() => {
    cargarRegistros()
    cargarUsuarios()
  }, [])

  function abrirNuevo() {
    setRegistroEditando(undefined)
    setMostrarModal(true)
  }

  function abrirEditar(registro: IRegistroSalud) {
    setRegistroEditando(registro)
    setMostrarModal(true)
  }

  async function guardar(datos: Omit<IRegistroSalud, 'id' | 'usuario'>) {
    try {
      if (registroEditando) {
        await actualizarRegistro({ id: registroEditando.id, ...datos })
      } else {
        await crearRegistro(datos)
      }
      setMostrarModal(false)
      Swal.fire('Listo', 'El registro se guardó correctamente.', 'success')
    } catch (error) {
      mostrarError(error)
    }
  }

  async function confirmarEliminar(registro: IRegistroSalud) {
    const respuesta = await Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!respuesta.isConfirmed) return

    try {
      await eliminarRegistro(registro.id)
      Swal.fire('Eliminado', 'El registro se eliminó.', 'success')
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
        <h1>Registros de salud</h1>
        <button type="button" className="boton" onClick={abrirNuevo}>
          Nuevo registro
        </button>
      </div>

      {cargando && <p>Cargando...</p>}
      {!cargando && registros.length === 0 && <p>No hay registros cargados.</p>}

      {registros.length > 0 && (
        <table className="tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Peso (kg)</th>
              <th>Frec. cardíaca</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id}>
                <td>{registro.usuario?.nombre ?? `#${registro.usuarioId}`}</td>
                <td>{registro.fecha.slice(0, 10)}</td>
                <td>{registro.pesoKg ?? '-'}</td>
                <td>{registro.frecuenciaCardiaca ?? '-'}</td>
                <td>{registro.notas ?? '-'}</td>
                <td className="acciones">
                  <button type="button" className="boton secundario" onClick={() => abrirEditar(registro)}>
                    Editar
                  </button>
                  <button type="button" className="boton peligro" onClick={() => confirmarEliminar(registro)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarModal && (
        <Modal
          titulo={registroEditando ? 'Editar registro' : 'Nuevo registro'}
          onCerrar={() => setMostrarModal(false)}
        >
          <FormularioRegistro
            registro={registroEditando}
            usuarios={usuarios}
            onGuardar={guardar}
            onCancelar={() => setMostrarModal(false)}
          />
        </Modal>
      )}
    </section>
  )
}
