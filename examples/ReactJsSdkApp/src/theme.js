import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(0, 235, 190)",
    },
    secondary: {
      main: "rgb(160, 100, 176)",
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
