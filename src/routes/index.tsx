import { Route, Switch } from "react-router";
import NavRoute from "../components/NavRoute";
import BoardListPage from "../pages/BoardListPage";
import CreateBoardPage from "../pages/CreateBoardPage";
import JoinPage from "../pages/JoinPage";
import Login from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import SignUp from "../pages/SignUpPage";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <NavRoute exact path="/profile" component={ProfilePage} />
      <NavRoute exact path="/create" component={CreateBoardPage} />
      <NavRoute exact path="/join" component={JoinPage} />
      <NavRoute exact path="/" component={BoardListPage} />
    </Switch>
  );
};

export default Routes;
