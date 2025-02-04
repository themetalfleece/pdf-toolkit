import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";

const materialTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    text: {
      primary: "#2c3e50",
      secondary: "#34495e",
    },
    background: {
      default: "#f8f9fa",
      paper: "#fefefe",
    },
  },
});

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <MuiThemeProvider theme={materialTheme}>{children}</MuiThemeProvider>;
};
