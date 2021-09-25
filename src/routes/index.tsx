import { Route, Switch } from "react-router";
import NavRoute from "../components/NavRoute";
import Login from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import ProfilePage from "../pages/ProfilePage";
import SignUp from "../pages/SignUpPage";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <NavRoute exact path="/profile" component={ProfilePage} />
      <Route path="/" component={MainPage} />
    </Switch>
  );
};

export default Routes;
