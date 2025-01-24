import "@/App.css";
import { Home } from "@/components/Home/Home.page";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider.component";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <>
      <ThemeProvider>
        <CssBaseline />
        <Home />
      </ThemeProvider>
    </>
  );
}

export default App;
