// @flow
import { app, Menu, shell, BrowserWindow } from 'electron';
import { clearCache } from './utils/utils';

export default class MenuBuilder {
  mainWindow: BrowserWindow;
  creditsWindow: BrowserWindow;
  workerWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow, creditsWindow: BrowserWindow, workerWindow: BrowserWindow, opencvWorkerWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.creditsWindow = creditsWindow;
    this.workerWindow = workerWindow;
    this.opencvWorkerWindow = opencvWorkerWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template = process.platform === 'darwin'
      ? this.buildDarwinTemplate()
      : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Electron',
      submenu: [
        { label: 'About MoviePrint_v004', selector: 'orderFrontStandardAboutPanel:' },
        { label: 'Credits', click: () => { this.creditsWindow.show(); } },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide MoviePrint_v004', accelerator: 'Command+H', selector: 'hide:' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:' },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', click: () => { this.mainWindow.send('undo'); } },
        { label: 'Redo', accelerator: 'Shift+Command+Z', click: () => { this.mainWindow.send('redo'); } },
        // { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        // { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        // { type: 'separator' },
        // { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        // { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        // { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        // { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
      ]
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } },
        { type: 'separator' },
        { label: 'Clear cache', accelerator: 'Shift+Alt+Command+C', click: () => { clearCache(this.mainWindow); } },
        { label: 'Reload', accelerator: 'Command+R', click: () => { this.mainWindow.webContents.reload(); } },
        { label: 'Reload Worker', accelerator: 'Alt+Command+R', click: () => { this.workerWindow.webContents.reload(); } },
        { label: 'Reload Opencv Worker', accelerator: 'Shift+Command+R', click: () => { this.opencvWorkerWindow.webContents.reload(); } },
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Command+I', click: () => { this.mainWindow.toggleDevTools(); } },
        { label: 'Toggle Developer Tools for Worker', accelerator: 'Alt+Command+J', click: () => { this.workerWindow.toggleDevTools(); } },
        { label: 'Toggle Developer Tools for Opencv Worker', accelerator: 'Alt+Command+J', click: () => { this.opencvWorkerWindow.toggleDevTools(); } },
        { label: 'Show Worker', click: () => { this.workerWindow.show(); } },
        { label: 'Show OpenCvWorker', click: () => { this.opencvWorkerWindow.show(); } }
      ]
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } },
        { type: 'separator' },
        { label: 'Clear cache', accelerator: 'Shift+Alt+Command+C', click: () => { clearCache(this.mainWindow); } },
        { label: 'Reload', accelerator: 'Command+R', click: () => { this.mainWindow.webContents.reload(); } },
        { label: 'Reload Worker', accelerator: 'Alt+Command+R', click: () => { this.workerWindow.webContents.reload(); } },
        { label: 'Reload Opencv Worker', accelerator: 'Shift+Command+R', click: () => { this.opencvWorkerWindow.webContents.reload(); } },
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Command+I', click: () => { this.mainWindow.toggleDevTools(); } },
        { label: 'Toggle Developer Tools for Worker', accelerator: 'Alt+Command+J', click: () => { this.workerWindow.toggleDevTools(); } },
        { label: 'Toggle Developer Tools for Opencv Worker', accelerator: 'Alt+Command+J', click: () => { this.opencvWorkerWindow.toggleDevTools(); } },
        { label: 'Show Worker', click: () => { this.workerWindow.show(); } },
        { label: 'Show OpenCvWorker', click: () => { this.opencvWorkerWindow.show(); } }
      ]
    };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        { label: 'Main window', click: () => { this.mainWindow.show(); } },
        { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('http://electron.atom.io');
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/atom/electron/tree/master/docs#readme'
            );
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://discuss.atom.io/c/electron');
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/atom/electron/issues');
          }
        }
      ]
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.toggleDevTools();
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                }
              ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('http://electron.atom.io');
            }
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/atom/electron/tree/master/docs#readme'
              );
            }
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://discuss.atom.io/c/electron');
            }
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/atom/electron/issues');
            }
          }
        ]
      }
    ];

    return templateDefault;
  }
}
