import React, { useState, useEffect, useContext, useRef } from "react";
import { Button, Col, Row, Alert } from "react-bootstrap";
import { PlusSquare, DashSquare } from "react-bootstrap-icons";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";

import Util from "./Util";
import API from "./Api";
import General from "./General";
import {
  InputGroupField,
  MyTextField,
  MySelectField,
} from "./formik-bootstrap";

import AuthContext from "./AuthContext";
import DataContext from "./DataContext";

const initialEmployeeProps = {
  id: "",
  employee_id: "",
  employee_name: "",
  floorpass: "",
};
const initialReferenceID = {
  id: "",
  supervisorName: "",
  supervisorId: "",
  department: "",
  location: "",
  purpose: "",
  employees: [],
};

function Supervisor(props) {
  const { auth } = useContext(AuthContext);
  const data = useContext(DataContext);
  const headerInfo = {
    headers: [
      "ID",
      "Supervisor_ID",
      "Employees",
      "Location",
      "Department",
      "Logs",
      "Purpose",
      "Status",
    ],
    subHeaders: { logs: "logdatetime", employees: "employee_name" },
  };

  const [state, setState] = useState({ logs: null, isLoading: true });
  const [showModalMakeID, setShowModalMakeID] = useState(false);
  const [showModalUpdateID, setShowModalUpdateID] = useState(false);
  const [selectedReferenceID, setSelectedReferenceID] = useState(
    initialReferenceID
  );

  const handleMakeFormSubmit = (e) => {
    setShowModalMakeID(false);
    if (e) {
      API.createID(e);
    }
    setSelectedReferenceID(initialReferenceID);
  };

  const handleUpdateLogSubmit = (p) => {
    setShowModalUpdateID(false);
    setSelectedReferenceID(initialReferenceID);

    if (p) {
      const emps = p.slice();
      emps.forEach((emp) => {
        if (emp.changeType) {
          API.updateEmployee(emp, emp.changeType);
        }
      });
    }
  };

  return (
    <div>
      {/* <Formikform></Formikform> */}

      {/* {JSON.stringify(props)} */}
      <FormMakeID
        show={showModalMakeID}
        auth={auth}
        departments={data.departments}
        locations={data.locations}
        onSubmit={(p) => handleMakeFormSubmit(p)}
      />
      <Formikform
        show={showModalUpdateID}
        // referenceID={selectedReferenceID}
        id={selectedReferenceID.id}
        employees={selectedReferenceID.employees}
        onSubmit={(p) => handleUpdateLogSubmit(p)}
      />

      <General.Filter
        logs={state.logs}
        setLog={setState}
        isEditting={showModalUpdateID}
      >
        <Button
          variant="outline-info"
          size="sm"
          className="m-2"
          onClick={() => setShowModalMakeID(true)}
        >
          Generate ID
        </Button>
      </General.Filter>

      <Util.Log
        name="log"
        headerInfo={headerInfo}
        data={state}
        onClick={(e) => {
          // console.log(e)
          setSelectedReferenceID({ ...e });
          setShowModalUpdateID(true);
        }}
      />
    </div>
  );
}

