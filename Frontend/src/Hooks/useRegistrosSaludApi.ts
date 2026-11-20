import { useState } from 'react'
import type { IRegistroSalud } from '../Interfaces/IRegistroSalud'

const URL_REGISTROS = '/api/RegistrosSalud'

// Hook: lista de registros de salud y operaciones CRUD contra el backend.
export function useRegistrosSaludApi() {
  const [registros, setRegistros] = useState<IRegistroSalud[]>([])
  const [cargando, setCargando] = useState(true) // empieza en true: evita mostrar "No hay..." antes de cargar

  async function cargarRegistros() {
    setCargando(true)
    try {
      const respuesta = await fetch(URL_REGISTROS)
      if (!respuesta.ok) throw new Error('No se pudieron cargar los registros.')
      setRegistros(await respuesta.json())
    } finally {
      setCargando(false)
    }
  }

  async function crearRegistro(nuevo: Omit<IRegistroSalud, 'id' | 'usuario'>) {
    const respuesta = await fetch(URL_REGISTROS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    })
    if (!respuesta.ok) throw new Error(await respuesta.text())
    await cargarRegistros()
  }

  async function actualizarRegistro(registro: IRegistroSalud) {
    const respuesta = await fetch(`${URL_REGISTROS}/${registro.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registro),
    })
    if (!respuesta.ok) throw new Error('No se pudo actualizar el registro.')
    await cargarRegistros()
  }

  async function eliminarRegistro(id: number) {
    const respuesta = await fetch(`${URL_REGISTROS}/${id}`, { method: 'DELETE' })
    if (!respuesta.ok) throw new Error('No se pudo eliminar el registro.')
    await cargarRegistros()
  }

  return { registros, cargando, cargarRegistros, crearRegistro, actualizarRegistro, eliminarRegistro }
}
