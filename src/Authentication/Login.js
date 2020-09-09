import React, { useContext, useState } from "react";
import * as RCBTRP from "react-bootstrap";
import { Formik, Form } from "formik";

import * as Yup from "yup";
import * as Schema from "../Validation/Yup/validationSchema";

import Check from "../Formik-Bootstrap/Check";
import InputGroup from "../Formik-Bootstrap/InputGroup";
import Select from "../Formik-Bootstrap/Select";
import Text from "../Formik-Bootstrap/Text";

import * as Util from "../Util";
import * as API from "../Api/Api";
import "../App.css";

import AuthContext from "../Contexts/AuthContext";
import DataContext from "../Contexts/DataContext";

import world from "../world.png";

function Authentication(props) {
  const { handleSubmit } = useContext(AuthContext);
  const data = useContext(DataContext);

  const [errormsg, setErrormsg] = useState("");
  return (
    <Formik
      initialValues={{
        password: "",
        username: "",
        type: "Supervisor",
        department: "",
        location: "",
      }}
      validationSchema={Yup.object().shape({
        username: Schema.basic,
        password: Schema.basic,
        location: Schema.basic,
      })}
      onSubmit={(values) => {
        API.loginToHRMS(values.username, values.password)
          .then((result) => {
            return result.json();
          })
          .then((res) => {
            // if (res.code === 0 && res.message.userpower > 0) {
            if (res.code === 0) {
              handleSubmit(values);
              props.history.push(`/${values.type}`);
            } else {
              setErrormsg("You don't have the right to login.");
            }
          })
          .catch((error) => alert(error));
      }}
    >
      {({ values }) => (
        <div>
          <RCBTRP.Card
            style={{
              width: "24rem",
              padding: "15px",
              margin: "auto",
              marginTop: "50px",
            }}
          >
            <Form>
              <RCBTRP.Row>
                <RCBTRP.Col>
                  <img src={world} width="350" height="275" />
                </RCBTRP.Col>
              </RCBTRP.Row>
              {errormsg ? (
                <div
                  className="alert alert-danger"
                  style={{ marginTop: "10px" }}
                >
                  {errormsg}
                </div>
              ) : null}
              <RCBTRP.Row
                className="justify-content-md-center mb-3"
                style={{ marginTop: "15px" }}
              >
                <RCBTRP.Col xs lg="4">
                  <Check
                    type="radio"
                    name="type"
                    label="Supervisor"
                    value="Supervisor"
                  />
                </RCBTRP.Col>
                <RCBTRP.Col md="auto">
                  <Check
                    type="radio"
                    name="type"
                    id="Guard"
                    label="Guard"
                    value="Guard"
                  />
                </RCBTRP.Col>
              </RCBTRP.Row>
              <RCBTRP.Row>
                <RCBTRP.Col style={{ margin: "5px 0px" }}>
                  <Text
                    className="uppercase"
                    label="Username:"
                    name="username"
                  />
                </RCBTRP.Col>
              </RCBTRP.Row>
              <RCBTRP.Row>
                <RCBTRP.Col style={{ margin: "5px 0px" }}>
                  <Text
                    className="uppercase"
                    label="Password:"
                    name="password"
                    type="password"
                  />
                </RCBTRP.Col>
              </RCBTRP.Row>
              <RCBTRP.Row>
                <RCBTRP.Col>
                  {values.type === "Supervisor" ? (
                    <>
                      <label>Department:</label>
                      <Select
                        size="sm"
                        className="mb-1"
                        name="department"
                        label="Department"
                        options={data.departments}
                      />
                    </>
                  ) : null}
                </RCBTRP.Col>
              </RCBTRP.Row>
              <RCBTRP.Row>
                <RCBTRP.Col>
                  <label>Location:</label>
                  <Select
                    size="sm"
                    className="mb-1"
                    name="location"
                    label="Location"
                    options={data.locations}
                  />
                </RCBTRP.Col>
              </RCBTRP.Row>
              <RCBTRP.Row>
                <RCBTRP.Col>
                  <RCBTRP.Button size="sm" className="mt-3 w-100" type="submit">
                    Login
                  </RCBTRP.Button>
                </RCBTRP.Col>
              </RCBTRP.Row>
            </Form>
          </RCBTRP.Card>
        </div>
      )}
    </Formik>
  );
}

export default Authentication;
