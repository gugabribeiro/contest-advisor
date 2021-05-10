import React from "react";
import { Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, currentUser, ...props }) => {
  console.log(currentUser ? "yes" : "no");
  return (
    <Route
      {...props}
      render={(props) => {
        currentUser && <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
