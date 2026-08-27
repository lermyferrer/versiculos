import azul from './fondo-azul.jpg'
import azul2 from './fondo-azul-2.jpg'
import zul3 from './fondo-zul-3.jpg'

export interface Background {
  id: string
  label: string
  kind: 'image' | 'gradient'
  src?: string
}

export const BACKGROUNDS: Background[] = [
  { id: 'gradiente', label: 'Gradiente azul', kind: 'gradient' },
  { id: 'azul-2', label: 'Azul 2', kind: 'image', src: azul2 },
  { id: 'azul', label: 'Azul', kind: 'image', src: azul },
  { id: 'zul-3', label: 'Azul 3', kind: 'image', src: zul3 },
]
