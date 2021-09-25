
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	Link,
	TextField
} from "@mui/material";
import { useFormik } from "formik";
import { signUp } from "../../client/AuthClient";
import { signupFormConfig } from "../../models/form/signup";

const SignUpForm = () => {
	const formik = useFormik({
		...signupFormConfig,
		onSubmit: async (values) => {
			await signUp(values)
		}
	});

	return (
		<Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<TextField
						autoComplete="fname"
						name="firstName"
						fullWidth
						value={formik.values.firstName}
						onChange={formik.handleChange}
						error={formik.touched.firstName && Boolean(formik.errors.firstName)}
						helperText={formik.touched.firstName && formik.errors.firstName}
						id="firstName"
						label="First Name"
						autoFocus
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						fullWidth
						id="lastName"
						label="Last Name"
						name="lastName"
						autoComplete="lname"
						value={formik.values.lastName}
						onChange={formik.handleChange}
						error={formik.touched.lastName && Boolean(formik.errors.lastName)}
						helperText={formik.touched.lastName && formik.errors.lastName}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						value={formik.values.email}
						onChange={formik.handleChange}
						error={formik.touched.email && Boolean(formik.errors.email)}
						helperText={formik.touched.email && formik.errors.email}
						autoComplete="email"
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="new-password"
						value={formik.values.password}
						onChange={formik.handleChange}
						error={formik.touched.password && Boolean(formik.errors.password)}
						helperText={formik.touched.password && formik.errors.password}
					/>
				</Grid>
				<Grid item xs={12}>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								name="agreement"
								value={formik.values.agreement}
								onChange={formik.handleChange}
							/>
						}
						label="I agree to the terms and services."
					/>
				</Grid>
			</Grid>
			<Button
				disabled={formik.isSubmitting || !formik.values.agreement}
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
			>
				Sign Up
			</Button>
			<Grid container justifyContent="flex-end">
				<Grid item>
					<Link href="/login" variant="body2">
						Already have an account? Sign in
					</Link>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SignUpForm;
