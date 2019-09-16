import React from "react";
import { Route, Redirect } from "react-router-dom";
import authService from "../../services/authService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!authService.getCurrentUser())
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            ></Redirect>
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    ></Route>
  );
};

export default ProtectedRoute;
