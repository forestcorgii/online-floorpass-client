import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";

import * as Util from "../../Util";
import * as API from "../../Api/Api";
import General from "../../General";

import AuthContext from "../../Contexts/AuthContext";
import DataContext from "../../Contexts/DataContext";

import UpdateFloorpass from "./UpdateFloorpass";
import MakeID from "./MakeID";

// const initialEmployeeProps = {
//   id: "",
//   employee_id: "",
//   employee_name: "",
//   floorpass: "",
// };
const initialReferenceID = {
  id: "",
  supervisorName: "",
  supervisorId: "",
  department: "",
  location: "",
  purpose: "",
  employees: [],
};

export default function Supervisor(props) {
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
      <MakeID
        show={showModalMakeID}
        auth={auth}
        departments={data.departments}
        locations={data.locations}
        onSubmit={(p) => handleMakeFormSubmit(p)}
      />
      <UpdateFloorpass
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
