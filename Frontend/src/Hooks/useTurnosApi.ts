import { useState } from 'react'
import type { ITurno } from '../Interfaces/ITurno'

const URL_TURNOS = '/api/Turnos'

// Hook: lista de turnos y operaciones CRUD contra el backend.
export function useTurnosApi() {
  const [turnos, setTurnos] = useState<ITurno[]>([])
  const [cargando, setCargando] = useState(true) // empieza en true: evita mostrar "No hay..." antes de cargar

  async function cargarTurnos() {
    setCargando(true)
    try {
      const respuesta = await fetch(URL_TURNOS)
      if (!respuesta.ok) throw new Error('No se pudieron cargar los turnos.')
      setTurnos(await respuesta.json())
    } finally {
      setCargando(false)
    }
  }

  async function crearTurno(nuevo: Omit<ITurno, 'id' | 'usuario'>) {
    const respuesta = await fetch(URL_TURNOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    })
    if (!respuesta.ok) throw new Error(await respuesta.text())
    await cargarTurnos()
  }

  async function actualizarTurno(turno: ITurno) {
    const respuesta = await fetch(`${URL_TURNOS}/${turno.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(turno),
    })
    if (!respuesta.ok) throw new Error('No se pudo actualizar el turno.')
    await cargarTurnos()
  }

  async function eliminarTurno(id: number) {
    const respuesta = await fetch(`${URL_TURNOS}/${id}`, { method: 'DELETE' })
    if (!respuesta.ok) throw new Error('No se pudo eliminar el turno.')
    await cargarTurnos()
  }

  return { turnos, cargando, cargarTurnos, crearTurno, actualizarTurno, eliminarTurno }
}
