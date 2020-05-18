import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import AuthContext from "./AuthContext";
import DataContext from "./DataContext";

import General from "./General";
import Api, { GetList } from "./Api";

const Supervisor = lazy(() => import("./Manager_Supervisor"));
const Guard = lazy(() => import("./Manager_Guard"));
const Authentication = lazy(() => import("./Authentication"));

function App(props) {
  const [auth, setAuth] = useState({});
  const [departments, setDepartments] = useState();
  const [locations, setLocations] = useState();

  const handleSubmit = (e) => {
    localStorage.setItem("auth", JSON.stringify(e));
    setAuth(e);
  };

  useEffect(() => {
    GetList("department").then((x) => setDepartments(x));
    GetList("location").then((x) => setLocations(x));

    const oldAuth = JSON.parse(localStorage.getItem("auth"));
    if (oldAuth) {
      setAuth(oldAuth);
    }
  }, []);

  return (
    <BrowserRouter>
      {/* {"app render " + JSON.stringify(auth)} */}
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <AuthContext.Provider value={{ auth, setAuth, handleSubmit }}>
            <General.Header />
            {auth.type ? (
              <Redirect to={`/${auth.type}`} />
            ) : (
              <Redirect to="/Login" />
            )}
            <DataContext.Provider
              value={{ departments: departments, locations: locations }}
            >
              <Route exact path="/Login" component={Authentication} />
              <Route exact path="/Supervisor" component={Supervisor} />
              <Route exact path="/Guard" component={Guard} />
            </DataContext.Provider>
          </AuthContext.Provider>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
