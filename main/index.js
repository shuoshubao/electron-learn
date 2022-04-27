/*
 * @Author: fangt11
 * @Date:   2022-04-07 13:47:44
 * @Last Modified by:   fangt11
 * @Last Modified time: 2022-04-27 16:50:38
 */
const { resolve } = require('path')
const { app, BrowserWindow, ipcMain, globalShortcut, session } = require('electron')
const log = require('electron-log')
const glob = require('glob')
const { isDevelopment, Chrome_Extensions_PATH, Chrome_Extensions_IDS } = require('./config')

if (!isDevelopment) {
  require('fix-path')()
}

app.on('ready', () => {
  log.info('ready')
  const win = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hiddenInset',
    width: 1200,
    height: 600,
    webPreferences: {
      preload: resolve(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.maximize()

  if (isDevelopment) {
    win.loadURL('http://localhost:8080/')
    win.webContents.openDevTools()
  } else {
    win.loadURL(`file://${resolve(__dirname, '../dist')}/index.html`)
  }

  win.on('close', () => {
    log.silly('close')
    app.quit()
  })

  app.on('activate', () => {
    if (!win.isVisible()) {
      win.show()
    }
  })

  app.on('browser-window-focus', () => {
    require('./shortcut')
    // log.info('browser-window-focus')
  })

  app.on('browser-window-blur', () => {
    // log.warn('browser-window-blur')
    globalShortcut.unregisterAll()
  })

  ipcMain.on('show', () => {
    win.show()
    win.focus()
  })

  require('../server')
})

app
  .whenReady()
  .then(async () => {
    if (isDevelopment) {
      const versions = glob.sync(`${Chrome_Extensions_PATH}/${Chrome_Extensions_IDS.ReactDevTools}/*`)
      const latestVersion = versions[0]
      if (latestVersion) {
        await session.defaultSession.loadExtension(latestVersion)
      }
    }
  })
  .finally(() => {
    require('./menu')
  })

app.on('will-quit', () => {
  log.silly('will-quit')
  globalShortcut.unregisterAll()
})

require('./listener')
