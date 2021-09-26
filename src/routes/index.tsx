import { Route, Switch } from "react-router";
import NavRoute from "../components/NavRoute";
import RequireAuth from "../components/RequireAuth";
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
      <NavRoute exact path="/profile" component={() => (
        <RequireAuth component={ProfilePage} />
      )} />
      <NavRoute exact path="/create" component={() => (
        <RequireAuth component={CreateBoardPage} />
      )} />
      <NavRoute exact path="/join" component={() => (
        <RequireAuth component={JoinPage} />
      )} />
      <NavRoute exact path="/" component={() => (
        <RequireAuth Component={BoardListPage} />
      )} />
    </Switch>
  );
};

export default Routes;
