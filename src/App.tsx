import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Routes from "./routes";
import Copyright from "./components/misc/copyright";

const theme = createTheme();

const App = () => (
	<ThemeProvider theme={theme}>
		<Router>
			<Routes />
            <Copyright sx={{ mt: 5 }} />
		</Router>
	</ThemeProvider>
);

export default App;