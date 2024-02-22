import { Fragment } from "react";
import Head from "next/head";

function ErrorPage() {
  return (
    <Fragment>
      <Head>
        <title>Savry: 404</title>
      </Head>
      <blockquote cite="https://www.youtube.com/watch?v=g0-F88c6Hrk">
        "If a man does not have the sauce, then he is lost.
        <br />
        But, the same man can get lost in the sauce."
      </blockquote>
      <p>
        Are you lost? Let's get you back on <a href="/">track</a>.
      </p>
      <p>404 | This page could not be found.</p>
    </Fragment>
  );
}

export default ErrorPage;
