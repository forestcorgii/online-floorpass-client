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
    subHeaders: { logs: "logdatetime_str", employees: "employee_name" },
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

