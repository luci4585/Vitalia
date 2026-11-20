import { useState } from 'react'
import type { IUsuario } from '../Interfaces/IUsuario'

const URL_USUARIOS = '/api/Usuarios'

// Hook: guarda la lista de usuarios y ofrece las operaciones CRUD contra el backend.
// Los errores se lanzan (throw) para que el componente los muestre al usuario.
export function useUsuariosApi() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([])
  const [cargando, setCargando] = useState(true) // empieza en true: evita mostrar "No hay..." antes de cargar

  async function cargarUsuarios() {
    setCargando(true)
    try {
      const respuesta = await fetch(URL_USUARIOS)
      if (!respuesta.ok) throw new Error('No se pudieron cargar los usuarios.')
      setUsuarios(await respuesta.json())
    } finally {
      setCargando(false)
    }
  }

  async function crearUsuario(nuevo: Omit<IUsuario, 'id'>) {
    const respuesta = await fetch(URL_USUARIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    })
    if (!respuesta.ok) throw new Error(await respuesta.text())
    await cargarUsuarios()
  }

  async function actualizarUsuario(usuario: IUsuario) {
    const respuesta = await fetch(`${URL_USUARIOS}/${usuario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    })
    if (!respuesta.ok) throw new Error('No se pudo actualizar el usuario.')
    await cargarUsuarios()
  }

  async function eliminarUsuario(id: number) {
    const respuesta = await fetch(`${URL_USUARIOS}/${id}`, { method: 'DELETE' })
    if (!respuesta.ok) throw new Error('No se pudo eliminar el usuario.')
    await cargarUsuarios()
  }

  return { usuarios, cargando, cargarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario }
}
