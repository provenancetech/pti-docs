import React from "react";
import create from "zustand";
import { Alert, Box, Slide, Snackbar } from "@mui/material";

const useSnackAlertStore = create((set) => ({
  message: "",
  openSnackBar: false,
  options: {
    duration: 8000,
    severity: "error",
    anchorOrigin: { vertical: "top", horizontal: "right" },
  },
  closeSnackBarHandler: () => set({ openSnackBar: false }),
}));

export const showSuccessSnackAlert = (message) => {
  showSnackAlert(message, { severity: "success" });
};

export const showWarningSnackAlert = (message) => {
  showSnackAlert(message, { severity: "warning" });
};

export const showInfoSnackAlert = (message) => {
  showSnackAlert(message, { severity: "info" });
};

export const showErrorSnackAlert = (message) => {
  showSnackAlert(message, { severity: "error" });
};

export const showSnackAlert = (message, options = {}) => {
  useSnackAlertStore.setState({
    message,
    openSnackBar: true,
    options: {
      duration: options.duration || 8000,
      severity: options.severity || "error",
      anchorOrigin: options.anchorOrigin || { vertical: "top", horizontal: "right" },
    },
  });
};

const SnackAlert = () => {
  const { message, openSnackBar, options, closeSnackBarHandler } = useSnackAlertStore();
  return (
    <Snackbar
      open={openSnackBar}
      autoHideDuration={options.duration}
      onClose={closeSnackBarHandler}
      anchorOrigin={options.anchorOrigin}
      key={new Date().getTime()}
      TransitionComponent={(props) => (
        <Slide {...props} direction="down">
          <Alert onClose={closeSnackBarHandler} severity={options.severity} sx={{ width: "100%" }}>
            {message.split("\n").map((messagePart, i) => (
              <Box key={i}>{messagePart}</Box>
            ))}
          </Alert>
        </Slide>
      )}
    />
  );
};

export default SnackAlert;
