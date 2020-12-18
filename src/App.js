import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import AuthContext from "./contexts/AuthContext";
import DataContext from "./contexts/DataContext";

import General from "./General";
import { GetList } from "./Api/Api";

const Supervisor = lazy(() => import("./pages/Supervisor/SupervisorPage"));
const Guard = lazy(() => import("./pages/Guard/GuardPage"));
const Authentication = lazy(() => import("./pages/Login/LoginPage"));

function App(props) {
  const [auth, setAuth] = useState({});
  // const [departments, setDepartments] = useState();
  const [locations, setLocations] = useState();

  const handleSubmit = (e) => {
    localStorage.setItem("auth", JSON.stringify(e));
    setAuth(e);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const oldAuth = JSON.parse(localStorage.getItem("auth"));
      if (!oldAuth && auth.id) {
        window.location.reload();
      } else if (oldAuth && !auth.id) {
        setAuth(oldAuth);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [auth]);

  const getList = async () => {
    await GetList("location").then((x) => {
      setLocations(x);
    });
  };

  useEffect(() => {
    getList();
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
            <DataContext.Provider value={{ locations: locations }}>
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
