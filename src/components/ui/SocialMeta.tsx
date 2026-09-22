import Head from "next/head";

interface Props {
  title: string;
  description: string;
  /** Absolute URL of a 1200×630 share image. */
  image: string;
}

/** Open Graph + Twitter tags so shared links unfurl as rich cards. */
export default function SocialMeta({ title, description, image }: Props) {
  return (
    <Head>
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={image} property="og:image" />
      <meta content="1200" property="og:image:width" />
      <meta content="630" property="og:image:height" />
      <meta content="website" property="og:type" />
      <meta content="Savry" property="og:site_name" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={image} name="twitter:image" />
    </Head>
  );
}
