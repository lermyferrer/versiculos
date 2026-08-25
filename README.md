# Versículos

App de Electron para mostrar versículos bíblicos en una pantalla extendida (HDMI) durante un servicio.

- Ventana de control: buscas libro/capítulo y hacés click en un versículo para enviarlo.
- Ventana de proyección: se abre automáticamente en fullscreen en la pantalla externa (si hay una conectada) y muestra el versículo activo.
- Texto vía [bolls.life](https://bolls.life) (RVR1960), sin API key.

## Desarrollo

```bash
npm run electron:dev
```

Levanta Vite + Electron juntos. Sin pantalla extendida conectada, ambas ventanas se abren en la principal.

## Build

```bash
npm run build
npx electron .
```
