import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import PropTypes from "prop-types";
import * as React from "react";

import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";

import createEmotionCache from "../src/createEmotionCache";
import Layout from "../src/components/layout/Layout";
import theme from "../src/styles/theme";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const emotionCache = clientSideEmotionCache;

  return (
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
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
