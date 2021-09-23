import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Container, CssBaseline, Typography } from "@mui/material";
import SignUpForm from "../../components/SignUpForm";

const SignUp = () => {
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
					Sign up
				</Typography>
				<SignUpForm />
			</Box>
		</Container>
	);
};

export default SignUp;
