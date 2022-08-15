import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6379d9",
    },
    secondary: {
      main: "#22867c",
    },
    error: {
      main: red[400],
    },
    background: {
      default: "#fefefe",
    },
  },
});

export default theme;
