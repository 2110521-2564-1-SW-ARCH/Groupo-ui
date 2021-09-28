import { Redirect } from "react-router-dom";

const RequireAuth = ({ Component, ...rest }: any) => {
    if (!localStorage.getItem("user")) {
		return <Redirect to="/login" />;
	}
	return <Component {...rest} />;
}

export default RequireAuth;