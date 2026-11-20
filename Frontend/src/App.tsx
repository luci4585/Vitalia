import { useState } from 'react'
import Menu from './Components/Menu/Menu'
import type { Seccion } from './Components/Menu/Menu'
import SeccionRegistros from './Components/SeccionRegistros/SeccionRegistros'
import SeccionTurnos from './Components/SeccionTurnos/SeccionTurnos'
import SeccionUsuarios from './Components/SeccionUsuarios/SeccionUsuarios'

// Componente raíz: muestra el menú y la sección elegida.
// No usamos React Router: un simple estado alcanza para tres secciones.
export default function App() {
  const [seccionActiva, setSeccionActiva] = useState<Seccion>('usuarios')

  return (
    <div className="app">
      <h1 className="titulo-app">Vitalia</h1>
      <Menu seccionActiva={seccionActiva} onCambiarSeccion={setSeccionActiva} />

      {seccionActiva === 'usuarios' && <SeccionUsuarios />}
      {seccionActiva === 'turnos' && <SeccionTurnos />}
      {seccionActiva === 'registros' && <SeccionRegistros />}
    </div>
  )
}
