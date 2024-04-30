import type { AppProps } from "next/app";
import Layout from '@/components/Layout'
import '@/styles/global.scss';
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

export default function App({ Component, pageProps: {
  session,
  ...pageProps
} }: AppProps) {

  return (
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout> 
      </SessionProvider>
  )
}
