import * as React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { EmotionCache } from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";
import { AppType } from "next/dist/shared/lib/utils";
import createEmotionCache from "../src/createEmotionCache";
import { savryTheme } from "../src/styles/theme";

interface DocumentProps extends DocumentInitialProps {
  emotionStyleTags: React.ReactNode[];
}

const MyDocument = (props: DocumentProps) => {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content={savryTheme.palette.primary.main} />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        />

        <meta name="emotion-insertion-point" content="" />
        {props.emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (
  ctx: DocumentContext,
): Promise<DocumentProps> => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (
        App: AppType | React.ComponentType<{ emotionCache: EmotionCache }>,
      ) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return { ...initialProps, emotionStyleTags };
};

export default MyDocument;
