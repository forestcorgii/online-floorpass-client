import React, { useEffect, useState, useContext } from "react";
import { Col, Row, Button, Alert } from "react-bootstrap";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

import * as Util from "../../Util";

import * as API from "../../Api/Api";
import InputGroup from "../../Formik-Bootstrap/InputGroup";
import Select from "../../Formik-Bootstrap/Select";
import Text from "../../Formik-Bootstrap/Text";

import DataContext from "../../Contexts/DataContext";

export default function MakeID({ detail, ...props }) {
  // alert(JSON.stringify(detail));

  const [departments, setDepartments] = useState([]);
  const data = useContext(DataContext);

  useEffect(() => {
    setDepartments(
      detail.locations.find((e) => e.name === detail.location).departments
    );
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        supervisorId: detail.id,
        supervisorName: detail.name,
        location: detail.location,
        department: detail.department,
        purpose: detail.purpose,
        employees: [...detail.employees, {}],
        floorpass: detail.floorpassId,
      }}
      validationSchema={Yup.object().shape({
        location: Yup.string().required(),
        department: Yup.string().required(),
        purpose: Yup.string().required(),
        employees: Yup.array()
          .min(1, "There should be atleast one Employee registered")
          .of(
            Yup.object().shape({
              employee_id: Yup.string()
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
              if (arr.filter((id) => id === val.employee_id).length >= 1) {
                isUnique = false;
              } else {
                arr.push(val.employee_id);
              }
            });
            return isUnique;
          }),
      })}
    >
      {({ values, isValid, handleChange, setFieldValue }) => (
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
                  options={departments}
                />
              </Col>
              <Col>
                <Select
                  size="sm"
                  name="location"
                  label="Location"
                  options={props.locations}
                  onChange={(e) => {
                    setDepartments(
                      data.locations.find((el) => el.name === e.target.value)
                        .departments
                    );
                    handleChange(e);
                  }}
                />
              </Col>
            </Row>
            <Row className="m-1">
              <Col>
                <Text size="sm" label="Purpose" name="purpose" as="textarea" />
              </Col>
            </Row>
            <hr></hr>
            <FieldArray
              name="employees"
              // onChange={() => {
              //   if (
              //     values.employees[values.employees.length - 1]
              //       .employee_name !== ""
              //   ) {
              //     alert("");
              //     // setFieldValue("employees", [...values.employees, {}]);
              //   }
              // }}
            >
              {(arrayHelpers) => (
                <>
                  {values.employees
                    ? values.employees.map((employee, index) => {
                        return (
                          <EmployeeItem
                            key={index + "employeeitem"}
                            employee={employee}
                            index={index}
                            arrayHelpers={arrayHelpers}
                            handleChange={handleChange}
                            employees={values.employees}
                          />
                        );
                      })
                    : console.log(values.employees)}
                  {/* <EmployeeItem
                    key={"newemployeeitem"}
                    employee={{}}
                    index={values.employees.length}
                    arrayHelpers={arrayHelpers}
                    handleChange={handleChange}
                  /> */}
                </>
              )}
            </FieldArray>
          </Form>
        </Util.ModalField>
      )}
    </Formik>
  );
}

function EmployeeItem({
  employee,
  index,
  handleChange,
  arrayHelpers,
  employees,
}) {
  return (
    <Row className="m-2" key={index}>
      <Col>
        <InputGroup
          className="uppercase"
          name={`employees[${index}].employee_id`}
          label={employee.employee_name}
          normalButton="REMOVE"
          onButtonClick={() => {
            arrayHelpers.remove(index);
          }}
          onChange={(e) => {
            if (e.target.value.length === 4) {
              API.FindName(e.target.value).then((x) => {
                if (x.code === 0) {
                  arrayHelpers.replace(index, {
                    ...employee,
                    employee_id: e.target.value,
                    employee_name: Util.ParseName(x.message[0]),
                  });
                  if (
                    !(
                      employees[employees.length - 1].employee_id === "" ||
                      employees[employees.length - 1].employee_id === undefined
                    )
                  ) {
                    arrayHelpers.push({});
                  }
                }
              });
            } else {
              arrayHelpers.replace(index, {
                ...employee,
                employee_name: "",
              });
            }
            handleChange(e);
          }}
        />
      </Col>
    </Row>
  );
}
