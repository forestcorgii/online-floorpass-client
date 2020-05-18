import React, { useContext } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { Formik, Form } from "formik";

import * as Yup from "yup";
import * as Schema from "./validationSchema";

import { CheckField, InputGroupField, MySelectField } from "./formik-bootstrap";
import Util from "./Util";
import API from "./Api";
import "./App.css";

import AuthContext from "./AuthContext";
import DataContext from "./DataContext";

function Authentication(props) {
  const { handleSubmit } = useContext(AuthContext);
  const data = useContext(DataContext);
  console.log("asda" + JSON.stringify(data));
  return (
    <Formik
      initialValues={{
        id: "",
        name: "",
        type: "Supervisor",
        department: "",
        location: "",
      }}
      validationSchema={Yup.object().shape({
        id: Schema.id,
        location: Schema.basic,
      })}
      onSubmit={(values, isValid) => {
        if (isValid) {
          handleSubmit(values);
          props.history.push(`/${values.type}`);
        }
      }}
    >
      {({ values, setFieldValue, handleChange }) => (
        <div>
          <Card
            style={{
              width: "24rem",
              padding: "15px",
              margin: "auto",
              marginTop: "50px",
            }}
          >
            {/* {JSON.stringify(values)} */}
            <Form>
              <Row>
                <Col>
                  <image src="world.png" />
                </Col>
              </Row>
              <Row className="justify-content-md-center mb-3">
                <Col xs lg="4">
                  <CheckField
                    type="radio"
                    name="type"
                    label="Supervisor"
                    value="Supervisor"
                  />
                </Col>
                <Col md="auto">
                  <CheckField
                    type="radio"
                    name="type"
                    id="Guard"
                    label="Guard"
                    value="Guard"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroupField
                    // size="sm"
                    className="mb-1 uppercase"
                    label={values.name}
                    name="id"
                    onChange={(e) => {
                      //   console.log("value" + JSON.stringify(e));
                      if (e.target.value.length === 4) {
                        API.FindName(e.target.value).then((x) => {
                          if (x.code === 0) {
                            setFieldValue("name", Util.ParseName(x.message[0]));
                          }
                        });
                      } else {
                        setFieldValue("name", "");
                      }
                      handleChange(e);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {values.type === "Supervisor" ? (
                    <MySelectField
                      size="sm"
                      className="mb-1"
                      name="department"
                      label="Department"
                      options={data.departments}
                    />
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col>
                  <MySelectField
                    size="sm"
                    className="mb-1"
                    name="location"
                    label="Location"
                    options={data.locations}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button size="sm" className="mt-3 w-100" type="submit">
                    Login
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      )}
    </Formik>
  );
}

export default Authentication;
