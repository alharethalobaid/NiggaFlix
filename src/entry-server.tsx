// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';
import { _light } from '~/themes';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" data-theme={_light}>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
         
          <link
            href="https://cdn.jsdelivr.net/npm/daisyui@5"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/daisyui@5/themes.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/daisyui@5/colors/properties.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/daisyui@5/colors/properties-extended.css"
            rel="stylesheet"
            type="text/css"
          />
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

          {assets}
        </head>

        {/*
          The below body class using gradient is a work around for when using both of daisyui's "from-primary" "to-secondary" at the same time to work properly on refresh when using daisyui v5 CDN (properties-extended.css).
        */}
        <body class="bg-gradient-to-b from-white to-white">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
