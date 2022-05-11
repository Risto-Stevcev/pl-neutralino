// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library

function showInfo() {
  document.getElementById('info').innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `;
}

function openDocs() {
  Neutralino.os.open('https://neutralino.js.org/docs');
}

function openTutorial() {
  Neutralino.os.open(
    'https://www.youtube.com/watch?v=txDlNNsgSh8&list=PLvTbqpiPhQRb2xNQlwMs0uVV0IN8N-pKj'
  );
}

function setTray() {
  if (NL_MODE != 'window') {
    console.log('INFO: Tray menu is only available in the window mode.');
    return;
  }
  let tray = {
    icon: '/resources/icons/trayIcon.png',
    menuItems: [
      { id: 'VERSION', text: 'Get version' },
      { id: 'SEP', text: '-' },
      { id: 'QUIT', text: 'Quit' },
    ],
  };
  Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
  switch (event.detail.id) {
    case 'VERSION':
      Neutralino.os.showMessageBox(
        'Version information',
        `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`
      );
      break;
    case 'QUIT':
      Neutralino.app.exit();
      break;
  }
}

function onWindowClose() {
  Neutralino.app.exit();
}

(async () => {
  try {
    Neutralino.init();

    console.log(await Neutralino.extensions.getStats());
    let extension = 'js.neutralino.sampleextension';
    let event = 'eventToExtension';
    let data = {
      testValue: 10,
    };

    Neutralino.events.on('eventFromExtension', (event) =>
      console.log('eventFromExtension:', event.detail)
    );
    console.log(await Neutralino.extensions.dispatch(extension, event, data));

    try {
    await Neutralino.extensions.dispatch('js.neutralino.plneu', 'foo', {})
    }
    catch (e) { console.log(e) }

    //await Neutralino.os.open('https://neutralino.js.org');

    console.log('foof', await Neutralino.extensions.getStats())
  } catch (e) {
    console.log({ e });
  }
  /*
let extension = 'js.neutralino.sampleextension';
let event = 'helloExtension';
let data = {
    testValue: 10
};

Neutralino.extensions.dispatch(extension, event, data).then(console.log);
*/

  Neutralino.events.on('trayMenuItemClicked', onTrayMenuItemClicked);
  Neutralino.events.on('windowClose', onWindowClose);

  if (NL_OS != 'Darwin') {
    // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    //setTray();

    showInfo();
  }
})();
