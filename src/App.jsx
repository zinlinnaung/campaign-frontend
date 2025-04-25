import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom"; // Use BrowserRouter for routing
import theme from "./theme/theme";
import { RouterComponent } from "./router/router"; // Import the updated RouterComponent

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Global CSS reset */}
      <Router>
        <RouterComponent /> {/* RouterComponent contains the routes */}
      </Router>
    </ThemeProvider>
  );
};

export default App;
