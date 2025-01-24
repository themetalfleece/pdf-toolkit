import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";

const materialTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <MuiThemeProvider theme={materialTheme}>{children}</MuiThemeProvider>;
};
