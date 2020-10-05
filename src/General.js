import React, { useContext, useState, useEffect, useReducer } from "react";
import { Navbar, NavDropdown, Form, Modal, Button } from "react-bootstrap";

import * as Util from "./Util";
import * as API from "./Api/Api";

import AuthContext from "./Contexts/AuthContext";
import DataContext from "./Contexts/DataContext";
// import Select from "./Formik-Bootstrap/Select";
// import { findByLabelText } from "@testing-library/react";

function filterReducer(state, action) {
  switch (action.type) {
    case "set-filter":
      const logCount = action.logs.length;
      var latestLog = {};
      if (logCount > 0) {
        latestLog = action.logs[0];
      }
      return {
        ...state,
        ...action.filter,
        result: action.logs,
        maxPageCount: action.maxPageCount,
        isLoading: false,
        latestLog: latestLog,
      };
    default:
      alert("unknown dispatch type.")
  }
}

function Filter(props) {
  const { auth } = useContext(AuthContext);
  const data = useContext(DataContext);
  const [departments, setDepartments] = useState([]);
  const [employee_id, setEmployee_id] = useState('');

  const [filter, dispatch] = useReducer(filterReducer, {
    ...auth,
    username: '',
    page: 1,
    limit: 15,
  });
  const handleChange = (obj) => {
    const newFilter = { ...filter, ...obj };
    API.requestFilter(newFilter).then((x) => {
      dispatch({
        type: "set-filter",
        filter: newFilter,
        logs: x.logs,
        maxPageCount: x.maxPageCount,
      });
    });
  };

  useEffect(() => {
    setDepartments(
      filter.locations.find((e) => e.name === filter.location).departments
    );
    handleChange();
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      handleChange({ username: employee_id })
    }, 1000);
    return () => clearTimeout(timer)
  }, [employee_id])

  useEffect(() => {
    if (!props.isEditting) {
      const interval = setInterval(() => {
        API.checkNewLog(filter.latestLog).then((x) => {
          if (x.new_logs_count > 0) {
            handleChange();
          }
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [filter, props.isEditting]);

  return (
    <div>
      <Form>
        <div className="row m-1">
          {props.children}
          {props.showFilter ? (
            <>
              <div className="p-1 col-sm-1 col-md-1 col-lg-1 text-right">
              </div>
              <Util.Text
                className="p-1 col-sm-4 col-md-2 col-lg-2"
                label="Employee ID"
                name="username"
                value={employee_id}
                onChange={(e) =>
                  setEmployee_id(e.target.value)
                }
              />
              <Util.Select
                className="p-1 col-sm-2 col-md-2 col-lg-2"
                label="Limit"
                name="limit"
                default={filter.limit}
                options={[
                  { name: 5 },
                  { name: 10 },
                  { name: 15 },
                  { name: 20 },
                  { name: 50 },
                ]}
                onChange={(e) =>
                  handleChange({ [e.target.name]: e.target.value })
                }
              />

            </>
          ) : null}
        </div>
        <div className="row m-1">
          <Log
            name="log"
            headerInfo={props.headerInfo}
            data={{ logs: filter.result, isLoading: false }}
            type={auth.type}
            onClick={(e) => {
              if (props.onClick) {
                props.onClick(e);
              }
            }}
          />
        </div>
        <div className="row justify-content-end m-1">
          <nav aria-label="...">
            <ul className="pagination pagination-sm">
              <li
                className={"page-item " + (filter.page > 1 ? "" : "disabled")}
              >
                <span
                  style={{ cursor: "pointer" }}
                  className="page-link"
                  onClick={(e) => handleChange({ page: filter.page - 1 })}
                >
                  Previous
                </span>
              </li>
              {Array(filter.maxPageCount)
                .fill(1)
                .map((o, i) => {
                  return (
                    <li
                      key={"pages" + i}
                      style={{ cursor: "pointer" }}
                      className={
                        "page-item " + (filter.page === i + 1 ? "active" : "")
                      }
                    >
                      <span
                        className="page-link"
                        onClick={(e) => handleChange({ page: i + 1 })}
                      >
                        {i + 1}
                      </span>
                    </li>
                  );
                })}
              <li
                style={{ cursor: "pointer" }}
                className={
                  "page-item " +
                  (filter.page !== filter.maxPageCount ? "" : "disabled")
                }
              >
                <a
                  className="page-link"
                  onClick={(e) => handleChange({ page: filter.page + 1 })}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Form>
    </div>
  );
}

function Log(props) {
  const [floorpassDetail, setFloorpassDetail] = useState()
  const [employeeDetail, setEmployeeDetail] = useState()

  const handleFloorpassClick = (e) => {
    API.getFloorpass(e.floorpass_id).then(res => { setFloorpassDetail(res) })
  }
  const handleEmployeeidClick = (e) => {
    API.getEmployeeReport(e).then(res => { setEmployeeDetail(res) })
  }

  return (
    <>
      <Floorpass detail={floorpassDetail} show={floorpassDetail !== undefined} onExit={() => setFloorpassDetail()} />
      <Employee detail={employeeDetail} show={employeeDetail !== undefined} handleClick={(e) => handleEmployeeidClick(e)} onExit={() => setEmployeeDetail()} />
      <div className="table-responsive">
        {!props.data.isLoading && props.data.logs && props.headerInfo ? (
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                {[
                  "Floorpass ID",
                  "Employee",
                  "Supervisor",
                  "Location",
                  "Department",
                  "Time",
                  "Purpose",
                  "Status",
                ].map((header) => {
                  return <th key={props.name + header}>{header}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {props.data.logs.map((item, i) => {
                return (
                  <tr
                    className="table-light"
                    key={props.name + i}
                  // onClick={props.onClick ? () => props.onClick(item) : null}
                  >
                    <td>{props.type !== 'Supervisor' ? item.reference_id : <a href='#' onClick={() => { handleFloorpassClick(item) }} className='badge'>{item.reference_id}</a>}</td>
                    <td>{props.type !== 'Supervisor' ? item.employee_id : <a href='#' onClick={() => { handleEmployeeidClick({ employee_id: item.employee_id, datefrom: '' }) }} className='badge'>{item.employee_id}</a>}</td>
                    <td>{item.supervisor_id}</td>
                    <td>{item.location}</td>
                    <td>{item.department}</td>
                    <td>{item.logdatetime_str}</td>
                    <td>{item.purpose}</td>
                    <td>{item.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
            <p>loading...</p>
          )}
      </div>
    </>
  );
}

function Floorpass({ detail, ...props }) {
  return detail !== undefined ? <Modal show={props.show} onHide={() => props.onExit()}>
    <Modal.Header>Floorpass ID: {detail.reference_id}</Modal.Header>
    <Modal.Body>
      <div>Supervisor: {detail.supervisor_id}</div>
      <div className="row">
        <div className="col col-6">Department: {detail.department}</div>
        <div className="col col-6">Location: {detail.location}</div>
      </div>
      <br />
      {detail.reports && detail.reports.length > 0 ?
        detail.reports.map((employee, i) => {
          return <div className="table-responsive">
            <div>{employee.employee}</div>
            <table className="table table-bordered table-sm">
              <tr> <th>From</th><th>To</th><th>Elapse</th></tr>
              {employee.report.map((des, i) => { return <tr key={"rep" + i}><td>{des.from.loc} </td><td>{des.to.loc}</td> <td>{des.elapse}</td> </tr> })}
            </table>
            {/* <hr /> */}
          </div>
        })
        : null}
    </Modal.Body>
    <Modal.Footer>
      <Button
        size="sm"
        variant="primary"
        onClick={() => {
          props.onExit();
        }}
      >
        Okay
      </Button>
    </Modal.Footer>
  </Modal> : null

}

function Employee({ detail, ...props }) {
  const [dateFrom, setDateFrom] = useState('')
  useEffect(() => {
    if (detail !== undefined) {
      props.handleClick({ employee_id: detail.employee_id, datefrom: dateFrom })
    }
  }, [dateFrom])

  return detail !== undefined ? <Modal show={props.show} onHide={() => props.onExit()}>
    <Modal.Header><div>Employee ID: {detail.employee_id}</div><div><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></div></Modal.Header>
    <Modal.Body>
      {detail.reports && detail.reports.length > 0 ?
        detail.reports.map((floorpass, i) => {
          return <div key={'flr' + i} className="table-responsive">
            <div>{floorpass.reference_id}</div>
            <table className="table table-bordered table-sm">
              <tr> <th>From</th><th>To</th><th>Elapse</th></tr>
              {floorpass.report.map((des, i) => { return <tr key={"rep" + i}><td>{des.from.loc} </td><td>{des.to.loc}</td> <td>{des.elapse}</td> </tr> })}
            </table>
            {/* <hr /> */}
          </div>
        })
        : null}
    </Modal.Body>
    <Modal.Footer>
      <Button
        size="sm"
        variant="primary"
        onClick={() => {
          props.onExit();
        }}
      >
        Okay
      </Button>
    </Modal.Footer>
  </Modal> : null
}



function Header(props) {
  const { auth } = useContext(AuthContext);
  return (
    <Navbar variant="dark" bg="dark">
      <Navbar.Brand>Online Floorpass</Navbar.Brand>
      {auth !== undefined && auth.type === "Supervisor" ?
        <>
          <button className="btn btn-outline-primary btn-sm m-1" >Logs</button>
          <button className="btn btn-outline-primary  btn-sm m-1" >Floorpass</button>
        </> : null}
      {props.children}

      {auth.username ? (
        <NavDropdown className="ml-auto" title={auth.name}>
          <NavDropdown.Item
            size="sm"
            onClick={() => {
              localStorage.removeItem("auth");
              window.location.reload();
            }}
          >
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      ) : null}
    </Navbar>
  );
}

export default { Header, Filter };
