import type { IUsuario } from './IUsuario'

// Forma de un turno. "usuario" llega solo en las respuestas GET (el backend hace Include).
export interface ITurno {
  id: number
  usuarioId: number
  usuario?: IUsuario | null
  fechaHora: string
  motivo: string
  estado: string
}
