import { Fragment } from "react";
import Head from "next/head";
import Link from "@mui/material/Link";

function ErrorPage() {
  return (
    <Fragment>
      <Head>
        <title>404: Not Found • Savry</title>
      </Head>
      <blockquote
        style={{
          fontSize: "18px",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        &quot;If a man does not have the sauce, then he is lost.
        <br />
        But, the same man can get lost in the sauce.&quot;
      </blockquote>
      <p style={{ textAlign: "center", fontSize: "16px", marginTop: "20px" }}>
        Are you lost? Let&apos;s get you back on <Link href="/">track</Link>.
      </p>
    </Fragment>
  );
}

export default ErrorPage;
