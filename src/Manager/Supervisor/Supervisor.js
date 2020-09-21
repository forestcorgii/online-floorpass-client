import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";

import * as Util from "../../Util";
import * as API from "../../Api/Api";
import General from "../../General";

import AuthContext from "../../Contexts/AuthContext";
import DataContext from "../../Contexts/DataContext";

import UpdateFloorpass from "./UpdateFloorpass";
import MakeID from "./MakeID";

const initialReferenceID = {
  floorpassId: "",
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
      "Status_label",
    ],
    subHeaders: { logs: "logdatetime_str", employees: "employee_name" },
  };

  const [state, setState] = useState({ logs: null, isLoading: true });
  const [showModalMakeID, setShowModalMakeID] = useState(false);
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

  return (
    <div>
      <MakeID
        show={showModalMakeID}
        detail={{ ...selectedReferenceID, ...auth }}
        departments={data.departments}
        locations={data.locations}
        onSubmit={(p) => handleMakeFormSubmit(p)}
      />

      <General.Filter
        logs={state.logs}
        setLog={setState}
        isEditting={showModalMakeID}
        headerInfo={headerInfo}
        showFilter={true}
        onClick={(e) => {
          setSelectedReferenceID({ floorpassId: e.id, ...e });
          setShowModalMakeID(true);
        }}
      >
        <div className="mw-100 p-1 col-sm-12 col-md-3 col-lg-3">
          <Button size="sm" onClick={() => setShowModalMakeID(true)}>
            Generate ID
          </Button>
        </div>
      </General.Filter>

      {/* <div style={{ margin: "5px" }}>
        <Util.Log
          name="log"
          headerInfo={headerInfo}
          data={state}
          onClick={(e) => {
            setSelectedReferenceID({ floorpassId: e.id, ...e });
            setShowModalMakeID(true);
          }}
        />
      </div> */}
    </div>
  );
}
