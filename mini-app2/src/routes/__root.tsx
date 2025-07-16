import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { TonConnectUIProvider, THEME } from "@tonconnect/ui-react"

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TonTip Mini App',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [
      {
        src: 'https://telegram.org/js/telegram-web-app.js',
      },
    ],
  }),

  component: () => (
    <RootDocument>
      <TonConnectUIProvider
        manifestUrl="https://basically-enough-clam.ngrok-free.app/tonconnect-manifest.json"
        uiPreferences={{ theme: THEME.DARK }}
        walletsListConfiguration={{
          includeWallets: [
            {
              appName: "tonwallet",
              name: "TON Wallet",
              imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
              aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
              universalLink: "https://wallet.ton.org/ton-connect",
              jsBridgeKey: "tonwallet",
              bridgeUrl: "https://bridge.tonapi.io/bridge",
              platforms: ["chrome", "android"]
            },
            {
              appName: "nicegramWallet",
              name: "Nicegram Wallet",
              imageUrl: "https://static.nicegram.app/icon.png",
              aboutUrl: "https://nicegram.app",
              universalLink: "https://nicegram.app/tc",
              deepLink: "nicegram-tc://",
              jsBridgeKey: "nicegramWallet",
              bridgeUrl: "https://tc.nicegram.app/bridge",
              platforms: ["ios", "android", "macos", "windows", "linux"]
            },
            {
              appName: 'Tonkeeper',
              name: 'Tonkeeper',
              imageUrl: 'https://tonkeeper.com/assets/tonconnect-icon.png',
              aboutUrl: 'https://tonkeeper.com',
              universalLink: 'https://app.tonkeeper.com/ton-connect',
              bridgeUrl: "https://bridge.tonapi.io/bridge",
              platforms: ["ios", "android", "chrome", "firefox"]
            }
          ]
        }}
        actionsConfiguration={{
          twaReturnUrl: 'https://t.me/your_bot_name/app'
        }}
      >
        <Outlet />
        <TanStackRouterDevtools />
      </TonConnectUIProvider>
    </RootDocument>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
