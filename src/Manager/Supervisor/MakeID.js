import React from "react";
import {  Col, Row } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import * as Util from "../../Util";

import Select from "../../Formik-Bootstrap/Select";
import Text from "../../Formik-Bootstrap/Text";

export default function MakeID(props) {
    return (
      <Formik
        enableReinitialize
        initialValues={{
          supervisorId: props.auth.id,
          supervisorName: props.auth.name,
          location: props.auth.location,
          department: props.auth.department,
          purpose: "",
        }}
        validationSchema={Yup.object().shape({
          location: Yup.string().required(),
          department: Yup.string().required(),
          purpose: Yup.string().required(),
        })}
      >
        {({ values, isValid }) => (
          <Util.ModalField
            show={props.show}
            header="Generate New Reference ID"
            onExit={() => props.onSubmit()}
            onSubmit={() => {
              if (isValid) {
                props.onSubmit(values);
              }
            }}
          >
            <Form>
              <Row className="m-1">
                <Col>
                  <Select
                    size="sm"
                    name="department"
                    label="Department"
                    // default={values.department}
                    options={props.departments}
                    // onChange={(e) => handleChange(e)}
                  />
                </Col>
                <Col>
                  <Select
                    size="sm"
                    name="location"
                    label="Location"
                    // default={values.location}
                    options={props.locations}
                    // onChange={(e) => handleChange(e)}
                  />
                </Col>
              </Row>
              <Row className="m-1">
                <Col>
                  <Text
                    size="sm"
                    label="Purpose"
                    name="purpose"
                    // placeholder="Enter Purpose"
                    as="textarea"
                    // value={values.purpose}
                    // onChange={(e) => handleChange(e)}
                  />
                </Col>
              </Row>
            </Form>
          </Util.ModalField>
        )}
      </Formik>
    );
  }