import * as yup from "yup";

export const signupFormConfig = {
    initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        agreement: false
    },
    validationSchema: yup.object({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
        email: yup
            .string()
            .email("Enter a valid email")
            .required("Email is required"),
        password: yup
            .string()
            .min(8, "Password should be of minimum 8 characters length")
            .required("Password is required")
    })
};