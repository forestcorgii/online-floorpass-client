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
      "ID",
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
  // const [referenceID, setReferenceID] = useState('');
  // useEffect(() => {
  //     // API.callLogAPI().then(x => setState({ logs: x, isLoading: false }))
  // }, [])

  const LogSchema = Yup.object().shape({
    ReferenceID: Yup.string().required("required"),
  });

  return (
    <div>
      <General.Filter
        logs={state.logs}
        setLog={setState}
        headerInfo={headerInfo}
        showFilter={false}
      >
        <Formik
          initialValues={{
            ReferenceID: "",
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
          {({ values, errors, touched }) => (
            <Form>
              <div className="input-group input-group-sm mw-100 p-1 col-sm-12 col-md-3 col-lg-3">
                <Field
                  className="input-field form-control form-control-sm"
                  name="ReferenceID"
                  placeholder="Enter Reference ID"
                />
                <div className="input-group-append">
                  <Button
                    className="input-group-button button-sm"
                    type="submit"
                  >
                    Log
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </General.Filter>
      {/* <Util.Log name="log" headerInfo={headerInfo} data={state} /> */}
    </div>
  );
}
