import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { store } from "../store/store";

const PrivateRoute = ({ children, ...rest }) => {
  const {
    state: { user },
  } = useContext(store);
  console.log(`children`, children);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
