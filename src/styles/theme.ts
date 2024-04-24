import { createTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles";

export const theme: ThemeOptions = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#66fcf1",
    },
    secondary: {
      main: "#45a29e",
    },
    background: {
      default: "#0b0c10",
      paper: "#1f2833",
    },
    text: {
      primary: "#c5c6c7",
      secondary: "rgba(255,255,255,0.7)",
    },
  },
});

export default theme;
