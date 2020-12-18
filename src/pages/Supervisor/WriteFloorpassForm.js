import React, { useEffect, useState, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { Formik, Form, FieldArray } from "formik";

import * as Util from "../../Util";

import * as API from "./SupervisorAPI";
import InputGroup from "../../components/Formik/InputGroup";
import Select from "../../components/Formik/Select";
import Text from "../../components/Formik/Text";

import CommonModalField from "../../components/Common/Modal";

import DataContext from "../../contexts/DataContext";

import Validation from "./WriteFloorpassFormValidation";

export default function MakeID({ detail, ...props }) {
  // alert(JSON.stringify(detail));

  const [departments, setDepartments] = useState([]);
  const data = useContext(DataContext);

  const edittable = () => {
    return (
      detail.status_label === "Stand By" || detail.status_label === undefined
    );
  };

  useEffect(() => {
    setDepartments(
      detail.locations.find((e) => e.name === detail.location).departments
    );
  }, []);

  return (
    <Formik
      enableReinitialize
      validateOnBlur="false"
      validateOnChange="false"
      initialValues={{
        supervisorId: detail.id,
        supervisorName: detail.name,
        location: detail.location,
        department: detail.department,
        purpose: detail.purpose,
        employees: [...detail.employees, {}],
        floorpass: detail.floorpassId,
      }}
      validationSchema={Validation.Schema}
      onSubmit={(values, { resetForm }) => {
        props.onSubmit(values);
        resetForm({});
      }}
    >
      {({ values, isValid, handleChange, handleSubmit, errors }) => (
        <CommonModalField
          show={props.show}
          header="Generate New Reference ID"
          onExit={() => props.onSubmit()}
          onSubmit={handleSubmit}
        >
          <Form>
            {/* {JSON.stringify(errors)} */}
            {errors.employees && typeof errors.employees === "string" ? (
              <div className="alert alert-danger">{errors.employees}</div>
            ) : null}
            <Row className="m-1">
              <Col>
                <Select
                  disabled
                  size="sm"
                  name="department"
                  label="Department"
                  options={departments}
                />
              </Col>
              <Col>
                <Select
                  disabled
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
                <Text
                  disabled={edittable}
                  size="sm"
                  label="Purpose"
                  name="purpose"
                  as="textarea"
                />
              </Col>
            </Row>
            <hr></hr>
            <FieldArray name="employees">
              {(arrayHelpers) => (
                <>
                  {values.employees
                    ? values.employees.map((employee, index) => {
                        return (
                          <EmployeeItem
                            disabled={edittable}
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
                </>
              )}
            </FieldArray>
            <hr></hr>
            {detail.status_label !== "Stand By" &&
            detail.report &&
            detail.report.length > 0
              ? detail.report.map((des, i) => {
                  return (
                    <div key={"rep" + i}>
                      {des.from.loc} - {des.to.loc} : {des.elapse}
                    </div>
                  );
                })
              : null}
          </Form>
        </CommonModalField>
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
  disabled,
}) {
  return (
    <Row className="m-2" key={index}>
      <Col>
        <InputGroup
          disabled={disabled}
          className="uppercase"
          name={`employees[${index}].employee_id`}
          label={employee.employee_name}
          placeholder="Enter Employee ID here please"
          normalButton="REMOVE"
          onButtonClick={() => {
            if (
              !(
                employee.employee_id === "" ||
                employee.employee_id === undefined
              ) ||
              employees.length > 1
            ) {
              arrayHelpers.remove(index);
            }
          }}
          onBlur={() => {
            if (
              (employee.employee_id === "" ||
                employee.employee_id === undefined) &&
              employees.length > 2
            ) {
              arrayHelpers.remove(index);
            }
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
