import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import NextLink from "next/link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LogRecipeButton from "./LogRecipeButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface NavPage {
  id: number;
  title: string;
  link: string;
}

function getPages(session: any): NavPage[] {
  if (session) {
    return [
      {
        id: 1,
        title: session.user.username,
        link: `/${session.user.username}`,
      },
      { id: 2, title: "Creators", link: "/creators" },
      { id: 3, title: "Recipes", link: "/recipes" },
      { id: 4, title: "Members", link: "/members" },
      { id: 5, title: "Logout", link: "/api/auth/signout" },
    ];
  }
  return [
    { id: 1, title: "Login", link: "/login" },
    { id: 2, title: "Create Account", link: "/register" },
    { id: 3, title: "Creators", link: "/creators" },
    { id: 4, title: "Recipes", link: "/recipes" },
    { id: 5, title: "Members", link: "/members" },
  ];
}

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const pages = getPages(session);

  const isActive = (href: string) => router.pathname === href;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 100,
          bgcolor: "rgba(14,14,14,0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar
            disableGutters
            sx={{
              height: 52,
              px: { xs: 2, md: 4 },
              gap: 1,
            }}
          >
            {/* Logo */}
            <Typography
              component={NextLink}
              href="/"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.25rem",
                letterSpacing: "0.06em",
                color: "text.primary",
                textDecoration: "none",
                mr: 3,
                flexShrink: 0,
                "&:hover": { color: "primary.main" },
                transition: "color 0.15s",
              }}
            >
              Savry
            </Typography>

            {/* Desktop nav links */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.id}
                  component={NextLink}
                  href={page.link}
                  disableRipple
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isActive(page.link)
                      ? "text.primary"
                      : "text.secondary",
                    px: 1.25,
                    py: 0.75,
                    minWidth: 0,
                    borderRadius: "6px",
                    transition: "color 0.15s, background 0.15s",
                    "&:hover": {
                      color: "text.primary",
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* Right zone: Log button + mobile hamburger */}
            <Box
              sx={{
                ml: "auto",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {session && <LogRecipeButton />}

              {/* Mobile hamburger */}
              <IconButton
                size="small"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                }}
                aria-label="Open navigation menu"
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 240,
            bgcolor: "#161616",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Typography
            component={NextLink}
            href="/"
            onClick={() => setDrawerOpen(false)}
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.125rem",
              color: "text.primary",
              textDecoration: "none",
              display: "block",
              mb: 2,
            }}
          >
            Savry
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            {pages.map((page) => (
              <ListItem key={page.id} disablePadding>
                <ListItemButton
                  component={NextLink}
                  href={page.link}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    borderRadius: "6px",
                    px: 1.5,
                    py: 0.875,
                    color: isActive(page.link)
                      ? "text.primary"
                      : "text.secondary",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: "text.primary",
                    },
                  }}
                >
                  <ListItemText
                    primary={page.title}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isActive(page.link) ? 500 : 400,
                      letterSpacing: "0.04em",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {session && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <LogRecipeButton fullWidth />
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
