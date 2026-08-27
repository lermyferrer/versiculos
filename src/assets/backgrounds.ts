import azul from './fondo-azul.jpg'
import azul2 from './fondo-azul-2.jpg'
import zul3 from './fondo-zul-3.jpg'

export interface Background {
  id: string
  label: string
  src: string
}

export const BACKGROUNDS: Background[] = [
  { id: 'azul-2', label: 'Azul 2', src: azul2 },
  { id: 'azul', label: 'Azul', src: azul },
  { id: 'zul-3', label: 'Azul 3', src: zul3 },
]
