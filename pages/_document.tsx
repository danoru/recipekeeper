import { EmotionCache } from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";
import { AppType } from "next/dist/shared/lib/utils";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import * as React from "react";

import createEmotionCache from "../src/createEmotionCache";
import { savryTheme } from "../src/styles/theme";

interface DocumentProps extends DocumentInitialProps {
  emotionStyleTags: React.ReactNode[];
}

const MyDocument = (props: DocumentProps) => {
  return (
    <Html lang="en">
      <Head>
        <meta content={savryTheme.palette.primary.main} name="theme-color" />
        <link href="/favicon.ico" rel="shortcut icon" />

        {/* Fonts */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        <meta content="" name="emotion-insertion-point" />
        {props.emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentProps> => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: AppType | React.ComponentType<{ emotionCache: EmotionCache }>) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
    />
  ));

  return { ...initialProps, emotionStyleTags };
};

export default MyDocument;
