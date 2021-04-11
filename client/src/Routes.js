import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import ListUsers from "./containers/ListUsers";
import Subscribe from "./containers/Subscribe";
import NotFound from "./containers/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/subscribe">
        <Subscribe />
      </Route>
      <Route exact path="/listusers">
        <ListUsers />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}