function FormMakeID(props) {
  // const [details, setDetails] = useState({
  //   supervisorId: props.auth.id,
  //   supervisorName: props.auth.name,
  //   location: props.auth.location,
  //   department: props.auth.department,
  //   purpose: "",
  // });

  // const handleChange = (e) => {
  //   return setDetails({ ...details, [e.target.name]: e.target.value });
  // };

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
                <MySelectField
                  size="sm"
                  name="department"
                  label="Department"
                  // default={values.department}
                  options={props.departments}
                  // onChange={(e) => handleChange(e)}
                />
              </Col>
              <Col>
                <MySelectField
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
                <MyTextField
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

// function FormMakeID(props) {
//   const [details, setDetails] = useState({
//     supervisorId: props.auth.id,
//     supervisorName: props.auth.name,
//     location: props.auth.location,
//     department: props.auth.department,
//     purpose: "",
//   });

//   const handleChange = (e) => {
//     return setDetails({ ...details, [e.target.name]: e.target.value });
//   };

//   return (
//     <Util.ModalField
//       show={props.show}
//       header="Generate New Reference ID"
//       onExit={() => props.onSubmit()}
//       onClick={() => props.onSubmit(details)}
//     >
//       <Form>
//         <Form.Row>
//           <Util.Select
//             name="department"
//             label="Department"
//             default={details.department}
//             options={props.departments}
//             onChange={(e) => handleChange(e)}
//           />
//           <Util.Select
//             name="location"
//             label="Location"
//             default={details.location}
//             options={props.locations}
//             onChange={(e) => handleChange(e)}
//           />
//         </Form.Row>
//         <Form.Row>
//           <Util.Text
//             label="Purpose"
//             name="purpose"
//             placeholder="Enter Purpose"
//             as="textarea"
//             value={details.purpose}
//             onChange={(e) => handleChange(e)}
//           />
//         </Form.Row>
//       </Form>
//     </Util.ModalField>
//   );
// }

// function FormUpdateID(props) {
//   const [employees, setEmployees] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   useEffect(() => {
//     console.log(JSON.stringify(employees));
//     setEmployees(props.employees);
//   }, [props.employees]);

//   useEffect(() => {
//     const emp = employees[activeIndex];
//     if (emp) {
//       console.log(emp);
//       if (emp.employee_id.length === 4) {
//         API.FindName(emp.employee_id).then((x) => {
//           if (x.code === 0) {
//             if (emp.employee_name !== x.message[0].first_name) {
//               console.log(x);
//               const emps = employees.slice();
//               emps.splice(activeIndex, 1, {
//                 ...emp,
//                 employee_name: x.message[0].first_name,
//               });
//               setEmployees(emps);
//             }
//           }
//         });
//       }
//     }
//   }, [employees]);

//   const handleChange = (e, i) => {
//     let emps = employees.slice();
//     if (e.target) {
//       emps.splice(i, 1, {
//         ...emps[i],
//         employee_id: e.target.value.toUpperCase(),
//         employee_name: "",
//         changeType: emps[i].changeType === "POST" ? "POST" : "PUT",
//       });
//     } else if (e === -1) {
//       if (emps[i].id === "") {
//         emps.splice(i, 1);
//       } else {
//         emps.splice(i, 1, { ...emps[i], changeType: "DELETE" });
//       }
//     } else {
//       const emp = {
//         ...initialEmployeeProps,
//         floorpass: props.id,
//         changeType: "POST",
//       };
//       if (employees) {
//         emps.splice(0, 0, emp);
//       } else {
//         emps = [emp];
//       }
//     }
//     setActiveIndex(i);
//     setEmployees(emps);
//   };

//   return (
//     <Util.ModalField
//       header={"Update ID: " + props.id}
//       show={props.show}
//       onExit={() => props.onSubmit()}
//       onSubmit={() => props.onSubmit(employees)}
//     >
//       <Form>
//         {/* {JSON.stringify(employees)} */}
//         {/* {console.log("render")} */}
//         <Form.Row>
//           <Col>
//             <PlusSquare size={28} onClick={() => handleChange(0, 0)}>
//               Add
//             </PlusSquare>
//           </Col>
//         </Form.Row>
//         <br></br>
//         {employees
//           ? employees.map((employee, i) => {
//               if (employee.changeType !== "DELETE") {
//                 return (
//                   <Form.Row key={i}>
//                     <Col xs={3}>
//                       <Util.Text
//                         name={employee.employee_id}
//                         placeholder="Enter Employee ID"
//                         value={employee.employee_id}
//                         onChange={(e) => handleChange(e, i)}
//                       />
//                     </Col>
//                     <Col>{employee.employee_name}</Col>
//                     <Col md="auto">
//                       <DashSquare
//                         bg="warning"
//                         label="adada"
//                         onClick={() => handleChange(-1, i)}
//                       >
//                         Delete
//                       </DashSquare>
//                     </Col>
//                   </Form.Row>
//                 );
//               } else {
//                 return "";
//               }
//             })
//           : null}
//       </Form>
//     </Util.ModalField>
//   );
// }

const Formikform = (props) => {
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
            let dupsFound = false;
            values.forEach((val) => {
              if (arr.filter((id) => id === val.employee_id).length >= 2) {
                dupsFound = true;
                console.log(val.employee_id + arr.toString());
              } else {
                arr.push(val.employee_id);
              }
            });
            console.log(dupsFound);
            return dupsFound;
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
                              <InputGroupField
                                toggleButton={{
                                  button: ["Remove", "Cancel"],
                                  value: employee.changeType !== "DELETE",
                                }}
                                // removeButton
                                // disabled={employee.changeType === "DELETE"}
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
};

export default Supervisor;
