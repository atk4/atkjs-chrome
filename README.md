## Agile Toolkit Extension for Chrome.

Help debuging javascript when using Agile Toolkit framework.

### Callback debug

The ATK develppper panel will properly formatted json response into readable code in order
to help debugging javascript action return by server.

![atk-panel](media/atk-panel.png)

### Plugin property content

This is a sidebar panel available when using the Element panel in Chrome. 
It will display jQuery data property of a selected element.

![atk-sidebar](media/atk-plugin-properties.png)

### Manual Installation

1. Clone this repo;
2. Open Chrome extension page;
    via Settings Extensions or type url: chrome://extensions.
3. Make sure "developer mode" is On in Extensions page;
4. Click "load unpacked extension", and choose `atkjs-chrome`.

### Usage

Atk Panel

1. Open the developer tools (View/Developer\Developer Tools);
2. Look for the ATK panel in developer tools window;
3. Fire callback request in your atk application.

Atk plugin properties side panel

1. Open the developer tools (View/Developer\Developer Tools);
2. Select the Element panel in developer tools window;
3. Look for Atk plugin Properties side panel;
4. Select an element at the Element panel and the Atk plugin properties panel will display jQuery data
set to this element.


### License

[MIT](http://opensource.org/licenses/MIT)
