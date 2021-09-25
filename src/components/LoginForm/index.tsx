import { Box, Button, Grid, Link, TextField } from "@mui/material";
import { useState } from "react";
import { login } from "../../client/AuthClient";

const LoginForm = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    return (
        <Box component="form"
            sx={{ mt: 3 }}
            onSubmit={() => login(email, password)} 
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        id="email"
                        name="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
			>
				Log in
			</Button>
			<Grid container justifyContent="flex-end">
				<Grid item>
					<Link href="/signup" variant="body2">
						Don't have an account? Sign up
					</Link>
				</Grid>
			</Grid>
        </Box>
    )
};

export default LoginForm;