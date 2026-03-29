import Box from "@mui/material/Box";
import Head from "next/head";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import Typography from "@mui/material/Typography";

export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>404 — Savry</title>
      </Head>

      <Box
        sx={{
          minHeight: "calc(100vh - 52px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 3,
          gap: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: "4rem", sm: "6rem" },
            lineHeight: 1,
            color: "rgba(255,255,255,0.06)",
            letterSpacing: "-0.02em",
            userSelect: "none",
          }}
        >
          404
        </Typography>

        <Box
          sx={{
            maxWidth: 420,
            borderLeft: "2px solid rgba(200,169,110,0.3)",
            pl: 2.5,
            textAlign: "left",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "text.secondary",
              lineHeight: 1.7,
            }}
          >
            &ldquo;If a man does not have the sauce, then he is lost.
            <br />
            But, the same man can get lost in the sauce.&rdquo;
          </Typography>
        </Box>

        <Typography sx={{ fontSize: "0.875rem", color: "text.disabled" }}>
          Are you lost?{" "}
          <MuiLink
            component={NextLink}
            href="/"
            underline="hover"
            sx={{ color: "primary.main" }}
          >
            Head back home.
          </MuiLink>
        </Typography>
      </Box>
    </>
  );
}
