// Forma de un usuario tal como lo devuelve el backend (nombres en camelCase).
export interface IUsuario {
  id: number
  nombre: string
  email: string
  telefono: string | null
  fechaNacimiento: string
}
