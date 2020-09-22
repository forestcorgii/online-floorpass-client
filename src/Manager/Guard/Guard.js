import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
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

  const [state, setState] = useState({ logs: null, isLoading: true });
  const [referenceID, setReferenceID] = useState("");
  // useEffect(() => {
  //     // API.callLogAPI().then(x => setState({ logs: x, isLoading: false }))
  // }, [])
  const handleSubmit = (e) => {
    API.createLog({
      id: auth.id,
      floorpass_id: referenceID,
      location: auth.location,
    });
    setReferenceID("");
  };

  const LogSchema = Yup.object().shape({
    ReferenceID: Yup.string().required("required"),
  });

  return (
    <div>
      <General.Filter
        headerInfo={headerInfo}
        showFilter={false}
        onClick={(e) => setReferenceID(e.reference_id)}
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
            value={referenceID}
            onChange={(e) => setReferenceID(e.target.value)}
          />
          <div className="input-group-append">
            <Button
              className="input-group-button button-sm"
              // type="submit"
              onClick={(e) => {
                // e.preventDefault();
                handleSubmit(e);
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
