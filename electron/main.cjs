const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('node:path')

const isDev = !app.isPackaged
const devUrl = 'http://localhost:5173'

let controlWindow
let displayWindow

function loadView(win, view) {
  if (isDev) {
    win.loadURL(`${devUrl}?view=${view}`)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'), { query: { view } })
  }
}

function createWindows() {
  controlWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: { preload: path.join(__dirname, 'preload.cjs') },
  })
  loadView(controlWindow, 'control')

  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((d) => d.bounds.x !== 0 || d.bounds.y !== 0) ?? displays[0]

  displayWindow = new BrowserWindow({
    x: externalDisplay.bounds.x,
    y: externalDisplay.bounds.y,
    fullscreen: displays.length > 1,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    webPreferences: { preload: path.join(__dirname, 'preload.cjs') },
  })
  loadView(displayWindow, 'display')

  ipcMain.on('verse', (_event, payload) => {
    displayWindow?.webContents.send('verse', payload)
  })

  ipcMain.on('close-app', () => app.quit())

  ipcMain.on('background', (_event, payload) => {
    displayWindow?.webContents.send('background', payload)
  })
}

app.whenReady().then(createWindows)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
