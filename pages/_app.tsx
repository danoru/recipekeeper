import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Decimal } from "decimal.js";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";

import Layout from "../src/components/layout/Layout";
import createEmotionCache from "../src/createEmotionCache";
import { savryTheme } from "../src/styles/theme";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  return (
    <SessionProvider>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={savryTheme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Layout>
              <Head>
                <title>Savry</title>
                <meta charSet="utf-8" />
                <meta content="initial-scale=1.0, width=device-width" name="viewport" />
                <link href="/favicon.ico" rel="shortcut icon" />
              </Head>
              <Component {...pageProps} />
            </Layout>
          </LocalizationProvider>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}

superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js"
);
