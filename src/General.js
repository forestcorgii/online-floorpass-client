import React, { useContext, useState, useEffect } from "react";
import { Navbar, NavDropdown, Collapse, Button, Form } from "react-bootstrap";

import * as Util from "./Util";
import * as API from "./Api/Api";

import AuthContext from "./Contexts/AuthContext";
import DataContext from "./Contexts/DataContext";

function Filter(props) {
  const { auth } = useContext(AuthContext);
  const data = useContext(DataContext);

  const [filter, setFilter] = useState(auth);
  const [collapse, setCollapse] = useState(false);
  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!props.isEditting) {
      const interval = setInterval(() => {
        console.log("nag filter");
        API.requestFilter(filter).then((x) => {
          props.setLog({ logs: x, isLoading: false });
          // }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [filter, props]);

  return (
    <div>
      <Form>
        <Form.Row inline="true">
          {props.children}
          <Button
            className="ml-auto m-2"
            size="sm"
            aria-controls="example-collapse-text"
            aria-expanded={collapse}
            onClick={() => setCollapse(!collapse)}
          >
            Filter
          </Button>
        </Form.Row>
        <Collapse in={collapse}>
          <div id="example-collapse-text">
            <Form.Row>
              <Util.Text
                placeholder="Supervisor ID"
                name="username"
                value={filter.username}
                onChange={(e) => handleChange(e)}
              />
              <Util.Select
                name="department"
                default={filter.department}
                options={data.departments}
                onChange={(e) => handleChange(e)}
              />
              <Util.Select
                name="location"
                default={filter.location}
                options={data.locations}
                onChange={(e) => handleChange(e)}
              />
            </Form.Row>
          </div>
        </Collapse>
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
        <NavDropdown className="ml-auto" title={auth.username}>
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
