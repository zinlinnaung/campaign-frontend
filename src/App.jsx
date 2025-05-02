import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom"; // Use BrowserRouter for routing
import theme from "./theme/theme";
import { RouterComponent } from "./router/router"; // Import the updated RouterComponent
import { RecordProvider } from "./context/RecordContext";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Global CSS reset */}
      <Router>
        <RecordProvider>
          <RouterComponent /> {/* RouterComponent contains the routes */}
        </RecordProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
