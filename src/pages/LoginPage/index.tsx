import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Container, CssBaseline, Typography } from "@mui/material";
import LoginForm from "../../components/LoginForm";

const Login = () => {
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <LoginForm />
            </Box>
        </Container>);
};

export default Login;