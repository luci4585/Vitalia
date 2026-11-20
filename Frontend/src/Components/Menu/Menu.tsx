import './Menu.css'

// Las tres secciones de la aplicación.
export type Seccion = 'usuarios' | 'turnos' | 'registros'

interface PropsMenu {
  seccionActiva: Seccion
  onCambiarSeccion: (seccion: Seccion) => void
}

// Barra superior con un botón por sección. El estado vive en App.tsx.
export default function Menu({ seccionActiva, onCambiarSeccion }: PropsMenu) {
  const opciones: { valor: Seccion; texto: string }[] = [
    { valor: 'usuarios', texto: 'Usuarios' },
    { valor: 'turnos', texto: 'Turnos' },
    { valor: 'registros', texto: 'Registros de salud' },
  ]

  return (
    <nav className="menu">
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          className={opcion.valor === seccionActiva ? 'menu-boton activo' : 'menu-boton'}
          onClick={() => onCambiarSeccion(opcion.valor)}
        >
          {opcion.texto}
        </button>
      ))}
    </nav>
  )
}
