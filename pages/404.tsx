import { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";

function ErrorPage() {
  return (
    <Fragment>
      <Head>
        <title>Savry: 404</title>
      </Head>
      <blockquote cite="https://www.youtube.com/watch?v=g0-F88c6Hrk">
        &quot;If a man does not have the sauce, then he is lost.
        <br />
        But, the same man can get lost in the sauce.&quot;
      </blockquote>
      <p>
        Are you lost? Let&apos;s get you back on <Link href="/">track</Link>.
      </p>
      <p>404 | This page could not be found.</p>
    </Fragment>
  );
}

export default ErrorPage;
