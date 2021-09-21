import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import SignUpPage from "./pages/SignUpPage";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme();

const RoutedApp = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Route path="/" component={SignUpPage} />
    </BrowserRouter>
  </ThemeProvider>
);

ReactDOM.render(
  <React.StrictMode>
    <RoutedApp />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
