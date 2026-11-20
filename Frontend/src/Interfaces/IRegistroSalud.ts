import type { IUsuario } from './IUsuario'

// Forma de un registro de salud. "usuario" llega solo en las respuestas GET.
export interface IRegistroSalud {
  id: number
  usuarioId: number
  usuario?: IUsuario | null
  fecha: string
  pesoKg: number | null
  frecuenciaCardiaca: number | null
  notas: string | null
}
