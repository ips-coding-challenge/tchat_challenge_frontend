import React, { useContext, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { store } from "../store/store";

const PublicRoute = ({ children, ...rest }) => {
  const {
    state: { user },
  } = useContext(store);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, []);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !user ? children : <Redirect to={{ pathname: "/" }} />
      }
    />
  );
};

export default PublicRoute;
