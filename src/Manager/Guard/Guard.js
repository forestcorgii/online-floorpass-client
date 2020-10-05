import React, { useState, useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
// import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import * as Util from "../../Util";
import * as API from "../../Api/Api";
import General from "../../General";

import AuthContext from "../../Contexts/AuthContext";
// import DataContext from './DataContext';

export default function Guard(props) {
  const { auth } = useContext(AuthContext);

  const headerInfo = {
    headers: [
      "Reference_ID",
      "Supervisor_ID",
      "Employees",
      "Location",
      "Department",
      "Logs",
      "Purpose",
      "Status_label",
    ],
    subHeaders: { logs: "logdatetime_str", employees: "employee_name" },
  };

  // const [state, setState] = useState({ logs: null, isLoading: true });
  // const [floorpass, setFloorpass] = useState();
  const [employeeID, setEmployeeID] = useState("")
  const [showFloorpassDetail, setShowFloorpassDetail] = useState(false);
  // useEffect(() => {
  //     // API.callLogAPI().then(x => setState({ logs: x, isLoading: false }))
  // }, [])
  const handleSubmit = (floorpass) => {
    API.createLog({
      id: auth.id,
      floorpass_id: floorpass.reference_id,
      employee_id: employeeID,
      location: auth.location,
    });
    // setFloorpass();
    setEmployeeID("")
    alert("Log sent successfully!")
  };

  useEffect(() => {
    // alert('daan')
    const timer = setTimeout(() => {
      if (employeeID.length === 4) {
        API.findLog(employeeID, auth.location).then((res) => {
          return res.json()
        }).then((res) => {
          if (res.response === 'Allowed') {
            // setFloorpass(res.floorpass)
            handleSubmit(res.floorpass)
          } else { alert(res.response); setEmployeeID("") }
        })
      }
    }, 1000);
    return () => clearTimeout(timer)
  }, [employeeID, setShowFloorpassDetail])


  // const LogSchema = Yup.object().shape({
  //   ReferenceID: Yup.string().required("required"),
  // });

  return (
    <div>
      {/* <Util.ModalField
        show={floorpass !== undefined}
        header="Please verify floorpass:"
        onExit={() => {
          setFloorpass()
          // setShowFloorpassDetail(false)
        }}
        onSubmit={() => handleSubmit()}
      >
        {floorpass ?
          <>
            <div className="row">
              <div className="col">Reference ID:{floorpass.reference_id}</div>
              <div className="col">Supervisor:{floorpass.supervisor_name}</div>
            </div>
            <hr></hr>
            <div className="row">
              <div className="col">Department:{floorpass.department}</div>
              <div className="col">Location:{floorpass.location}</div>
            </div>
            <div className="row">
              <div className="col">Purpose:</div>
              <div className="col">{floorpass.purpose}</div>
            </div>
            <div className="row">
              <div className="col">Employees included:</div>
              {floorpass.employees.map((emp, i) => {
                return <div className="col" key={"emps" + i}>{emp.employee_id} - {emp.employee_name}</div>
              })}
            </div>
          </>
          : null}

      </Util.ModalField> */}
      <General.Filter
        headerInfo={headerInfo}
        showFilter={false}
      // onClick={(e) => setReferenceID(e.reference_id)}
      >
        {/* <Formik
          initialValues={{
            ReferenceID: referenceID,
          }}
          validationSchema={LogSchema}
          onSubmit={(values, { resetForm }) => {
            API.createLog({
              id: auth.id,
              floorpass_id: parseInt(values.ReferenceID),
              location: auth.location,
            });
            resetForm({});
          }}
        >
          {({ values, errors, touched }) => ( */}
        {/* <Form> */}
        <div className="input-group input-group-sm mw-100 p-1 col-sm-12 col-md-3 col-lg-3">
          <input
            className="input-field form-control form-control-sm"
            name="ReferenceID"
            placeholder="Enter Reference ID"
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
          />
          <div className="input-group-append">
            <Button
              className="input-group-button button-sm"
              // type="submit"
              onClick={(e) => {
                // setShowFloorpassDetail(true)
                // e.preventDefault();
                // handleSubmit(e);
              }}
            >
              Log
            </Button>
          </div>
        </div>
        {/* </Form> */}
        {/* )}
        </Formik> */}
      </General.Filter>
      {/* <Util.Log name="log" headerInfo={headerInfo} data={state} /> */}
    </div>
  );
}
