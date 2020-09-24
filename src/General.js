import React, { useContext, useState, useEffect, useReducer } from "react";
import { Navbar, NavDropdown, Form } from "react-bootstrap";

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
    // alert('daan')
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
                {/* <img alt /> */}
                {/* <button className="btn btn-success btn-sm" >Refresh</button> */}
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
              <Util.Select
                className="p-1 col-sm-7 col-md-3 col-lg-3 ml-md-auto ml-lg-auto"
                keyLoc="filter"
                label="Department"
                name="department"
                default={filter.department}
                options={departments ? departments : []}
                onChange={(e) =>
                  handleChange({ [e.target.name]: e.target.value })
                }
              />
              <Util.Select
                className="p-1 col-sm-7 col-md-3 col-lg-3 ml-md-auto ml-lg-auto"
                keyLoc="filter"
                label="Location"
                name="location"
                default={filter.location}
                options={data.locations}
                onChange={(e) => {
                  setDepartments(
                    data.locations.find((el) => el.name === e.target.value)
                      .departments
                  );
                  handleChange({ [e.target.name]: e.target.value });
                }}
              />
            </>
          ) : null}
        </div>
        <div className="row m-1">
          <Util.Log
            name="log"
            headerInfo={props.headerInfo}
            data={{ logs: filter.result, isLoading: false }}
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

function Header(props) {
  const { auth } = useContext(AuthContext);

  return (
    <Navbar variant="dark" bg="dark">
      <Navbar.Brand>Online Floor Pass</Navbar.Brand>
      {props.children}

      {auth.username ? (
        <NavDropdown className="ml-auto" title={auth.name}>
          <NavDropdown.Item
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
