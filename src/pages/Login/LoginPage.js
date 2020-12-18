import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";

import Check from "../../components/Formik/Check";
import Select from "../../components/Formik/Select";
import Text from "../../components/Common/Text";

import * as API from "./LoginAPI";
import "../../App.css";

import AuthContext from "../../contexts/AuthContext";
import DataContext from "../../contexts/DataContext";

import Validation from "./LoginValidation";

export default function Login(props) {
  const { handleSubmit } = useContext(AuthContext);
  const data = useContext(DataContext);
  const [location, setLocation] = useState({});
  const [errormsg, setErrormsg] = useState("");

  const handleLoginSubmit = (values) => {
    if (values.type === "Supervisor") {
      API.loginToHRMS(values.username, values.password)
        .then((result) => {
          return result.json();
        })
        .then((res) => {
          // if (res.code === 0 && res.message.userpower > 0) {
          if (res.code === 0) {
            handleSubmit({
              id: res.message.username,
              name: res.message.fullname,
              ...values,
            });
            props.history.push(`/${values.type}`);
          } else {
            setErrormsg("You don't have the right to login.");
          }
        })
        .catch((error) => alert(error));
    } else {
      API.loginAsGuard(values.username, values.password)
        .then((res) => res.json())
        .then((res) => {
          if (res.username) {
            handleSubmit({
              id: res.username,
              name: res.fullname,
              ...values,
            });
            props.history.push(`/${values.type}`);
          } else {
            setErrormsg("You don't have the right to login.");
          }
        });
    }
  };

  return data.locations ? (
    <Formik
      enableReinitialize
      initialValues={{
        password: "",
        username: "",
        type: "Supervisor",
        department: "",
        location: "",
        locations: [...data.locations],
      }}
      validationSchema={Validation.Schema}
      onSubmit={handleLoginSubmit}
    >
      {({ values, handleChange }) => (
        <div>
          <div
            className="card"
            style={{
              width: "18rem",
              padding: "10px",
              margin: "auto",
              marginTop: "15px",
            }}
          >
            <Form>
              <div className="row">
                <div className="col">
                  <img alt="world" width="100%" height="auto" />
                </div>
              </div>
              {errormsg ? (
                <div
                  className="alert alert-danger"
                  style={{ marginTop: "10px" }}
                >
                  {errormsg}
                </div>
              ) : null}
              <div
                className="row justify-content-center mb-3"
                style={{ marginTop: "15px" }}
              >
                <div className="col">
                  <Check
                    type="radio"
                    name="type"
                    label="Supervisor"
                    value="Supervisor"
                  />
                </div>
                <div className="col md-auto">
                  <Check
                    type="radio"
                    name="type"
                    id="Guard"
                    label="Guard"
                    value="Guard"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col col-5" style={{ margin: "5px 0px" }}>
                  <Text
                    className="uppercase"
                    label="Username"
                    name="username"
                  />
                </div>
                {/* </div>
              <div className="row"> */}
                <div className="col col-7" style={{ margin: "5px 0px" }}>
                  <Text
                    className="uppercase"
                    label="Password"
                    name="password"
                    type="password"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label>Location</label>
                  <Select
                    size="sm"
                    className="mb-1"
                    keyLoc="login"
                    name="location"
                    label="Location"
                    onChange={(e) => {
                      setLocation(
                        data.locations.find((el) => el.name === e.target.value)
                      );
                      handleChange(e);
                    }}
                    options={values.locations}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  {values.type === "Supervisor" ? (
                    <>
                      <label>Department</label>
                      <Select
                        size="sm"
                        className="mb-1 custom-select-sm"
                        keyLoc="login"
                        name="department"
                        label="Department"
                        options={location ? location.departments : []}
                      />
                    </>
                  ) : null}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <button
                    className="btn btn-sm mt-3 w-100 btn-primary"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  ) : (
    <div>luding</div>
  );
}
