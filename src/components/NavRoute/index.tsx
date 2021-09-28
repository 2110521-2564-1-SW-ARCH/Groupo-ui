import { ReactNode } from "react";
import { Route } from "react-router";
import Nav from "../Nav";

type Props = {
  exact: boolean;
  path: string;
  component: any;
};

const NavRoute = ({ exact, path, component: Component }: Props) => (
  <Route
    exact={exact}
    path={path}
    render={(props) => (
      <div>
        <Nav />
        <Component {...props} />
      </div>
    )}
  />
);

export default NavRoute;
