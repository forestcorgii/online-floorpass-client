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
      "Supervisor",
      "Employees",
      "Location",
      "Department",
      "Logs",
      "Purpose",
      "Status",
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
    // .length(1, 'Invalid')
  });

  // const handleSubmit =
  //     async () => {
  //     }

  return (
    <div>
      <General.Filter logs={state.logs} setLog={setState}>
        <Formik
          initialValues={{
            ReferenceID: "",
          }}
          validationSchema={LogSchema}
          onSubmit={(values) => {
            // console.log(values)
            API.createLog({
              id: auth.id,
              floorpass_id: parseInt(values.ReferenceID),
              location: auth.location,
            });
          }}
        >
          {({ values, errors, touched }) => (
            <Form>
              <Field name="ReferenceID" />
              {errors.ReferenceID && touched.ReferenceID ? (
                <div>{errors.ReferenceID}</div>
              ) : null}
              <Button type="submit">Log</Button>
            </Form>
          )}
        </Formik>

        {/* <Form onSubmit={() => handleSubmit()}>
                    <Form.Row>
                        <Util.Text
                            name="referenceID"
                            placeholder="Reference ID"
                            onChange={e => setReferenceID(e.target.value)}
                        />
                        <Col>
                            <Button size="sm" type="submit">Log</Button>
                        </Col>
                    </Form.Row>
                </Form> */}
      </General.Filter>
      <Util.Log name="log" headerInfo={headerInfo} data={state} />
    </div>
  );
}
