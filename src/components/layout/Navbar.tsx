import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import LogRecipeButton from "./LogRecipeButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";

function getPages(session: any) {
  if (session) {
    return [
      {
        id: 1,
        title: session.user.username,
        link: `/${session.user.username}`,
      },
      { id: 2, title: <FoodBankIcon fontSize="large" />, link: "/activity" },
      { id: 3, title: "Creators", link: "/creators" },
      { id: 4, title: "Recipes", link: "/recipes" },
      // { id: 5, title: "Lists", link: "/lists" },
      { id: 6, title: "Members", link: "/members" },
      // { id: 7, title: "Journal", link: "/journal" },
      { id: 8, title: "Logout", link: "/api/auth/signout" },
    ];
  } else {
    return [
      { id: 1, title: "Sign In", link: "/login" },
      { id: 2, title: "Create Account", link: "/register" },
      { id: 3, title: "Creators", link: "/creators" },
      { id: 4, title: "Recipes", link: "/recipes" },
      // { id: 5, title: "Lists", link: "/lists" },
      { id: 6, title: "Members", link: "/members" },
      // { id: 7, title: "Journal", link: "/journal" },
    ];
  }
}

function Navbar() {
  const { data: session, status } = useSession();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const pages = getPages(session);

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "center" }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Savry
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.id} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    sx={{ textDecoration: "none" }}
                  >
                    <Link href={page.link} underline="none">
                      {page.title}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.id}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  textDecoration: "none",
                }}
              >
                <Link href={page.link} underline="none">
                  {page.title}
                </Link>
              </Button>
            ))}
          </Box>
          <LogRecipeButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
