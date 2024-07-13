# Stuart <> Workflow.design

### Installation instructions

1. Copy `.env.example` to `.env` and fill in the API key.
2. Install packages with `npm i`
3. If you haven't installed Vite before, install it with `npm i -g vite`
4. Start the project with `vite`
5. To proceed, you'll need to start your browser without CORS. To start Chrome without CORS:
    - **Windows**: `chrome.exe --disable-web-security --user-data-dir="C:/ChromeDevSession"`
    - **MacOS**: `open -na "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/ChromeDevSession"`
    - **Linux**: `google-chrome --disable-web-security --user-data-dir="/tmp/ChromeDevSession"`

The app should then be available at `localhost:5173`
