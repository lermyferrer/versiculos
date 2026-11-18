import azul from './fondo-azul.jpg'
import azul2 from './fondo-azul-2.jpg'
import zul3 from './fondo-zul-3.jpg'
import humo from './fondo-humo.png'
import hombreIntegral from './Hombre integral.png'

export interface Background {
  id: string
  label: string
  kind: 'image' | 'gradient'
  src?: string
  // Para imágenes que ya traen su propio logo/texto, evita duplicar el logo flotante de la app.
  hideLogo?: boolean
}

export const BACKGROUNDS: Background[] = [
  { id: 'gradiente', label: 'Gradiente azul', kind: 'gradient' },
  { id: 'azul-2', label: 'Azul 2', kind: 'image', src: azul2 },
  { id: 'azul', label: 'Azul', kind: 'image', src: azul },
  { id: 'zul-3', label: 'Azul 3', kind: 'image', src: zul3 },
  { id: 'humo', label: 'Humo', kind: 'image', src: humo },
  { id: 'hombre-integral', label: 'El Hombre Integral', kind: 'image', src: hombreIntegral, hideLogo: true },
]
