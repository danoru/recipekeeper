import * as React from "react";
import createEmotionCache from "../src/createEmotionCache";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import Layout from "../src/components/layout/Layout";
import superjson from "superjson";
import { savryTheme } from "../src/styles/theme";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Decimal } from "decimal.js";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";

superjson.registerCustom<Decimal, number>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toNumber(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js",
);

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { session, ...pageProps },
}: MyAppProps) {
  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={savryTheme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Layout>
              <Head>
                <title>Savry</title>
                <meta charSet="utf-8" />
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
                <link rel="shortcut icon" href="/favicon.ico" />
              </Head>
              <Component {...pageProps} />
              <SpeedInsights />
            </Layout>
          </LocalizationProvider>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
