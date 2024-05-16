import * as React from "react";
import createEmotionCache from "../src/createEmotionCache";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import Layout from "../src/components/layout/Layout";
import PropTypes from "prop-types";
import theme from "../src/styles/theme";
import { CacheProvider } from "@emotion/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";

const clientSideEmotionCache = createEmotionCache();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const emotionCache = clientSideEmotionCache;

  return (
    <SessionProvider session={pageProps.session}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
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
            <CssBaseline />
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
