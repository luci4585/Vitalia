import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

interface PropsModal {
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

// Modal que se dibuja directamente dentro de <body> (Portal).
// Así no queda atrapado por estilos o posiciones de la sección donde se usa.
export default function Modal({ titulo, onCerrar, children }: PropsModal) {
  return createPortal(
    <div className="modal-fondo" onClick={onCerrar}>
      {/* stopPropagation: hacer clic dentro de la caja no cierra el modal */}
      <div className="modal-caja" onClick={(evento) => evento.stopPropagation()}>
        <div className="modal-cabecera">
          <h2>{titulo}</h2>
          <button type="button" className="boton-cerrar" onClick={onCerrar}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
