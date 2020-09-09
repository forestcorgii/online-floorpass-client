import React from "react";
import { Button, Col, Row, Alert } from "react-bootstrap";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

import * as Util from "../../Util";
import * as API from "../../Api/Api";

import InputGroup from "../../Formik-Bootstrap/InputGroup";

export default function FormUpdateFloorpass(props) {
  // console.log(props);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        employees: props.employees,
        floorpass: props.id,
      }}
      validationSchema={Yup.object().shape({
        employees: Yup.array()
          // .min(1, "There should be atleast one Employee registered")
          .of(
            Yup.object().shape({
              employee_id: Yup.string()
                .required("ID is a required field.")
                .length(4, "ID must be 4 characters only")
                .when("employee_name", {
                  is: (employee_name) => {
                    return !employee_name || employee_name === "";
                  },
                  then: Yup.string().max(3, "Unknown ID"),
                }),
            })
          )
          .test("duplicate-checking", "Duplicate Employee found", (values) => {
            const arr = [];
            let isUnique = true;
            values.forEach((val) => {
              // console.log(arr.filter((id)=> id === val.employee_id));
              if (arr.filter((id) => id === val.employee_id).length >= 1) {
                isUnique = false;
              } else {
                // console.log(val.employee_id + arr.toString());
                arr.push(val.employee_id);
              }
            });
            // console.log(dupsFound);
            return isUnique;
          }),
      })}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, errors, isValid, handleChange }) => (
        <Util.ModalField
          header={"Update ID: " + values.floorpass}
          show={props.show}
          onExit={() => props.onSubmit()}
          onSubmit={() => {
            if (isValid) {
              props.onSubmit(values.employees);
            }
          }}
        >
          {/* {console.log("values " + JSON.stringify(errors))} */}
          {errors.employees && !Array.isArray(errors.employees) ? (
            <Alert size="sm" variant="danger">
              {errors.employees}
            </Alert>
          ) : null}
          <Form>
            <FieldArray name="employees">
              {(arrayHelpers) => (
                <>
                  <Button
                    onClick={() =>
                      arrayHelpers.push({
                        floorpass: values.floorpass,
                        changeType: "POST",
                        isNew: true,
                      })
                    }
                  >
                    ADD
                  </Button>
                  {values.employees
                    ? values.employees.map((employee, index) => {
                        return (
                          <Row className="m-2" key={index}>
                            <Col>
                              <InputGroup
                                className="uppercase"
                                toggleButton={{
                                  button: ["Remove", "Cancel"],
                                  value: employee.changeType !== "DELETE",
                                }}
                                name={`employees[${index}].employee_id`}
                                label={employee.employee_name}
                                onToggle={(e) => {
                                  const changeType = e
                                    ? employee.isNew
                                      ? "POST"
                                      : "PUT"
                                    : "DELETE";
                                  arrayHelpers.replace(index, {
                                    ...employee,
                                    changeType: changeType,
                                  });
                                }}
                                onChange={(e) => {
                                  const changeType =
                                    employee.changeType === "POST"
                                      ? "POST"
                                      : "PUT";

                                  if (e.target.value.length === 4) {
                                    API.FindName(e.target.value).then((x) => {
                                      if (x.code === 0) {
                                        // console.log(x.message[0]);
                                        arrayHelpers.replace(index, {
                                          ...employee,
                                          employee_id: e.target.value,
                                          employee_name: Util.ParseName(
                                            x.message[0]
                                          ),
                                          changeType: changeType,
                                        });
                                      }
                                    });
                                  } else {
                                    arrayHelpers.replace(index, {
                                      ...employee,
                                      employee_name: "",
                                      changeType: changeType,
                                    });
                                  }
                                  handleChange(e);
                                }}
                              />
                            </Col>
                          </Row>
                        );
                      })
                    : null}
                </>
              )}
            </FieldArray>
          </Form>
        </Util.ModalField>
      )}
    </Formik>
  );
}
