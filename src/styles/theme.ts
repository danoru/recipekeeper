import { createTheme } from "@mui/material/styles";

export const savryTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0e0e0e",
      paper: "#161616",
    },
    primary: {
      main: "#c8a96e",
      light: "#d9bc89",
      dark: "#a88848",
      contrastText: "#0e0e0e",
    },
    secondary: {
      main: "#888580",
      light: "#b0ada8",
      dark: "#4a4744",
    },
    divider: "rgba(255,255,255,0.07)",
    text: {
      primary: "#f0ede6",
      secondary: "#888580",
      disabled: "#4a4744",
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: { fontFamily: "'Playfair Display', serif" },
    h2: { fontFamily: "'Playfair Display', serif" },
    h3: { fontFamily: "'Playfair Display', serif" },
    h4: { fontFamily: "'Playfair Display', serif" },
    overline: {
      fontSize: "0.625rem",
      letterSpacing: "0.14em",
      fontWeight: 500,
      color: "#4a4744",
    },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background: #0e0e0e; -webkit-font-smoothing: antialiased; }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.07)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500, letterSpacing: "0.04em" },
        contained: {
          background: "#c8a96e",
          color: "#0e0e0e",
          "&:hover": { background: "#d9bc89" },
        },
        outlined: {
          borderColor: "rgba(200,169,110,0.3)",
          color: "#c8a96e",
          "&:hover": {
            borderColor: "#c8a96e",
            background: "rgba(200,169,110,0.08)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#f0ede6",
          textDecorationColor: "rgba(240,237,230,0.3)",
          "&:hover": { color: "#c8a96e" },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(255,255,255,0.07)" },
      },
    },
  },
});
