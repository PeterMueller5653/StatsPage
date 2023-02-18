import { createTheme, NextUIProvider } from '@nextui-org/react'
import type { AppProps } from 'next/app'
import 'styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    type: 'dark',
    theme: {
      colors: {
        link: '',
      },
    },
  })

  return (
    <NextUIProvider theme={theme}>
      <Component {...pageProps} />
    </NextUIProvider>
  )
}
