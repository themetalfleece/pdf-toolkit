import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: "#2c3e50",
      secondary: "#34495e",
    },
    background: {
      default: "#f8f9fa",
      paper: "#f6f6f6",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#ffffff",
      secondary: "#dcdcdc",
    },
    background: {
      default: "#1a1a1a",
      paper: "#2a2a2a",
    },
  },
});

const materialTheme = (mode: "light" | "dark") =>
  mode === "light" ? lightTheme : darkTheme;

export interface ThemeProviderProps {
  children: React.ReactNode;
}

import { useMediaQuery } from "@mui/material";
import { useMemo } from "react";

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () => materialTheme(prefersDarkMode ? "dark" : "light"),
    [prefersDarkMode]
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
