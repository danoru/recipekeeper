import { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import { Creators, Recipes, Users } from "@prisma/client";
import type { SDiaryEntry } from "../../types/serialized";
import FriendRecipeActivity from "./FriendRecipeActivity";
import PopularCreatorActivity from "./PopularCreatorActivity";
import PopularRecipeActivity from "./PopularRecipeActivity";
import dayjs from "dayjs";

interface Props {
  creators: Creators[];
  recentEntries: (SDiaryEntry & { users: Users; recipes: Recipes })[];
  recipes: Recipes[];
  username: string;
}

function LoggedInHomePage({
  creators,
  recentEntries,
  recipes,
  username,
}: Props) {
  return (
    <Box
      component="main"
      sx={{
        maxWidth: "1080px",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        pt: 5,
        pb: 10,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 260px" },
        gap: { xs: 4, lg: 6 },
        alignItems: "start",
      }}
    >
      {/* ── MAIN FEED ── */}
      <Box sx={{ minWidth: 0 }}>
        {/* Welcome */}
        <Typography
          sx={{
            fontSize: "0.9375rem",
            color: "text.secondary",
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          Welcome back,{" "}
          <MuiLink
            component={NextLink}
            href={`/${username}`}
            underline="none"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              color: "text.primary",
              "&:hover": { color: "primary.main" },
            }}
          >
            {username}
          </MuiLink>
          .{" "}
          <Box component="span" sx={{ color: "#4a4744" }}>
            Here&apos;s what your friends have been cooking.
          </Box>
        </Typography>

        <FriendRecipeActivity recentEntries={recentEntries} />
        <PopularRecipeActivity recipes={recipes} />
        <PopularCreatorActivity creators={creators} />
      </Box>

      {/* ── SIDEBAR ── */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          gap: 2.5,
          position: "sticky",
          top: "72px",
        }}
      >
        {/* Your year */}
        <SidebarBlock title="Your year">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              mb: 1.5,
            }}
          >
            {[
              { label: "Recipes", value: "—" },
              { label: "Following", value: "—" },
              { label: "Followers", value: "—" },
            ].map(({ label, value }) => (
              <Box
                key={label}
                sx={{
                  bgcolor: "#1e1e1e",
                  borderRadius: "6px",
                  p: 1.25,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.375rem",
                    color: "text.primary",
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#4a4744",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
          <MuiLink
            component={NextLink}
            href={`/${username}`}
            underline="none"
            sx={{
              display: "block",
              textAlign: "center",
              fontSize: "0.6875rem",
              color: "#4a4744",
              letterSpacing: "0.06em",
              transition: "color 0.15s",
              "&:hover": { color: "primary.main" },
            }}
          >
            View full profile →
          </MuiLink>
        </SidebarBlock>

        {/* Recent diary */}
        {recentEntries.length > 0 && (
          <SidebarBlock title="Recent diary">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {recentEntries.slice(0, 4).map((entry, i) => {
                const slug = entry.recipes.name
                  .replace(/\s+/g, "-")
                  .toLowerCase();
                const date = dayjs(entry.date).format("MMM D");
                return (
                  <Box
                    key={i}
                    component={NextLink}
                    href={`/recipes/${slug}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      p: "8px 6px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "#1e1e1e" },
                    }}
                  >
                    <Box
                      component="img"
                      src={entry.recipes.image}
                      alt={entry.recipes.name}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "5px",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "0.8125rem",
                          color: "text.primary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: 1.4,
                        }}
                      >
                        {entry.recipes.name}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.625rem",
                        color: "#4a4744",
                        flexShrink: 0,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {date}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </SidebarBlock>
        )}
      </Box>
    </Box>
  );
}

/* ── Small helper: sidebar card wrapper ── */
function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        bgcolor: "#161616",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        p: 2.25,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.5625rem",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#4a4744",
          mb: 1.75,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default memo(LoggedInHomePage);
