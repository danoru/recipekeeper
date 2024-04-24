import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#66fcf1",
      light: "rgb(132, 252, 243",
      dark: "rgb(71, 176, 168",
      contrastText: "rgba(0,0,0,0.87)",
    },
    secondary: {
      main: "#45a29e",
      light: "rgb(106,180,177",
      dark: "rgb(48,113,110)",
      contrastText: "#fff",
    },
    background: {
      default: "#0b0c10",
      paper: "#1f2833",
    },
    text: {
      primary: "#c5c6c7",
      secondary: "rgba(255,255,255,0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
  },
});

export default theme;
