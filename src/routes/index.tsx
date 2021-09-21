import { Route, Switch } from "react-router";
import SignUp from "../pages/SignUpPage";

const Routes = () => {
    return <Switch>
        <Route exact path="/" component={SignUp} />
    </Switch>;
};

export default Routes;
