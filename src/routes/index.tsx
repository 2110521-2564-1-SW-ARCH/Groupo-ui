import { Route, Switch } from "react-router";
import Login from "../pages/LoginPage";
import SignUp from "../pages/SignUpPage";

const Routes = () => {
    return <Switch>
        <Route exact path="/" component={SignUp} />
        <Route path="/login" component={Login}/>
    </Switch>;
};

export default Routes;
