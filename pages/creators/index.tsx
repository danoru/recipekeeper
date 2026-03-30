import { Box, Grid, Typography } from "@mui/material";
import { Creators } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";

import SectionHeader from "@/components/ui/SectionHeader";
import { getAllCreators, getFeaturedCreators } from "@/data/creators";
import { creatorHref } from "@/data/helpers";

interface Props {
  creators: Creators[];
  featured: Creators[];
}

export default function CreatorsPage({ creators, featured }: Props) {
  return (
    <>
      <Head>
        <title>Creators • Savry</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "1080px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: 5,
          pb: 12,
        }}
      >
        {/* Featured */}
        {featured.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <SectionHeader label="Featured creators" />
            <Grid container spacing={1.5}>
              {featured.slice(0, 4).map((creator) => (
                <Grid key={creator.link} size={{ xs: 6, sm: 3 }}>
                  <CreatorCard featured creator={creator} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* All creators */}
        <SectionHeader label="All creators" />
        <Grid container spacing={1.5}>
          {creators.map((creator) => (
            <Grid key={creator.link} size={{ xs: 6, sm: 4, md: 3 }}>
              <CreatorCard creator={creator} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

function CreatorCard({ creator, featured = false }: { creator: Creators; featured?: boolean }) {
  return (
    <Box
      component={Link}
      href={creatorHref(creator.link ?? creator.name)}
      sx={{
        position: "relative",
        display: "block",
        borderRadius: "10px",
        overflow: "hidden",
        aspectRatio: "3/4",
        border: featured ? "1px solid rgba(200,169,110,0.3)" : "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
        bgcolor: "#161616",
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": {
          borderColor: featured ? "rgba(200,169,110,0.6)" : "rgba(255,255,255,0.16)",
          transform: "translateY(-2px)",
          "& .creator-img": { transform: "scale(1.04)" },
        },
      }}
    >
      <Box
        className="creator-img"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${creator.image})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          filter: "grayscale(10%)",
          transition: "transform 0.4s ease",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)",
        }}
      />
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 1.5 }}>
        {featured && (
          <Typography
            sx={{
              fontSize: "0.5625rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "primary.main",
              mb: 0.5,
            }}
          >
            Featured
          </Typography>
        )}
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.9375rem",
            color: "#fff",
            lineHeight: 1.3,
          }}
        >
          {creator.name}
        </Typography>
      </Box>
    </Box>
  );
}

export async function getServerSideProps() {
  const [allCreators, featuredCreators] = await Promise.all([
    getAllCreators(),
    getFeaturedCreators(),
  ]);

  return {
    props: {
      creators: allCreators,
      featured: featuredCreators,
    },
  };
}
