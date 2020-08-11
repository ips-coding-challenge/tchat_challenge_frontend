import React, { useState, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import client from "./client";
import { store, SET_USER, ADD_USER } from "./store/store";

function App() {
  const { state, dispatch } = useContext(store);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
    const authenticate = async () => {
      try {
        await client.authenticate();
      } catch (e) {
        console.log(`Error`, e);
        setLoading(false);
        setError(e);
      }
    };

    client.on("authenticated", async (login) => {
      console.log("login", login);
      dispatch({ type: SET_USER, payload: login.user });
      setLoading(false);
    });

    authenticate();

    return () => {
      if (client.listeners["authenticated"]) {
        client.removeListener("authenticated");
      }
    };
  }, []);

  if (loading)
    return (
      <div className="bg-mBg h-screen w-screen flex items-center justify-center">
        <div className="lds-dual-ring"></div>
      </div>
    );
  return (
    <div className="text-mGray2 h-auto min-h-screen mx-auto">
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path="/register">
            <Register />
          </PublicRoute>
          <PublicRoute exact path="/login">
            <Login />
          </PublicRoute>
          <PrivateRoute exact path="/profile">
            <Profile />
          </PrivateRoute>
          <PrivateRoute exact path="/">
            <Chat />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
